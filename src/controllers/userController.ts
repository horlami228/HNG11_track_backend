import prisma from "../config/prismaClient.js";
import { Request, Response, NextFunction } from "express";
import { hashPassword, comparePassword } from "../utilities/hashPassword.js";
import User from "../models/userModel.js";
import sequelize from "../db/index.js";
import { Transaction } from "sequelize";
import Organisation from "../models/orgModel.js";
import UserOrganisation from "../models/userOrgModel.js";
import generateToken from "../utilities/jwtToken.js";
import { CustomRequest } from "../types/customRequest.js";
import { Op } from "sequelize";
import { QueryTypes } from "sequelize";
// create a new user
export const newUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, firstName, lastName, password, phone } = req.body;
  let dbTransaction: Transaction | undefined;
  let transaction;
  try {
    // hash the user password
    const hashedPassword = await hashPassword(password);

    // insert the new user record in the db
    // start a transaction

    if (!sequelize) {
      throw new Error("Sequelize instance is not available");
    }

    dbTransaction = await sequelize.transaction();
    const user: any = await User.create(
      {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phone,
      },
      { transaction: dbTransaction },
    );

    const org: any = await Organisation.create(
      {
        name: `${firstName}'s Organisation`,
      },
      { transaction: dbTransaction },
    );
    // insert into the association table
    const { userId } = user;
    const { orgId } = org;

    console.log("userid", userId, "orgId", orgId);

    await UserOrganisation.create(
      {
        userId,
        orgId,
      },
      { transaction: dbTransaction },
    );
    await dbTransaction.commit();
    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: { accessToken: token },
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    if (dbTransaction) {
      await dbTransaction.rollback();
    }
    error.clientMessage = "Registration unsuccesful";
    error.clientStatus = "Bad request";
    error.statusCode = 400;

    next(error);
  }
};

// login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    // find the user by the emai
    const foundUser: any = await User.findOne({
      where: { email: email },
    });

    if (!foundUser) {
      const error: any = new Error();
      error.customMessage = "Authentication failed";
      error.statusCode = 401;
      return next(error);
    }

    // confirm passowrd
    const isMatch = await comparePassword(password, foundUser.password);

    if (!isMatch) {
      const error: any = new Error();
      error.customMessage = "Authentication failed";
      error.statusCode = 401;
      return next(error);
    } else {
      // generateToken

      const token = generateToken(foundUser);

      // return the user and the token
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: token,
        },
        user: {
          userId: foundUser.userId,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          phone: foundUser.phone,
        },
      });
    }
  } catch (error: any) {
    error.customMessage = "Authentication failed";
    error.statusCode = 401;
    next(error);
  }
};

export const getUSer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const loggedInUserId = req?.user.userId;
  const requestedUserId = req?.params.id;
  console.log(
    "loggedInuserID",
    loggedInUserId,
    "requesteduserID",
    requestedUserId,
  );
  let data: any = {};
  try {
    const requestedUser: any = await User.findOne({
      where: {
        userId: requestedUserId,
      },
      include: [
        {
          model: Organisation,
          as: "organisations",
          through: { attributes: [] },
        },
      ],
      attributes: ["userId", "firstName", "lastName", "email", "phone"],
    });
    console.log("the requested user is", requestedUser);
    // if the user is not foundk
    if (!requestedUser) {
      const error: any = new Error();
      (error.customMessage = "User not found"),
        (error.clientStatus = "failed"),
        (error.statusCode = 422);
      return next(error);
    }
    // check if the requested user is also the logged in user
    if (loggedInUserId === requestedUserId) {
      // return the details
      const { userId, firstName, lastName, email, phone } = requestedUser;
      data = { userId, firstName, lastName, email, phone };
    } else {
      // not the logged in user
      // check if the requested user is part of any organisation the loggedin user is
      const commonOrganisations = await Organisation.findAll({
        include: [
          {
            model: User,
            as: "users",
            where: { userId: loggedInUserId },
            attributes: [],
            through: { attributes: [] },
          },
        ],
        where: {
          orgId: {
            [Op.in]: requestedUser.organisations.map((org: any) => org.orgId),
          },
        },
      });

      // check the length of the object
      // to know if there is any organisation data there
      console.log("the organisation", commonOrganisations);

      if (commonOrganisations.length > 0) {
        const { userId, firstName, lastName, email, phone } = requestedUser;
        data = { userId, firstName, lastName, email, phone };
      }
    }

    if (Object.keys(data).length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Fetched User Details Successfully",
        data,
      });
    } else {
      const error: any = new Error();
      error.customMessage = "Not authorized to view this user details";
      error.clientStatus = "failed";
      return next(error);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// get all organisations a user has
export const allOrganisation = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req?.user;

  try {
    // // get organisations
    // const user = User.findOne({
    //   where: {userId: userId},
    //   include: [{
    //     model: Organisation,
    //     as: "organisations"
    //   }]
    // })
    const organisations = await Organisation.findAll({
      include: [
        {
          model: User,
          as: "users",
          where: { userId: userId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });

    const orgData = organisations.map((org) => {
      const { orgId, name, description } = org.toJSON();
      return { orgId, name, description };
    });

    res.status(200).json({
      status: "success",
      message: "Fetched user organisations successfully",
      data: {
        organisation: orgData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get single organisation
export const getOrg = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  // get a single organisation by the id
  const orgId = req.params?.orgId;

  try {
    const org = await Organisation.findOne({
      where: { orgId: orgId },
      attributes: ["orgId", "name", "description"],
    });

    if (!org) {
      const error: any = new Error();
      error.customMessage = "Organisation not found";
      error.clientStatus = "failed";
      return next(error);
    }

    res.status(200).json({
      status: "success",
      message: "Orginsation retreived successfully",
      data: org,
    });
  } catch (error) {
    next(error);
  }
};

// create organisation
export const createOrg = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req?.user;
  const { name, description } = req.body;

  let dbTransaction: Transaction | undefined;

  try {
    if (!sequelize) {
      throw new Error("Sequelize instance is not available");
    }
    dbTransaction = await sequelize.transaction();

    // create new organisation
    const org: any = await Organisation.create(
      {
        name,
        description,
      },
      { transaction: dbTransaction },
    );

    // insert into association table
    const { orgId } = org;
    await UserOrganisation.create(
      {
        userId: userId,
        orgId: orgId,
      },
      { transaction: dbTransaction },
    );

    await dbTransaction.commit();
    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error: any) {
    if (dbTransaction) {
      dbTransaction.rollback();
    }
    (error.clientMessage = "Client error"), (error.statusCode = 400);
    next(error);
  }
};

// add a user to a particular organisation
export const addToOrg = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.body;
  const { orgId } = req.params;

  let dbTransaction: Transaction | undefined;
  try {
    if (!sequelize) {
      throw new Error("Sequelize instance is not available");
    }
    // check if the userId is correct

    const org = await Organisation.findOne({
      where: { orgId: orgId },
    });
    console.log("the org", org);
    dbTransaction = await sequelize?.transaction();
    if (!org) {
      const error: any = new Error();
      error.customMessage = "Organisation does not exist";
      error.statusCode = 422;
      return next(error);
    }
    const user = await User.findOne({
      where: { userId: userId },
    });
    console.log("the user for this", user);

    if (!user) {
      const error: any = new Error();
      error.customMessage = "User found";
      error.statusCode = 422;
      return next(error);
    }

    // insert the user into the association
    await UserOrganisation.create(
      {
        userId: userId,
        orgId: orgId,
      },
      { transaction: dbTransaction },
    );

    await dbTransaction.commit();

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    next(error);
  }
};

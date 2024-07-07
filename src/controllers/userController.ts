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
// create a new user
export const newUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, firstName, lastName, password, phone } = req.body;
  let dbTransaction: Transaction | undefined;

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
    await UserOrganisation.create(
      {
        userId: user.userId,
        orgId: org.orgId,
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

const getUSer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req?.user;
  const userId = req.params.id;

  try {
    const found = await User.findOne({
      where: { userId: userId },
    });

    if (found) {
    }
  } catch (error) {}
};

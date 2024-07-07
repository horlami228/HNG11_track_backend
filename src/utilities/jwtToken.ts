import jwt from "jsonwebtoken";
import User from "../models/userModel";
import "../config.js";

// This function generates the JWT token

const generateToken = (user: any): string => {
  const payload = {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const secretKey = process.env.JWT_SECRET_KEY || "";
  const options: jwt.SignOptions = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secretKey, options);
};

export default generateToken;

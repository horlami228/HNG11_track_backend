import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/customRequest";
import "../config.js";
// Middleware to verify the jwt token and pass the decoded use to the next middleware

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  // get the token from the headers, query param or cookies
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token ||
      req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // verify token
    const secretKey = process.env.JWT_SECRET_KEY || "";
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    next();
  } catch (error: any) {
    error.customMessage = "Authentication failed";
    error.statusCode = 401;
  }
};

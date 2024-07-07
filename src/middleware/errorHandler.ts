// Error handling middleware
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  customMessage?: string;
  clientStatus?: string;
  cleanUp?: () => void;
}

function errorHandlingMiddleware(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const statusCode = error.statusCode || 500;
  const clientMessage =
    error.customMessage ||
    "An unexpected error occurred. Please try again later.";
  const clientStatus = error.clientStatus || "Bad request";
  const internalDetails = {
    message: error.message,
    stack: error.stack,
    cleanUp: error.cleanUp,
  };

  // log full error to console
  console.error("Full error:", internalDetails);

  // send client message

  res
    .status(statusCode)
    .json({
      status: clientStatus,
      message: clientMessage,
      statusCode: statusCode,
    });
}

export default errorHandlingMiddleware;

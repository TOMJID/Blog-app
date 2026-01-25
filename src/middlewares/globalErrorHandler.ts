import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    errorDetails = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "Unique Constraint Violation";
      errorDetails = err.meta;
    } else if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Record Not Found";
      errorDetails = err.meta || "The requested record was not found";
    } else {
      statusCode = 400;
      errorMessage = "Prisma Client Known Request Error";
      errorDetails = err;
    }
  } else if (err instanceof Error) {
    errorMessage = err.message;
    if (errorMessage.toLowerCase().includes("not found")) {
      statusCode = 404;
    } else if (
      errorMessage.toLowerCase().includes("unauthorized") ||
      errorMessage.includes("not logged in")
    ) {
      statusCode = 401;
    } else {
      statusCode = 400;
    }
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errorDetails,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}

export default errorHandler;

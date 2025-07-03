import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  console.error("*****************Unexpected Error*********************", error);

  return res.status(500).json({
    message: "Something went wrong",
    ...(isDevelopment && { originalError: error, stack: error.stack }),
  });
};

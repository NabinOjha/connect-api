import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (error instanceof AppError) {
    const errorJSON = error.toJSON();

    res.status(errorJSON.statusCode).json({
      message: errorJSON.message,
      ...(isDevelopment && { stack: error.stack }),
    });
    return;
  }

  res.status(500).json({
    message: "Something went wrong",
    ...(isDevelopment && { originalError: error, stack: error.stack }),
  });
};

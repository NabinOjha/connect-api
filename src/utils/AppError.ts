export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      stack: this.stack,
    };
  }
}

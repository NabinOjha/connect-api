import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../factories/asyncHandler";
import { UserService } from "../services/UserService";
import { ValidationService } from "../services/ValidationService";
import { signUpSchema } from "../schemas/user.schema";
import AuthService from "../services/AuthService";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = ValidationService.validateSignUp(req.body, signUpSchema);

    await UserService.checkIfExists(data.email);
    const user = await UserService.create(data);
    
    const token = AuthService.generateVerificationToken(user.id)
    await AuthService.sendVerificationEmail(user.email, token);

    res.status(201).json({
      message: "User created successfully",
      userId: user.id,
    });
  }
);

export const signIn = (req: Request, res: Response, next: NextFunction) => {};

export const signOut = (req: Request, res: Response, next: NextFunction) => {};

export const sendResetPasswordLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const resetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const checkAuthentication = (
  req: Request,
  response: Response,
  next: NextFunction
) => {};

export const checkAuthorization = (
  req: Request,
  response: Response,
  next: NextFunction
) => {};

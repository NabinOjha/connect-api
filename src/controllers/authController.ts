import bcrypt from "bcrypt";

import { UserService } from "./../services/UserService";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../factories/asyncHandler";
import { ValidationService } from "../services/ValidationService";
import { signUpSchema } from "../schemas/user.schema";
import AuthService from "../services/AuthService";
import { AppError } from "../utils/AppError";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const data = ValidationService.validateSignUp(req.body, signUpSchema);

  await UserService.checkIfExists(data.email);
  const user = await UserService.create(data);

  const token = AuthService.generateToken(user.id);
  await UserService.update(user.id, { verificationToken: token });
  await AuthService.sendVerificationEmail(user.email, token);

  res.status(201).json({
    message: "User created successfully",
    userId: user.id,
  });
});

export const verifySignUp = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.body.token;
    if (!token) throw new AppError("Token not present", 400);

    const authToken = await AuthService.verifySignUp(token);
    const oneDay = 24 * 60 * 60 * 1000;

    res.cookie("job_connect_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: oneDay,
    });

    res.status(200).json({ message: "Token varified successfully" });
  }
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const user = await UserService.findByEmail(email);

    if (!user) throw new AppError("User does not exist");

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      const token = AuthService.generateToken(user.id);
      const oneDay = 24 * 60 * 60 * 1000;

      res.cookie("job_connect_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: oneDay,
      });
    }

    res.status(200).json({ message: "Logged in successfully" });
  }
);

export const signOut = (_req: Request, res: Response) => {
  res.clearCookie("job_connect_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

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

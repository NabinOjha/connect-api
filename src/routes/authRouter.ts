import express from "express";
import {
  resetPassword,
  sendResetPasswordLink,
  signIn,
  signOut,
  signUp,
  verifySignUp,
  updatePassword,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/verify", verifySignUp);
authRouter.post("/signin", signIn);
authRouter.delete("/signout", signOut);
authRouter.post("/reset-password-link", sendResetPasswordLink);
authRouter.put("/reset-password", resetPassword);
authRouter.put("/update-password", updatePassword);

export default authRouter;

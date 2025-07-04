import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { EmailService } from "./EmailService";
import { AppError } from "../utils/AppError";
import { UserService } from "./UserService";

type JWTEXPIRY = "1d" | "1hr";
class AuthService {
  static generateToken(userId: number, expiresIn: JWTEXPIRY = "1hr") {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: expiresIn,
    });
  }

  static generateVerificationUrl(token: string) {
    return `${process.env.APP_URL}/auth/verify/${token}`;
  }

  static async sendVerificationEmail(email: string, token: string) {
    try {
      const verifyUrl = this.generateVerificationUrl(token);

      const templatePath = path.join(
        __dirname,
        "..",
        "views",
        "verificationEmail.ejs"
      );
      const html = await ejs.renderFile(templatePath, {
        verifyUrl,
        appName: process.env.APP_NAME || "Job Connect",
      });
      const emailService = new EmailService();
      await emailService.sendEmail(email, "Verify your email address", html);
    } catch (err) {
      throw new AppError("Error while sending email");
    }
  }

  static decodeToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
        complete: false,
      }) as JwtPayload;

      return decoded;
    } catch (err) {
      console.error("Invalid token", err);
      return false;
    }
  }

  static async verifySignUp(token: string) {
    const payload = this.decodeToken(token);
    if (!payload) throw new AppError("Invalid token.", 401);

    const userId = payload.userId;
    const user = await UserService.findById(userId);
    if (!user || user.verficationToken !== token)
      throw new AppError("User does not exist.", 401);

    await UserService.update(userId, { verified: true });
    return AuthService.generateToken(userId, "1d");
  }
}

export default AuthService;

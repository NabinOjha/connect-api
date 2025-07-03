import jwt from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

import { EmailService } from "./EmailService";
import { AppError } from "../utils/AppError";

class AuthService {
  static generateVerificationToken(userId: number) {
    return jwt.sign({ userId }, process.env.JWT_SECRET);
  }

  static generateVerificationUrl(token: string) {
    return `${process.env.APP_URL}?t=${token}`;
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
      console.log("Verification Email Error", err);
      throw new AppError("Error while sending email");
    }
  }
}

export default AuthService;

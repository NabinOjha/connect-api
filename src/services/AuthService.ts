import { AppError } from "../utils/AppError";
import { UserService } from "./UserService";
import { User } from "@prisma/client";
import { TokenService } from "./TokenService";
import { IUrlService } from "../interfaces/urlService";
import { ITokenService } from "../interfaces/tokenService";
import { IEmailService } from "../interfaces/emailService";
import { ITemplateService } from "../interfaces/templateService";
class AuthService {
  constructor(
    private urlService: IUrlService,
    private tokenService: ITokenService,
    private emailService: IEmailService,
    private templateService: ITemplateService
  ) {}

  async createNewTokenAndSendVerificationEmail(user: User): Promise<void> {
    const token = this.tokenService.generateToken(user.id);
    await UserService.update(user.id, { verificationToken: token });
    await this.sendVerificationEmail(user.email, token);
  }

  async sendVerificationEmail(email: string, token: string) {
    try {
      const verifyUrl = this.urlService.generateVerificationUrl(token);
      const html = await this.templateService.render("verificationEmail.ejs", {
        verifyUrl,
        appName: process.env.APP_NAME || "Job Connect",
      });

      await this.emailService.sendEmail(
        email,
        "Verify your email address",
        html
      );
    } catch (err) {
      throw new AppError("Error while sending email");
    }
  }

  static async verifySignUp(token: string) {
    const tokenService = new TokenService();
    const payload = tokenService.verifyToken(token);
    if (!payload) throw new AppError("Invalid token.", 401);

    const userId = payload.userId;
    const user = await UserService.findById(userId);
    if (!user || user.verficationToken !== token)
      throw new AppError("User does not exist.", 401);

    await UserService.update(userId, { verified: true });
    return tokenService.generateToken(userId, "1d");
  }
}

export default AuthService;

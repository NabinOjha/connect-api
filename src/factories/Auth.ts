import AuthService from "../services/AuthService";
import { EmailService } from "../services/EmailService";
import { TemplateService } from "../services/TemplateService";
import { TokenService } from "../services/TokenService";
import { UrlService } from "../services/UrlService";

export class Auth {
  static create() {
    return new AuthService(
      new UrlService(),
      new TokenService(),
      new EmailService(),
      new TemplateService()
    );
  }
}
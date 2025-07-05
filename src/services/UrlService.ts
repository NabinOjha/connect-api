import { IUrlService } from "../interfaces/urlService";

export class UrlService implements IUrlService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.APP_URL || "http://localhost:3000";
  }

  generateVerificationUrl(token: string): string {
    return `${this.baseUrl}/auth/verify/${token}`;
  }
}

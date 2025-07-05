export interface IEmailService {
  sendEmail(email: string, subject: string, html: string): Promise<void>;
}

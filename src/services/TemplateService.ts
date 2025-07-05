import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { ITemplateService } from "../interfaces/templateService";
import { AppError } from "../utils/AppError";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TemplateService implements ITemplateService {
  private readonly templatesPath: string;

  constructor(templatesPath?: string) {
    this.templatesPath = templatesPath || path.join(__dirname, "..", "views");
  }

  async render(templateName: string, data: any): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
      return await ejs.renderFile(templatePath, data);
    } catch (err) {
      throw new AppError(`Error rendering template: ${templateName}`);
    }
  }
}

export interface ITemplateService {}

export interface ITemplateService {
  render(templateName: string, data: any): Promise<string>;
}

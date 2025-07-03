import { z } from "zod/v4";
import { AppError } from "../utils/AppError";

export class ValidationService {
  static validateSignUp(data: any, schema: any) {
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      throw new AppError(z.treeifyError(parseResult.error).errors.join());
    }
    return parseResult.data;
  }
}

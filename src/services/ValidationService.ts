import { z } from "zod/v4";
import { AppError } from "../utils/AppError";

export class ValidationService {
  static validateSignUp<T extends z.ZodType>(
    data: unknown,
    schema: T
  ): z.infer<T> {
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      throw new AppError(z.treeifyError(parseResult.error).errors.join());
    }
    return parseResult.data;
  }
}

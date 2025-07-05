import jwt, { JwtPayload } from "jsonwebtoken";

import { AppError } from "../utils/AppError";

export type JWTEXPIRY = "1d" | "1hr";

export interface ITokenService {
  generateToken(userId: number, expiresIn?: JWTEXPIRY): string;

  verifyToken(token: string): JwtPayload | null;
}

export class TokenService implements ITokenService {
  private readonly jwtSecret: string;

  constructor(jwtSecret?: string) {
    this.jwtSecret = jwtSecret || process.env.JWT_SECRET!;

    if (!this.jwtSecret) {
      throw new AppError("JWT_SECRET is required");
    }
  }

  generateToken(userId: number, expiresIn: JWTEXPIRY = "1hr"): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        complete: false,
      }) as JwtPayload;
      return decoded;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  }
}

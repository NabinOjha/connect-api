
import { JwtPayload } from "jsonwebtoken";

export type JWTEXPIRY = "1d" | "1hr";

export interface ITokenService {

  generateToken(userId: number, expiresIn?: JWTEXPIRY): string;


  verifyToken(token: string): JwtPayload | null;
}
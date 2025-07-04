import { type User } from "./../schemas/user.schema";
import _ from "lodash";

import bcrypt from "bcrypt";
import prismaClient from "../prisma/client";
import { AppError } from "../utils/AppError";

export class UserService {
  static async findByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: number) {
    return await prismaClient.user.findUnique({
      where: { id },
    });
  }

  static async create(userData: User) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const data = _.omit(userData, ["confirmPassword"]);

    return await prismaClient.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  static async checkIfExists(email: string) {
    const user = await this.findByEmail(email);
    if (user) {
      throw new AppError("User already exists", 400);
    }
  }

  static async update(id: number, data: Partial<User>) {
    await prismaClient.user.update({
      where: { id },
      data,
    });
  }
}

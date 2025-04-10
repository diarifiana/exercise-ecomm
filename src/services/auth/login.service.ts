import { User } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { comparePassword } from "../../lib/argon";
import { sign } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config/env";

export const loginService = async (body: Pick<User, "email" | "password">) => {
  // cek email yg dimasukan ada atau tidak di database
  // jika tidak ada, throw error
  // jika ada, cek apakah password sesuai atau tidak
  // jika tidak sesuai, throw error
  // jika sesuai, kirim data user tersebut beserta token jwt (json web token)

  const { email, password } = body;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new ApiError("Invalid credentials", 400);
  }

  const isPassword = await comparePassword(password, user.password);

  if (!isPassword) {
    throw new ApiError("Invalid credentials", 400);
  }

  const tokenPayload = { id: user.id, role: user.role };

  const token = sign(tokenPayload, JWT_SECRET_KEY!, {
    expiresIn: "2h",
  });

  const { password: pw, ...userWithoutPassword } = user;

  return { ...userWithoutPassword, token };
};

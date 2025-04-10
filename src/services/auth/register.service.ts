import { User } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { hashPassword } from "../../lib/argon";

export const registerService = async (body: User) => {
  // cek email sudah terpakai atau belum
  // jika sudah, throw error
  // jika belum, hash password user
  // lalu buat user berdasarkan data yang dikirim

  const existingUser = await prisma.user.findFirst({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new ApiError("Email already exist", 400);
  }

  const hashedPassword = await hashPassword(body.password);

  const newUser = await prisma.user.create({
    // data: body,
    data: { ...body, password: hashedPassword },
    omit: { password: true },
  });

  return newUser;
};

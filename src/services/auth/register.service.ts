import { User } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { hashPassword } from "../../lib/argon";
import { transporter } from "../../lib/nodemailer";
import { join } from "path";
import fs from "fs/promises";
// import Handlebars from "handlebars";

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

  const templatePath = join(__dirname, "../../templates/welcome-email.hbs");

  const templateSource = (await fs.readFile(templatePath)).toString();

  // const compiledTemplate = Handlebars.compile(templateSource);

  // const html = compiledTemplate();

  transporter.sendMail({
    to: body.email,
    subject: "Welcome to My App",
    html: `Welcome ${body.fullName}!`,
  });

  return newUser;
};

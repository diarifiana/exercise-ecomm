import prisma from "../../config/prisma";
import { Product } from "@prisma/client";
import { ApiError } from "../../utils/api-error";
import { generateSlug } from "../../utils/generateSlug";
import { cloudinaryUpload } from "../../lib/cloudinary";

export const createProductService = async (
  body: Product,
  thumbnail: Express.Multer.File
) => {
  const existingProduct = await prisma.product.findFirst({
    where: { name: body.name },
  });

  if (existingProduct) {
    throw new ApiError("Product already exist", 400);
  }

  const { secure_url } = await cloudinaryUpload(thumbnail);

  const slug = generateSlug(body.name);

  const newProduct = await prisma.product.create({
    data: { ...body, slug, thumbnail: secure_url },
  });

  return newProduct;
};

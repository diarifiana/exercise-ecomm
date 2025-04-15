import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const getProductSlugService = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug: slug, deletedAt: null },
  });

  if (!product) {
    throw new ApiError("Product does not exist", 400);
  }

  return product;
};

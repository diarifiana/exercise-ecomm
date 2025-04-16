import prisma from "../../config/prisma";
import { cloudinaryRemove } from "../../lib/cloudinary";
import { ApiError } from "../../utils/api-error";

export const deleteProductService = async (id: number, authUserId: number) => {
  const product = await prisma.product.findFirst({
    where: { id: id, deletedAt: null },
    include: { store: true },
  });

  if (!product) {
    throw new ApiError("Product not found", 400);
  }

  if (product.storeId !== authUserId) {
    throw new ApiError("Unauthorised", 401);
  }

  await cloudinaryRemove(product.thumbnail);

  await prisma.product.update({
    where: { id: id },
    data: { deletedAt: new Date(), thumbnail: "" },
  });

  return { message: "Product deleted" };
};

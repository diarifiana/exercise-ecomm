import { Prisma } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import prisma from "../../config/prisma";

interface GetProductService extends PaginationQueryParams {
  search: string;
}

export const getProductService = async (queries: GetProductService) => {
  const { page, take, sortOrder, sortBy, search } = queries;

  const whereClause: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    take: take,
    skip: (page - 1) * take,
    orderBy: { [sortBy]: sortOrder },
  });

  const count = await prisma.product.count({ where: whereClause });

  return {
    data: products,
    meta: {
      page,
      take,
      total: count,
    },
  };
};

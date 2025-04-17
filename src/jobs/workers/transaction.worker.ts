import { Worker } from "bullmq";
import { redisConnection } from "../../lib/redis";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const userTransactionWorker = new Worker(
  "user-transaction-queue",
  async (job) => {
    // add logic
    // cek transaksi berdasarkan uuid
    // kalau statusnya masih WAITING_FOR_PAYMENT
    // update status transaksi tsb menjadi EXPIRED
    // kembalika stok berdasarkan qty
    // kalau statusnya selain WAITING_FOR_PAYMENT, tidak usah diubah

    const uuid = job.data.uuid;

    const transaction = await prisma.transaction.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!transaction) {
      throw new ApiError("Invalid transaction id", 400);
    }

    if (transaction.status === "WAITING_FOR_PAYMENT") {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: {
            uuid: uuid,
          },
          data: { status: "EXPIRED" },
        });

        await tx.product.update({
          where: {
            id: transaction.productId,
          },
          data: {
            stock: { increment: transaction.qty },
          },
        });
      });
    }
  },
  { connection: redisConnection }
);

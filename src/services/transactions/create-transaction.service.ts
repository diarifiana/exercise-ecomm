import { Transaction } from "@prisma/client";
import prisma from "../../config/prisma";
import { userTransactionQueue } from "../../jobs/queues/transaction.queue";
import { ApiError } from "../../utils/api-error";

export const createTransactionService = async (
  body: Pick<Transaction, "productId" | "qty">,
  authUserId: number
) => {
  // userId & role dibawa oleh token
  // cek stock masih ada atau tidak
  // kalau tidak cukup throw error
  // kalau cukup buat transaksi baru
  // create transaksi baru dan masukan kedalam variable
  // create data baru menggunakan bullmq dan masukkan uuid transaksi
  // return message transaksi sukses

  const product = await prisma.product.findFirst({
    where: { id: body.productId },
  });

  if (!product) {
    throw new ApiError("Invalid product id", 400);
  }

  if (body.qty > product.stock) {
    throw new ApiError("Insufficient Stock", 400);
  }

  const newTransaction = await prisma.$transaction(async (tx) => {
    // menggunakan tx supaya jika salah satu process failed, bisa kerollback
    // mengurangi stock
    await tx.product.update({
      where: { id: body.productId },
      data: { stock: { decrement: body.qty } },
    });

    // memasukan data unique yang dimasukan ke bullmq
    return await tx.transaction.create({
      data: { ...body, userId: authUserId },
    });
  });

  await userTransactionQueue.add(
    "new-transaction",
    {
      uuid: newTransaction.uuid,
    },
    {
      delay: 60000, // delay in miliseconds
      removeOnComplete: true,
      attempts: 5, // mencoba beberapa kali
      backoff: { type: "exponential", delay: 1000 }, // jarak waktu antar attempt, (exponential - dikali 2 setiap attempt/ fix)
    }
  );

  return { message: "transaction success" };
};

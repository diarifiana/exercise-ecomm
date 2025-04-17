import { NextFunction, Request, Response } from "express";
import { createTransactionService } from "../services/transactions/create-transaction.service";
import { uploadPaymentProofService } from "../services/transactions/upload-payment-proof.service";

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createTransactionService(
      req.body,
      Number(res.locals.user.id)
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const uploadPaymentProofController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await uploadPaymentProofService(
      req.body.uuid,
      Number(res.locals.user.id)
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

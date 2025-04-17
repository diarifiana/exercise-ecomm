import { Router } from "express";
import { createTransactionController } from "../controllers/transaction.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middlewares/role.middleware";
import { validateCreateTransaction } from "../validators/transaction.validator";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifyRole(["USER"]),
  validateCreateTransaction,
  createTransactionController
);

export default router;

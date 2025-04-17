import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/api-error";
import { NextFunction, Request, Response } from "express";

export const validateCreateTransaction = [
  body("productId").notEmpty().withMessage("ProductId is required"),
  body("qty").notEmpty().withMessage("Qty is required"),

  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ApiError(errors.array()[0].msg, 400);
    }

    next();
  },
];

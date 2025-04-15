import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductSlugController,
  updateProductController,
} from "../controllers/product.controller";
import { verifyToken } from "../lib/jwt";
import { verifyRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/", getProductController);
router.get("/:slug", getProductSlugController);
router.post("/", verifyToken, verifyRole(["ADMIN"]), createProductController);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  updateProductController
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteProductController
);

export default router;

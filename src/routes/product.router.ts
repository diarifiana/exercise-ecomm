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
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";

const router = Router();

router.get("/", getProductController);
router.get("/:slug", getProductSlugController);
router.post(
  "/",
  verifyToken,
  verifyRole(["ADMIN"]),
  uploader(5).fields([{ name: "thumbnail", maxCount: 1 }]),
  fileFilter(["image/jpeg", "image/png", "image/avif"]),
  createProductController
);
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

import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";
import { validateLogin, validateRegister } from "../validators/auth.valid";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);

export default router;

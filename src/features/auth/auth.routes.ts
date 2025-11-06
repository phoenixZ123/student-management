import { Router } from "express";
import { userSchema } from "./schema/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
const authService = new AuthService();
const authController = new AuthController(authService);

const router=Router();

router.post("/login",authController.loginUser.bind(authController));

export default router;
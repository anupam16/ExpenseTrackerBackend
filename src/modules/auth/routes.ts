import { Router } from "express";
import { register, login, me, refreshToken, logout } from "./controller";
import { authMiddleware, validate } from "../../middleware/authMiddleware";
import { registerSchema, loginSchema } from "./validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
export default router;

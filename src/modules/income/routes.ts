import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";

import { createIncomeController, getIncomesController } from "./controller";

import { createIncomeSchema } from "./validation";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createIncomeSchema),
  createIncomeController,
);

router.get("/", authMiddleware, getIncomesController);

export default router;

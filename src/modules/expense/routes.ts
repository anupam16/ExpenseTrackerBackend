import { Router } from "express";
import {
  createExpenseController,
  deleteExpenseController,
  getExpensesController,
  getExpenseByIdController,
} from "./controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { createExpenseSchema } from "./validation";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createExpenseSchema),
  createExpenseController,
);

router.get("/", authMiddleware, getExpensesController);

router.get("/:id", authMiddleware, getExpenseByIdController);
router.delete("/:id", authMiddleware, deleteExpenseController);

export default router;

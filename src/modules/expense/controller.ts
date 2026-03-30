import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import {
  createExpense,
  getExpenseById,
  getExpenses,
  deleteExpense,
} from "./service";

export const createExpenseController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expense = await createExpense(req.user!.userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpensesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = req.query.category as string | undefined;
    const tag = req.query.tag as string | undefined;
    const year = req.query.year as string | undefined;

    const expenses = await getExpenses(req.user!.userId, category, tag, year);

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseByIdController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expense = await getExpenseById(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpenseController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteExpense(req.params.id as string, req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

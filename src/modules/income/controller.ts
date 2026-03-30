import { Request, Response, NextFunction } from "express";
import { createIncomeService, getIncomesService } from "./service";
interface CustomRequest extends Request {
  user?: {
    userId: string;
    // add other properties you expect
  };
}
export const createIncomeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const income = await createIncomeService(
      req.body,
      (req as CustomRequest).user!.userId,
    );

    res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { year } = req.query;

    const incomes = await getIncomesService(
      (req as CustomRequest).user!.userId,
      year as string,
    );

    res.status(200).json({
      success: true,
      data: incomes,
    });
  } catch (error) {
    next(error);
  }
};

import { prisma } from "@lib/prisma";
import { Prisma } from "../../generated/client";
import { CreateExpenseInput } from "./validation";
import { generateExpenseSummary } from "../ai/service";

export const createExpense = async (
  userId: string,
  data: CreateExpenseInput,
) => {
  const expense = await prisma.expense.create({
    data: {
      title: data.title,
      description: data.description,
      amount: new Prisma.Decimal(data.amount),
      date: new Date(data.date),
      category: data.category,
      tags: data.tags || [],
      userId,
    },
  });

  return expense;
};

export const getExpenses = async (
  userId: string,
  category?: string,
  tag?: string,
  year?: string,
) => {
  const where: any = {
    userId,
  };

  if (category) {
    where.category = category;
  }

  if (tag) {
    where.tags = {
      has: tag,
    };
  }

  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: {
      date: "desc",
    },
  });

  return expenses;
};

export const getExpenseById = async (expenseId: string, userId: string) => {
  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });

  if (!expense) {
    throw new Error("Expense not found");
  }

  return expense;
};

export const deleteExpense = async (expenseId: string, userId: string) => {
  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });

  if (!expense) {
    throw new Error("Expense not found or unauthorized");
  }

  await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  return expense;
};

export const getExpenseSummary = async (userId: string, month: string) => {
  const startDate = new Date(`${month}-01`);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const categoryMap: Record<string, number> = {};

  let total = 0;

  expenses.forEach((expense) => {
    const category = expense.category || "Uncategorized";
    const amount = Number(expense.amount);

    categoryMap[category] = (categoryMap[category] || 0) + amount;
    total += amount;
  });

  const aiSummary = await generateExpenseSummary({
    month,
    total,
    categories: categoryMap,
  });

  return {
    month,
    total,
    categories: categoryMap,
    aiSummary,
  };
};

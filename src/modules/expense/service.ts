import { prisma } from "@lib/prisma";
import { Prisma } from "../../generated/client";
import { CreateExpenseInput } from "./validation";

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

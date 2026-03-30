import { prisma } from "@lib/prisma";
import { Prisma } from "../../generated/client";
import { CreateIncomeInput } from "./validation";

export const createIncomeService = async (
  data: CreateIncomeInput,
  userId: string,
) => {
  const income = await prisma.income.create({
    data: {
      title: data.title,
      amount: new Prisma.Decimal(data.amount),
      date: new Date(data.date),

      ...(data.source && { source: data.source }),
      ...(data.description && { description: data.description }),

      userId,
    },
  });

  return income;
};

export const getIncomesService = async (userId: string, year?: string) => {
  const where: any = {
    userId,
  };

  if (year) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${Number(year) + 1}-01-01`);

    where.date = {
      gte: start,
      lt: end,
    };
  }

  return prisma.income.findMany({
    where,
    orderBy: {
      date: "desc",
    },
  });
};

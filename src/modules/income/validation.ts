import { z } from "zod";

export const createIncomeSchema = z.object({
  title: z.string().min(1, "Title is required"),

  amount: z.number().positive("Amount must be greater than 0"),

  date: z.string().datetime(),

  source: z.string().optional(),

  description: z.string().optional(),
});

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;

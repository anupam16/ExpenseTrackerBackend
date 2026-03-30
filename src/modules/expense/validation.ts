import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().positive(),
  date: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

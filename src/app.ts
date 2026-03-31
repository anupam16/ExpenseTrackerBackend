import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/routes";
import { errorHandler } from "./middleware/errorMiddleware";
import expenseRoutes from "./modules/expense/routes";
import incomeRoutes from "./modules/income/routes";
import { env } from "./config/env";
const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use(errorHandler);

export default app;

import bcrypt from "bcrypt";
import { prisma } from "@lib/prisma.js";
import { RegisterInput, LoginInput } from "./validation";

import jwt from "jsonwebtoken";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordMatch = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const refreshAccessToken = async (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
    userId: string;
  };

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    },
  );

  return accessToken;
};

import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(100)
});

export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(72)
});


import { z } from 'zod';

export const registerSchema = z.object({
  username: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string().min(3).max(50)),
  email: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase().trim() : val), z.string().email()),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.preprocess((val) => (typeof val === 'string' ? val.toLowerCase().trim() : val), z.string().email()),
  password: z.string().min(1),
});


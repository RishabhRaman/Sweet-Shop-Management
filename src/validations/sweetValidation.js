import { z } from 'zod';

export const createSweetSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  category: z.string().min(1).max(50).trim(),
  price: z.number().min(0),
  quantity: z.number().int().min(0).default(0),
});

export const updateSweetSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  category: z.string().min(1).max(50).trim().optional(),
  price: z.number().min(0).optional(),
  quantity: z.number().int().min(0).optional(),
});

export const purchaseSchema = z.object({
  quantity: z.number().int().min(1).optional().default(1),
});

export const restockSchema = z.object({
  quantity: z.number().int().min(1),
});


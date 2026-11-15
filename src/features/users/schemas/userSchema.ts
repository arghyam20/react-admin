import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1, 'Email is required').email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().max(20).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  role_ids: z.array(z.number()).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1, 'Email is required').email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  role_ids: z.array(z.number()).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

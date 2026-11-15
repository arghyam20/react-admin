import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255),
  slug: z.string().max(255).optional().or(z.literal('')),
  parent_id: z.number().nullable().optional(),
  description: z.string().max(1000).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
  ordering: z.coerce.number().min(0).default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().max(255).optional().or(z.literal('')),
  category_id: z.coerce.number({ required_error: 'Please select a category' }).min(1, 'Please select a category'),
  content: z.string().min(1, 'Blog content is required'),
  excerpt: z.string().max(1000).optional().or(z.literal('')),
  seo_title: z.string().max(255).optional().or(z.literal('')),
  seo_description: z.string().max(500).optional().or(z.literal('')),
  seo_keywords: z.string().max(255).optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional().or(z.literal('')),
});

export type BlogFormData = z.infer<typeof blogSchema>;

import { CategoryItem } from '@/features/categories/types/category.types';
import { AuthUser } from '@/features/auth/types/auth.types';

export interface BlogItem {
  id?: number;
  uuid: string;
  category_id: number;
  author_id?: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  view_count: number;
  published_at?: string | null;
  created_at: string;
  updated_at?: string;
  category?: CategoryItem;
  author?: AuthUser;
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  category_id: number;
  content: string;
  excerpt?: string;
  featured_image?: File | null;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  published_at?: string | null;
}

export interface UpdateBlogInput {
  title?: string;
  slug?: string;
  category_id?: number;
  content?: string;
  excerpt?: string;
  featured_image?: File | null;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  published_at?: string | null;
}

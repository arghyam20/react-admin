import { AuthUser } from '@/features/auth/types/auth.types';

export interface DashboardStats {
  totalUsers: number;
  totalCategories: number;
  totalBlogs: number;
  activeUsers: number;
  publishedBlogs: number;
}

export interface RecentBlogItem {
  uuid: string;
  title: string;
  slug: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  category?: {
    name: string;
  };
  author?: {
    name: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recentBlogs: RecentBlogItem[];
  recentUsers: AuthUser[];
}

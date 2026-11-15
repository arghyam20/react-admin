import { api } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { PaginatedResponse } from '@/types/common.types';
import { AuthUser } from '@/features/auth/types/auth.types';
import { DashboardData, RecentBlogItem } from '../types/dashboard.types';

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    // Fetch users, categories, and blogs in parallel from existing listing endpoints
    const [usersRes, categoriesRes, blogsRes] = await Promise.all([
      api.post<PaginatedResponse<AuthUser>>(API_ENDPOINTS.users.list, {
        per_page: 5,
        sort_by: 'created_at',
        sort_order: 'desc',
      }),
      api.post<PaginatedResponse<unknown>>(API_ENDPOINTS.categories.list, {
        per_page: 1,
      }),
      api.post<PaginatedResponse<RecentBlogItem>>(API_ENDPOINTS.blogs.list, {
        per_page: 5,
        sort_by: 'created_at',
        sort_order: 'desc',
      }),
    ]);

    const totalUsers = usersRes.meta?.total ?? 0;
    const totalCategories = categoriesRes.meta?.total ?? 0;
    const totalBlogs = blogsRes.meta?.total ?? 0;

    // Calculate active users and published blogs from listing samples or total counts
    const activeUsers = usersRes.data.filter((u) => u.status === 'active').length;
    const publishedBlogs = blogsRes.data.filter((b) => b.status === 'published').length;

    return {
      stats: {
        totalUsers,
        totalCategories,
        totalBlogs,
        activeUsers,
        publishedBlogs,
      },
      recentBlogs: blogsRes.data || [],
      recentUsers: usersRes.data || [],
    };
  },
};

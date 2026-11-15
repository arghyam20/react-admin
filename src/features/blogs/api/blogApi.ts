import { api } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';
import { BlogItem, CreateBlogInput, UpdateBlogInput } from '../types/blog.types';

export const blogApi = {
  getBlogs: async (params?: PaginationParams): Promise<PaginatedResponse<BlogItem>> => {
    return api.post<PaginatedResponse<BlogItem>>(API_ENDPOINTS.blogs.list, params || {});
  },

  getBlogByUuid: async (uuid: string): Promise<ApiResponse<BlogItem>> => {
    return api.get<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.show(uuid));
  },

  getBlogBySlug: async (slug: string): Promise<ApiResponse<BlogItem>> => {
    return api.get<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.showBySlug(slug));
  },

  createBlog: async (input: CreateBlogInput): Promise<ApiResponse<BlogItem>> => {
    if (input.featured_image) {
      const formData = new FormData();
      formData.append('title', input.title);
      if (input.slug) formData.append('slug', input.slug);
      formData.append('category_id', String(input.category_id));
      formData.append('content', input.content);
      if (input.excerpt) formData.append('excerpt', input.excerpt);
      if (input.seo_title) formData.append('seo_title', input.seo_title);
      if (input.seo_description) formData.append('seo_description', input.seo_description);
      if (input.seo_keywords) formData.append('seo_keywords', input.seo_keywords);
      if (input.status) formData.append('status', input.status);
      formData.append('is_featured', input.is_featured ? '1' : '0');
      if (input.published_at) formData.append('published_at', input.published_at);
      formData.append('featured_image', input.featured_image);

      return api.postForm<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.create, formData);
    }

    return api.post<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.create, input);
  },

  updateBlog: async (uuid: string, input: UpdateBlogInput): Promise<ApiResponse<BlogItem>> => {
    if (input.featured_image) {
      const formData = new FormData();
      if (input.title) formData.append('title', input.title);
      if (input.slug) formData.append('slug', input.slug);
      if (input.category_id) formData.append('category_id', String(input.category_id));
      if (input.content) formData.append('content', input.content);
      if (input.excerpt !== undefined) formData.append('excerpt', input.excerpt || '');
      if (input.seo_title !== undefined) formData.append('seo_title', input.seo_title || '');
      if (input.seo_description !== undefined) formData.append('seo_description', input.seo_description || '');
      if (input.seo_keywords !== undefined) formData.append('seo_keywords', input.seo_keywords || '');
      if (input.status) formData.append('status', input.status);
      if (input.is_featured !== undefined) formData.append('is_featured', input.is_featured ? '1' : '0');
      if (input.published_at !== undefined) formData.append('published_at', input.published_at || '');
      formData.append('featured_image', input.featured_image);

      return api.putForm<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.update(uuid), formData);
    }

    return api.put<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.update(uuid), input);
  },

  deleteBlog: async (uuid: string): Promise<ApiResponse<null>> => {
    return api.delete<ApiResponse<null>>(API_ENDPOINTS.blogs.delete(uuid));
  },

  publishBlog: async (uuid: string): Promise<ApiResponse<BlogItem>> => {
    return api.post<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.publish(uuid));
  },

  unpublishBlog: async (uuid: string): Promise<ApiResponse<BlogItem>> => {
    return api.post<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.unpublish(uuid));
  },

  toggleFeatured: async (uuid: string): Promise<ApiResponse<BlogItem>> => {
    return api.put<ApiResponse<BlogItem>>(API_ENDPOINTS.blogs.toggleFeatured(uuid));
  },
};

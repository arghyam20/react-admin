import { api } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';
import { CategoryItem, CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';

export const categoryApi = {
  getCategories: async (params?: PaginationParams): Promise<PaginatedResponse<CategoryItem>> => {
    return api.post<PaginatedResponse<CategoryItem>>(API_ENDPOINTS.categories.list, params || {});
  },

  getCategoryTree: async (): Promise<ApiResponse<CategoryItem[]>> => {
    return api.get<ApiResponse<CategoryItem[]>>(API_ENDPOINTS.categories.tree);
  },

  getCategoryByUuid: async (uuid: string): Promise<ApiResponse<CategoryItem>> => {
    return api.get<ApiResponse<CategoryItem>>(API_ENDPOINTS.categories.show(uuid));
  },

  createCategory: async (input: CreateCategoryInput): Promise<ApiResponse<CategoryItem>> => {
    if (input.image) {
      const formData = new FormData();
      formData.append('name', input.name);
      if (input.slug) formData.append('slug', input.slug);
      if (input.parent_id !== undefined && input.parent_id !== null) {
        formData.append('parent_id', String(input.parent_id));
      }
      if (input.description) formData.append('description', input.description);
      if (input.status) formData.append('status', input.status);
      if (input.ordering !== undefined) formData.append('ordering', String(input.ordering));
      formData.append('image', input.image);

      return api.postForm<ApiResponse<CategoryItem>>(API_ENDPOINTS.categories.create, formData);
    }

    return api.post<ApiResponse<CategoryItem>>(API_ENDPOINTS.categories.create, input);
  },

  updateCategory: async (uuid: string, input: UpdateCategoryInput): Promise<ApiResponse<CategoryItem>> => {
    if (input.image) {
      const formData = new FormData();
      if (input.name) formData.append('name', input.name);
      if (input.slug) formData.append('slug', input.slug);
      if (input.parent_id !== undefined && input.parent_id !== null) {
        formData.append('parent_id', String(input.parent_id));
      }
      if (input.description) formData.append('description', input.description);
      if (input.status) formData.append('status', input.status);
      if (input.ordering !== undefined) formData.append('ordering', String(input.ordering));
      formData.append('image', input.image);

      return api.putForm<ApiResponse<CategoryItem>>(API_ENDPOINTS.categories.update(uuid), formData);
    }

    return api.put<ApiResponse<CategoryItem>>(API_ENDPOINTS.categories.update(uuid), input);
  },

  deleteCategory: async (uuid: string): Promise<ApiResponse<null>> => {
    return api.delete<ApiResponse<null>>(API_ENDPOINTS.categories.delete(uuid));
  },

  updateOrdering: async (uuid: string, ordering: number): Promise<ApiResponse<CategoryItem>> => {
    return api.put<ApiResponse<CategoryItem>>(API_ENDPOINTS.categories.updateOrdering(uuid), { ordering });
  },
};

import { api } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';
import { CreateUserInput, RoleItem, UpdateUserInput, UserItem } from '../types/user.types';

export const userApi = {
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<UserItem>> => {
    return api.post<PaginatedResponse<UserItem>>(API_ENDPOINTS.users.list, params || {});
  },

  getUserByUuid: async (uuid: string): Promise<ApiResponse<UserItem>> => {
    return api.get<ApiResponse<UserItem>>(API_ENDPOINTS.users.show(uuid));
  },

  createUser: async (input: CreateUserInput): Promise<ApiResponse<UserItem>> => {
    return api.post<ApiResponse<UserItem>>(API_ENDPOINTS.users.create, input);
  },

  updateUser: async (uuid: string, input: UpdateUserInput): Promise<ApiResponse<UserItem>> => {
    return api.put<ApiResponse<UserItem>>(API_ENDPOINTS.users.update(uuid), input);
  },

  deleteUser: async (uuid: string): Promise<ApiResponse<null>> => {
    return api.delete<ApiResponse<null>>(API_ENDPOINTS.users.delete(uuid));
  },

  toggleUserStatus: async (uuid: string): Promise<ApiResponse<UserItem>> => {
    return api.put<ApiResponse<UserItem>>(API_ENDPOINTS.users.toggleStatus(uuid));
  },

  getRoles: async (): Promise<PaginatedResponse<RoleItem>> => {
    return api.post<PaginatedResponse<RoleItem>>(API_ENDPOINTS.roles.list, { per_page: 100 });
  },
};

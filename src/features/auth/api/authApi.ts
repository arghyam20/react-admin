import { api } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { ApiResponse } from '@/types/common.types';
import { AuthUser, LoginCredentials, LoginResponseData } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> => {
    return api.post<ApiResponse<LoginResponseData>>(API_ENDPOINTS.auth.login, credentials);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.auth.logout);
  },

  getMe: async (): Promise<ApiResponse<AuthUser>> => {
    return api.get<ApiResponse<AuthUser>>(API_ENDPOINTS.auth.me);
  },

  getProfile: async (): Promise<ApiResponse<AuthUser>> => {
    return api.get<ApiResponse<AuthUser>>(API_ENDPOINTS.auth.profile);
  },
};

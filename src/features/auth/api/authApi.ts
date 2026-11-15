import { api } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { ApiResponse } from '@/types/common.types';
import {
  AuthUser,
  ChangePasswordInput,
  LoginCredentials,
  LoginResponseData,
  UpdateProfileInput,
} from '../types/auth.types';

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

  updateProfile: async (input: UpdateProfileInput): Promise<ApiResponse<AuthUser>> => {
    if (input.avatar) {
      const formData = new FormData();
      if (input.name) formData.append('name', input.name);
      if (input.email) formData.append('email', input.email);
      if (input.phone) formData.append('phone', input.phone);
      formData.append('avatar', input.avatar);
      return api.putForm<ApiResponse<AuthUser>>(API_ENDPOINTS.auth.profile, formData);
    }
    return api.put<ApiResponse<AuthUser>>(API_ENDPOINTS.auth.profile, input);
  },

  changePassword: async (input: ChangePasswordInput): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.auth.changePassword, input);
  },
};

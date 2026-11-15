export interface UserRole {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  level?: number;
}

export interface AuthUser {
  uuid: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  status: 'active' | 'inactive' | 'pending';
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  roles?: UserRole[];
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: File | null;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

import { UserRole } from '@/features/auth/types/auth.types';

export interface UserItem {
  id?: number;
  uuid: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  status: 'active' | 'inactive' | 'pending';
  last_login_at?: string | null;
  last_login_ip?: string | null;
  created_at: string;
  updated_at?: string;
  roles?: UserRole[];
}

export interface RoleItem {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  level?: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  role_ids?: number[];
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  role_ids?: number[];
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost/laravel-api';

export const STORAGE_BASE_URL =
  import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost/laravel-api/storage';

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'auth_user';

export const USER_STATUSES = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'pending', label: 'Pending', color: 'warning' },
] as const;

export const CATEGORY_STATUSES = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
] as const;

export const BLOG_STATUSES = [
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'draft', label: 'Draft', color: 'warning' },
  { value: 'archived', label: 'Archived', color: 'default' },
] as const;

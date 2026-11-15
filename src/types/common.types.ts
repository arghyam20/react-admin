export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | string[];
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  errors?: Record<string, string[]> | string[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  status?: string;
  category_id?: number;
  author_id?: number;
  is_featured?: boolean;
}

export interface TableColumn<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

export interface CategoryItem {
  id?: number;
  uuid: string;
  parent_id?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  status: 'active' | 'inactive';
  ordering: number;
  depth: number;
  path: string;
  created_at: string;
  updated_at?: string;
  parent?: CategoryItem | null;
  children?: CategoryItem[];
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  parent_id?: number | null;
  description?: string;
  status?: 'active' | 'inactive';
  ordering?: number;
  image?: File | null;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  parent_id?: number | null;
  description?: string;
  status?: 'active' | 'inactive';
  ordering?: number;
  image?: File | null;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { categoryApi } from '../api/categoryApi';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';
import { PaginationParams } from '@/types/common.types';
import { getErrorMessage } from '@/utils/helpers';

export const useCategoriesList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ['categories', 'list', params],
    queryFn: () => categoryApi.getCategories(params),
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => categoryApi.getCategoryTree(),
  });
};

export const useCategory = (uuid: string | null) => {
  return useQuery({
    queryKey: ['categories', 'detail', uuid],
    queryFn: () => (uuid ? categoryApi.getCategoryByUuid(uuid) : null),
    enabled: !!uuid,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryApi.createCategory(input),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'Category created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create category'));
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, input }: { uuid: string; input: UpdateCategoryInput }) =>
      categoryApi.updateCategory(uuid, input),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'detail', variables.uuid] });
      toast.success(res.message || 'Category updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update category'));
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => categoryApi.deleteCategory(uuid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'Category deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete category'));
    },
  });
};

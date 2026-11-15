import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { blogApi } from '../api/blogApi';
import { CreateBlogInput, UpdateBlogInput } from '../types/blog.types';
import { PaginationParams } from '@/types/common.types';
import { getErrorMessage } from '@/utils/helpers';

export const useBlogsList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ['blogs', 'list', params],
    queryFn: () => blogApi.getBlogs(params),
  });
};

export const useBlog = (uuid: string | null) => {
  return useQuery({
    queryKey: ['blogs', 'detail', uuid],
    queryFn: () => (uuid ? blogApi.getBlogByUuid(uuid) : null),
    enabled: !!uuid,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBlogInput) => blogApi.createBlog(input),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'Blog post created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create blog'));
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, input }: { uuid: string; input: UpdateBlogInput }) =>
      blogApi.updateBlog(uuid, input),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'detail', variables.uuid] });
      toast.success(res.message || 'Blog post updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update blog'));
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => blogApi.deleteBlog(uuid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'Blog deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete blog'));
    },
  });
};

export const usePublishBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, publish }: { uuid: string; publish: boolean }) =>
      publish ? blogApi.publishBlog(uuid) : blogApi.unpublishBlog(uuid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(res.message || 'Blog status updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to change blog status'));
    },
  });
};

export const useToggleFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => blogApi.toggleFeatured(uuid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(res.message || 'Featured status updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update featured status'));
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userApi } from '../api/userApi';
import { CreateUserInput, UpdateUserInput } from '../types/user.types';
import { PaginationParams } from '@/types/common.types';
import { getErrorMessage } from '@/utils/helpers';

export const useUsersList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => userApi.getUsers(params),
  });
};

export const useUser = (uuid: string | null) => {
  return useQuery({
    queryKey: ['users', 'detail', uuid],
    queryFn: () => (uuid ? userApi.getUserByUuid(uuid) : null),
    enabled: !!uuid,
  });
};

export const useRolesList = () => {
  return useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => userApi.getRoles(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => userApi.createUser(input),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'User created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create user'));
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, input }: { uuid: string; input: UpdateUserInput }) =>
      userApi.updateUser(uuid, input),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.uuid] });
      toast.success(res.message || 'User updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update user'));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => userApi.deleteUser(uuid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(res.message || 'User deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete user'));
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => userApi.toggleUserStatus(uuid),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      toast.success(res.message || 'User status changed');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to toggle status'));
    },
  });
};

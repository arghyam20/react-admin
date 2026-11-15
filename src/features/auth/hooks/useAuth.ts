import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCredentials, setUser, logout } from '@/store/slices/authSlice';
import { ChangePasswordInput, LoginCredentials, UpdateProfileInput } from '../types/auth.types';
import { getErrorMessage } from '@/utils/helpers';

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { access_token, user, refresh_token } = response.data;
      dispatch(setCredentials({ token: access_token, user, refreshToken: refresh_token }));
      toast.success(response.message || 'Login successful!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Login failed. Please check your credentials.'));
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      toast.info('You have been logged out.');
      navigate('/login');
    },
    onError: () => {
      // Even if API logout fails, clear local credentials
      dispatch(logout());
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      if (res.data) {
        dispatch(setUser(res.data));
      }
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authApi.updateProfile(input),
    onSuccess: (response) => {
      if (response.data) {
        dispatch(setUser(response.data));
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success(response.message || 'Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
    onSuccess: (response) => {
      toast.success(response.message || 'Password changed successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to change password'));
    },
  });
};

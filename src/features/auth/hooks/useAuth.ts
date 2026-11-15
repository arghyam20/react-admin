import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials } from '../types/auth.types';
import { getErrorMessage } from '@/utils/helpers';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { access_token, user, refresh_token } = response.data;
      setAuth(access_token, user, refresh_token);
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
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.info('You have been logged out.');
      navigate('/login');
    },
    onError: () => {
      // Even if API logout fails, clear local credentials
      logoutStore();
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useCurrentUser = () => {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      if (res.data) {
        setUser(res.data);
      }
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

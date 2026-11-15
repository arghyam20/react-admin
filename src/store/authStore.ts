import store, { useAppSelector } from './index';
import {
  setCredentials,
  setUser,
  logout,
  initializeAuth,
} from './slices/authSlice';
import { AuthUser } from '@/features/auth/types/auth.types';

// Backward-compatible hook and helper using Redux Toolkit store
export const useAuthStore = (selector?: (state: ReturnType<typeof store.getState>['auth']) => unknown) => {
  const auth = useAppSelector((state) => state.auth);

  if (selector) {
    return selector(auth);
  }

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    setAuth: (token: string, user: AuthUser, refreshToken?: string) => {
      store.dispatch(setCredentials({ token, user, refreshToken }));
    },
    setUser: (user: AuthUser) => {
      store.dispatch(setUser(user));
    },
    logout: () => {
      store.dispatch(logout());
    },
    initialize: () => {
      store.dispatch(initializeAuth());
    },
  };
};

export default useAuthStore;

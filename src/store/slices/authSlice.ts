import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '@/features/auth/types/auth.types';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '@/utils/constants';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem(AUTH_TOKEN_KEY);
const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser; refreshToken?: string }>
    ) => {
      const { token, user, refreshToken } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const user = getStoredUser();
      state.token = token;
      state.user = user;
      state.isAuthenticated = !!token;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, setUser, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Lazy-loaded pages for optimal bundle splitting
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersListPage = lazy(() => import('@/features/users/pages/UsersListPage'));
const CategoriesListPage = lazy(() => import('@/features/categories/pages/CategoriesListPage'));
const BlogsListPage = lazy(() => import('@/features/blogs/pages/BlogsListPage'));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'));

// Protected route: Redirects unauthenticated users to /login
interface RouteWrapperProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<RouteWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner minHeight="100vh" message="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Guest route: Redirects authenticated users away from /login
const GuestRoute: React.FC<RouteWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner minHeight="100vh" message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const SuspenseWrapper: React.FC<RouteWrapperProps> = ({ children }) => (
  <Suspense fallback={<LoadingSpinner minHeight="60vh" message="Loading page..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <SuspenseWrapper>
          <LoginPage />
        </SuspenseWrapper>
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <SuspenseWrapper>
            <UsersListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'categories',
        element: (
          <SuspenseWrapper>
            <CategoriesListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'blogs',
        element: (
          <SuspenseWrapper>
            <BlogsListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <ProfilePage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;

import React from 'react';
import { Grid, Box, Alert } from '@mui/material';
import {
  PeopleAltOutlined,
  CategoryOutlined,
  ArticleOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { StatCard } from '../components/StatCard';
import { RecentBlogsTable } from '../components/RecentBlogsTable';
import { RecentUsersTable } from '../components/RecentUsersTable';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getDashboardData(),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard statistics..." minHeight={300} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Failed to load dashboard data. Please check your backend connection.
      </Alert>
    );
  }

  const stats = data?.stats;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of system records, users, categories, and published content"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            subtitle={`${stats?.activeUsers ?? 0} active users`}
            icon={<PeopleAltOutlined />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Categories"
            value={stats?.totalCategories ?? 0}
            subtitle="Organized topics"
            icon={<CategoryOutlined />}
            color="#7c3aed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Blogs"
            value={stats?.totalBlogs ?? 0}
            subtitle={`${stats?.publishedBlogs ?? 0} published`}
            icon={<ArticleOutlined />}
            color="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Status"
            value="Active"
            subtitle="All services running"
            icon={<CheckCircleOutline />}
            color="#0284c7"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <RecentBlogsTable blogs={data?.recentBlogs || []} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RecentUsersTable users={data?.recentUsers || []} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

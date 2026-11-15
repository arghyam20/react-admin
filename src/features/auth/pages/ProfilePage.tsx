import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import {
  PersonOutline,
  LockOutlined,
  AdminPanelSettings,
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { EditProfileSection } from '../components/EditProfileSection';
import { ChangePasswordSection } from '../components/ChangePasswordSection';
import { useAppSelector } from '@/store';
import { getStorageUrl } from '@/utils/formatters';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const user = useAppSelector((state) => state.auth.user);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const avatarUrl = getStorageUrl(user?.avatar);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const roleName = user?.roles?.[0]?.name || 'Administrator';

  return (
    <Box>
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal administrator profile, credentials, and account security"
      />

      {/* User Overview Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                fontSize: '1.75rem',
                fontWeight: 700,
                border: '3px solid #ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              {initial}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" fontWeight={700}>
                {user?.name || 'Administrator'}
              </Typography>
              <Chip
                icon={<AdminPanelSettings fontSize="small" />}
                label={roleName}
                size="small"
                color="primary"
                variant="outlined"
              />
              <StatusChip status={user?.status || 'active'} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {user?.email} • {user?.phone || 'No phone recorded'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tab Navigation */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
          <Tab
            icon={<PersonOutline fontSize="small" />}
            iconPosition="start"
            label="Edit Profile"
            sx={{ fontWeight: 600, minHeight: 48 }}
          />
          <Tab
            icon={<LockOutlined fontSize="small" />}
            iconPosition="start"
            label="Change Password"
            sx={{ fontWeight: 600, minHeight: 48 }}
          />
        </Tabs>
      </Paper>

      {/* Tab Contents */}
      {activeTab === 0 && <EditProfileSection />}
      {activeTab === 1 && <ChangePasswordSection />}
    </Box>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  AdminPanelSettings,
  PersonOutline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { getStorageUrl } from '@/utils/formatters';

interface HeaderProps {
  onMobileDrawerToggle: () => void;
  drawerWidth: number;
}

export const Header: React.FC<HeaderProps> = ({ onMobileDrawerToggle, drawerWidth }) => {
  const user = useAppSelector((state) => state.auth.user);
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleCloseMenu();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const roleName = user?.roles?.[0]?.name || 'Admin';
  const avatarUrl = getStorageUrl(user?.avatar);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMobileDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Management Portal
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            onClick={handleOpenMenu}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.9375rem',
                fontWeight: 600,
              }}
            >
              {userInitial}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight={600} lineHeight={1.2}>
                {user?.name || 'Administrator'}
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1}>
                {roleName}
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 220, mt: 1, borderRadius: 2, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleGoToProfile} sx={{ py: 1 }}>
              <ListItemIcon>
                <PersonOutline fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Profile & Security</Typography>
            </MenuItem>
            <MenuItem disabled sx={{ py: 1 }}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{roleName}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} disabled={isPending} sx={{ color: 'error.main', py: 1 }}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                Sign Out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

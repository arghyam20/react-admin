import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import {
  DashboardOutlined,
  PeopleAltOutlined,
  CategoryOutlined,
  ArticleOutlined,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

// Sidebar menu contains ONLY: Dashboard, Users, Categories, Blogs
const menuItems: MenuItem[] = [
  { text: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { text: 'Users', path: '/users', icon: <PeopleAltOutlined /> },
  { text: 'Categories', path: '/categories', icon: <CategoryOutlined /> },
  { text: 'Blogs', path: '/blogs', icon: <ArticleOutlined /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  const isSelected = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: '#ffffff',
          }}
        >
          <AdminPanelSettings fontSize="small" />
        </Box>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ letterSpacing: '-0.3px' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />

      <Box sx={{ p: 2, flex: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: 1.5, py: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const selected = isSelected(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selected}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    color: selected ? 'primary.main' : 'text.secondary',
                    bgcolor: selected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(37, 99, 235, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.12)',
                      },
                    },
                    '&:hover': {
                      bgcolor: '#f1f5f9',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: selected ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: selected ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Typography variant="caption" color="text.secondary" display="block" align="center">
          CMS Backend v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

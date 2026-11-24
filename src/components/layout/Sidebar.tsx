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
  Tooltip,
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
  isCollapsed?: boolean;
}

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

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
  isCollapsed = false,
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
      <Toolbar
        sx={{
          px: isCollapsed ? 1.5 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 1.5,
          minHeight: '64px !important',
        }}
      >
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
            flexShrink: 0,
          }}
        >
          <AdminPanelSettings fontSize="small" />
        </Box>
        {!isCollapsed && (
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            sx={{ letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}
          >
            Admin Panel
          </Typography>
        )}
      </Toolbar>
      <Divider />

      <Box sx={{ p: isCollapsed ? 1 : 2, flex: 1 }}>
        {!isCollapsed && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              px: 1.5,
              py: 1,
              display: 'block',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              whiteSpace: 'nowrap',
            }}
          >
            Navigation
          </Typography>
        )}
        <List disablePadding>
          {menuItems.map((item) => {
            const selected = isSelected(item.path);
            const buttonContent = (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selected}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: isCollapsed ? 1 : 1.5,
                    justifyContent: isCollapsed ? 'center' : 'initial',
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
                      minWidth: isCollapsed ? 0 : 36,
                      justifyContent: 'center',
                      color: selected ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selected ? 600 : 500,
                        whiteSpace: 'nowrap',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.text} title={item.text} placement="right" arrow>
                  {buttonContent}
                </Tooltip>
              );
            }

            return <React.Fragment key={item.text}>{buttonContent}</React.Fragment>;
          })}
        </List>
      </Box>

      {!isCollapsed && (
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" color="text.secondary" display="block" align="center" noWrap>
            CMS Backend v1.0
          </Typography>
        </Box>
      )}
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
            width: 260,
            bgcolor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop collapsible permanent drawer */}
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
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

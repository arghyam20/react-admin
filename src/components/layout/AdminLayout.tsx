import React, { useState } from 'react';
import { Box, Toolbar, Container, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';

const EXPANDED_DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;

export const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const currentDrawerWidth = isMobile
    ? EXPANDED_DRAWER_WIDTH
    : isCollapsed
    ? COLLAPSED_DRAWER_WIDTH
    : EXPANDED_DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        onToggleSidebar={handleToggleSidebar}
        drawerWidth={currentDrawerWidth}
        isCollapsed={isCollapsed}
      />
      <Sidebar
        drawerWidth={currentDrawerWidth}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Container maxWidth="xl" sx={{ p: '0 !important', flex: 1 }}>
          <Breadcrumbs />
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;

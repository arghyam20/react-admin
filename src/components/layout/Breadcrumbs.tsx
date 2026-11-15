import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const routeNames: Record<string, string> = {
  users: 'Users',
  categories: 'Categories',
  blogs: 'Blogs',
  profile: 'Profile & Security',
  new: 'Create',
  edit: 'Edit',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2.5 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: 'text.disabled' }} />}
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8125rem' }}
        >
          <Home sx={{ mr: 0.5, fontSize: 18 }} />
          Dashboard
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = routeNames[value] || (value.length > 20 ? `${value.slice(0, 8)}...` : value);

          return last ? (
            <Typography key={to} color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              {displayName}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              key={to}
              underline="hover"
              color="inherit"
              sx={{ fontSize: '0.8125rem' }}
            >
              {displayName}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;

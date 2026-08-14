import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTE_PATHS } from '../router/routePaths';
import { Box, CircularProgress } from '@mui/material';

export const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#0F172A',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
};

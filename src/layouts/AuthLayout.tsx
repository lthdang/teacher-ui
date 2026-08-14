import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Outlet />
    </Box>
  );
};
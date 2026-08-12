import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        {/* Header with Mobile Menu Toggle */}
        <Box sx={{ position: 'relative' }}>
          {isMobile && (
            <IconButton
              onClick={handleMobileToggle}
              id="mobile-menu-toggle-btn"
              sx={{
                position: 'absolute',
                left: 16,
                top: 16,
                zIndex: 1100,
                color: '#F8FAFC',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                },
              }}
            >
              <MenuIcon size={20} />
            </IconButton>
          )}
          <Header />
        </Box>

        {/* Page Content Body */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children || <Outlet />}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;

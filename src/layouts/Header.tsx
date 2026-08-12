import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
  const { isAuthenticated, admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/');
    await logout();
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          {/* Logo & Brand */}
          <Box
            component={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              <SchoolIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.01em',
              }}
            >
              Teacher
            </Typography>
          </Box>

          {/* Nav Actions */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/admin-info"
                  variant="outlined"
                  color="primary"
                  startIcon={<PersonIcon />}
                  id="nav-admin-link"
                  sx={{
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    color: '#E2E8F0',
                    '&:hover': {
                      borderColor: '#6366F1',
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    },
                  }}
                >
                  {admin?.firstName || admin?.email || 'Admin'}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  id="nav-logout-btn"
                  sx={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  startIcon={<LoginIcon />}
                  id="nav-login-link"
                  sx={{
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    color: '#E2E8F0',
                    '&:hover': {
                      borderColor: '#6366F1',
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  id="nav-register-link"
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  Grid,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SpeedIcon from '@mui/icons-material/Speed';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Badge */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Chip
            icon={<SecurityIcon sx={{ fontSize: '18px !important', color: '#818CF8 !important' }} />}
            label="Teacher Management System v1.0"
            variant="outlined"
            sx={{
              borderColor: 'rgba(99, 102, 241, 0.3)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#C7D2FE',
              px: 1,
              py: 0.5,
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          />
        </Box>

        {/* Hero Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.75rem' },
          }}
        >
          Welcome to Teacher Management System
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          Manage administrator accounts, authentication, and teacher profiles with security and ease. Select an option below to get started.
        </Typography>

        {/* CTA Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'center', mb: 6 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<LoginIcon />}
            id="home-login-btn"
            onClick={() => navigate('/login')}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.05rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<PersonAddIcon />}
            id="home-register-btn"
            onClick={() => navigate('/register')}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.05rem',
              borderColor: 'rgba(99, 102, 241, 0.4)',
              color: '#E2E8F0',
              '&:hover': {
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
              },
            }}
          >
            Register
          </Button>
        </Stack>

        {/* Highlights Grid */}
        <Grid container spacing={3} sx={{ pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <SupervisedUserCircleIcon sx={{ fontSize: 36, color: '#818CF8', mb: 1 }} />
              <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                Admin Control
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive profile and account administration
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <LockOutlinedIcon sx={{ fontSize: 36, color: '#34D399', mb: 1 }} />
              <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                Secure Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Robust session handling and credential encryption
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <SpeedIcon sx={{ fontSize: 36, color: '#F472B6', mb: 1 }} />
              <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                High Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modern Material-UI responsive interface
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

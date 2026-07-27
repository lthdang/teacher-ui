import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Link,
  Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailIcon from '@mui/icons-material/Mail';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('lthdang@ninepoints.vn');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your connection or credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header Icon & Title */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)',
            }}
          >
            <LoginIcon sx={{ color: '#FFFFFF', fontSize: 28 }} />
          </Box>
          <Typography variant="h2" component="h2" gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your credentials to access the Dashboard
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            id="login-error-alert"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              '& .MuiAlert-icon': {
                color: '#F87171',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              id="login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="toggle-login-password-btn"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              id="login-submit-btn"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 1.4,
                mt: 1,
                fontSize: '1rem',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Stack>
        </Box>

        {/* Footer Navigation */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              sx={{ color: '#818CF8', fontWeight: 600 }}
            >
              Register here
            </Link>
          </Typography>

          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              fontSize: '0.85rem',
              '&:hover': { color: '#F8FAFC' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Homepage
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

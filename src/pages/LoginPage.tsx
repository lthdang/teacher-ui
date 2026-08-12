import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
  Stack,
} from '@mui/material';
import LogInIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/useAuth';
import { ROUTE_PATHS } from '../router/routePaths';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname || ROUTE_PATHS.DASHBOARD;
      navigate(redirectTo, { replace: true });
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
          width: '100%',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
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
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
            }}
          >
            <LogInIcon sx={{ color: '#FFFFFF', fontSize: 28 }} />
          </Box>
          <Typography variant="h2" component="h2" sx={{ mb: 0.5, fontWeight: 700 }}>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your credentials to access the Dashboard
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" id="login-error-alert" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              id="login-email"
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="toggle-login-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isSubmitting}
              id="login-submit-btn"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LogInIcon />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                mt: 1,
              }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 3.5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to={ROUTE_PATHS.REGISTER}
              sx={{ color: 'primary.light', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Register here
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to={ROUTE_PATHS.HOME}
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Homepage
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};
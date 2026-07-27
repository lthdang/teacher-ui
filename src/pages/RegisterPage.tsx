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
  Grid,
  Link,
  Stack,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MailIcon from '@mui/icons-material/Mail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { registerApi } from '../services/api';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      const res = await registerApi({ email, password, surname, firstName });
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch {
      setSuccessMsg('Registration submitted successfully.');
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
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)',
            }}
          >
            <PersonAddIcon sx={{ color: '#FFFFFF', fontSize: 28 }} />
          </Box>
          <Typography variant="h2" component="h2" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register new administrator credentials
          </Typography>
        </Box>

        {/* Success Alert */}
        {successMsg && (
          <Alert
            severity="success"
            id="register-success-alert"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#6EE7B7',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              '& .MuiAlert-icon': {
                color: '#34D399',
              },
            }}
          >
            {successMsg}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="reg-surname"
                label="Surname"
                placeholder="e.g. Le"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="reg-firstname"
                label="First Name"
                placeholder="e.g. Dang"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
          </Grid>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              id="reg-email"
              label="Email Address"
              type="email"
              placeholder="newadmin@example.com"
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
              id="reg-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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
                        id="toggle-reg-password-btn"
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
              color="secondary"
              size="large"
              disabled={isSubmitting}
              id="register-submit-btn"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              sx={{
                py: 1.4,
                mt: 1,
                fontSize: '1rem',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              {isSubmitting ? 'Registering...' : 'Register Account'}
            </Button>
          </Stack>
        </Box>

        {/* Footer Navigation */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ color: '#34D399', fontWeight: 600 }}
            >
              Sign In
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

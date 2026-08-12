import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyIcon from '@mui/icons-material/Key';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../hooks/useAuth';

export const AdminInfoPage: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/');
    await logout();
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const fullName = admin?.surname || admin?.firstName
    ? `${admin.surname || ''} ${admin.firstName || ''}`.trim()
    : 'System Administrator';

  const avatarInitial = (admin?.firstName?.[0] || admin?.email?.[0] || 'A').toUpperCase();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
            pb: 3,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box>
            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: '16px !important', color: '#34D399 !important' }} />}
              label="Admin Profile Verified"
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'rgba(52, 211, 153, 0.3)',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                color: '#6EE7B7',
                fontWeight: 600,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              id="admin-info-heading"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem' },
                background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Admin Information
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            id="admin-info-logout-btn"
            sx={{
              py: 1.2,
              px: 3,
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            Logout
          </Button>
        </Stack>

        {/* Admin Profile Overview */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            }}
          >
            {avatarInitial}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {admin?.email || 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />

        {/* Details Grid */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: 'text.primary',
          }}
        >
          <PersonIcon sx={{ color: '#818CF8' }} /> Administrator Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', tracking: 1, fontWeight: 600 }}>
                  Email Address
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontWeight: 600 }} id="adm-email">
                {admin?.email || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', tracking: 1, fontWeight: 600 }}>
                  Full Name
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontWeight: 600 }} id="adm-fullname">
                {fullName}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <KeyIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', tracking: 1, fontWeight: 600 }}>
                  Account ID
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }} id="adm-id">
                {admin?.id || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', tracking: 1, fontWeight: 600 }}>
                  Last Login
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600 }} id="adm-lastlogin">
                {formatDate(admin?.lastLogin)}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', tracking: 1, fontWeight: 600 }}>
                  Created At
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600 }} id="adm-createdat">
                {formatDate(admin?.createdAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

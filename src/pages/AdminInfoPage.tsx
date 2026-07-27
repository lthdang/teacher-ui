import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  Stack,
  Card,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import KeyIcon from '@mui/icons-material/Key';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';

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

  const fullName =
    admin?.surname || admin?.firstName
      ? `${admin.surname || ''} ${admin.firstName || ''}`.trim()
      : 'System Administrator';

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Top Header Row */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
          }}
        >
          <Box>
            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: '16px !important', color: '#34D399 !important' }} />}
              label="Admin Profile Verified"
              size="small"
              sx={{
                borderColor: 'rgba(52, 211, 153, 0.3)',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                color: '#6EE7B7',
                fontWeight: 600,
                mb: 1,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              id="admin-info-heading"
              sx={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              Admin Information
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            id="admin-info-logout-btn"
            onClick={handleLogout}
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

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />

        {/* Profile Avatar Card */}
        <Card
          variant="outlined"
          sx={{
            mb: 4,
            p: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            borderColor: 'rgba(99, 102, 241, 0.2)',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ alignItems: 'center' }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)',
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
            </Avatar>

            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h3" component="h2" sx={{ fontSize: '1.5rem', mb: 0.5 }}>
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {admin?.email || 'N/A'}
              </Typography>
            </Box>

            <Chip
              label="Active Session"
              color="success"
              size="small"
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                border: '1px solid',
                fontWeight: 600,
              }}
            />
          </Stack>
        </Card>

        {/* Details Grid */}
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
          <PersonOutlinedIcon sx={{ color: '#818CF8' }} /> Account Details
        </Typography>

        <Grid container spacing={2.5}>
          {/* Email */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <MailIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Email Address
                </Typography>
              </Stack>
              <Typography variant="body1" id="adm-email" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                {admin?.email || 'N/A'}
              </Typography>
            </Card>
          </Grid>

          {/* Full Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <PersonOutlinedIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Full Name
                </Typography>
              </Stack>
              <Typography variant="body1" id="adm-fullname" sx={{ fontWeight: 600 }}>
                {fullName}
              </Typography>
            </Card>
          </Grid>

          {/* Account ID */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <KeyIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Account ID
                </Typography>
              </Stack>
              <Typography variant="body2" color="#CBD5E1" id="adm-id" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {admin?.id || 'N/A'}
              </Typography>
            </Card>
          </Grid>

          {/* Last Login */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Last Login
                </Typography>
              </Stack>
              <Typography variant="body1" id="adm-lastlogin" sx={{ fontWeight: 600 }}>
                {formatDate(admin?.lastLogin)}
              </Typography>
            </Card>
          </Grid>

          {/* Created At */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Account Created At
                </Typography>
              </Stack>
              <Typography variant="body1" id="adm-createdat" sx={{ fontWeight: 600 }}>
                {formatDate(admin?.createdAt)}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyIcon from '@mui/icons-material/Key';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../hooks/useAuth';
import { updateProfileApi, changePasswordApi, ApiError } from '../services/api';
import { avatarDefault } from '../assets/images';

export const AdminInfoPage: React.FC = () => {
  const { admin, setAdminProfile, refreshProfile } = useAuth();

  // Profile Edit Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [surname, setSurname] = useState(admin?.surname || '');
  const [firstName, setFirstName] = useState(admin?.firstName || '');
  const [avatar, setAvatar] = useState(admin?.avatar || '');
  const [profileErrors, setProfileErrors] = useState<{ surname?: string; firstName?: string }>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileApiError, setProfileApiError] = useState<string | null>(null);

  // Change Password Modal State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordApiError, setPasswordApiError] = useState<string | null>(null);

  // Snackbar Notification State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const fullName = admin?.surname || admin?.firstName
    ? `${admin?.surname || ''} ${admin?.firstName || ''}`.trim()
    : 'System Administrator';

  const avatarInitial = (admin?.firstName?.[0] || admin?.email?.[0] || 'A').toUpperCase();

  // Handle Profile Modal Open
  const handleOpenProfileModal = () => {
    setSurname(admin?.surname || '');
    setFirstName(admin?.firstName || '');
    setAvatar(admin?.avatar || '');
    setProfileErrors({});
    setProfileApiError(null);
    setProfileModalOpen(true);
  };

  // Handle Profile Modal Close
  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
    setProfileErrors({});
    setProfileApiError(null);
  };

  // Validate Profile Form
  const validateProfileForm = (): boolean => {
    const errors: { surname?: string; firstName?: string } = {};
    if (!surname.trim()) {
      errors.surname = 'Surname is required';
    }
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setProfileLoading(true);
    setProfileApiError(null);
    try {
      const updatedAdmin = await updateProfileApi({
        surname: surname.trim(),
        firstName: firstName.trim(),
        avatar: avatar.trim() || undefined,
      });
      setAdminProfile(updatedAdmin);
      await refreshProfile();
      setProfileModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Admin profile updated successfully!',
        severity: 'success',
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setProfileApiError(err.message);
      } else {
        setProfileApiError('Failed to update profile. Please try again.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Modal Open
  const handleOpenPasswordModal = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
    setPasswordApiError(null);
    setPasswordModalOpen(true);
  };

  // Handle Password Modal Close
  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordErrors({});
    setPasswordApiError(null);
  };

  // Validate Password Form
  const validatePasswordForm = (): boolean => {
    const errors: {
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!oldPassword) {
      errors.oldPassword = 'Old password is required';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Confirm new password does not match new password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    setPasswordApiError(null);
    try {
      await changePasswordApi({
        currentPassword: oldPassword,
        newPassword: newPassword,
      });
      setPasswordModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof ApiError) {
        setPasswordApiError(err.message);
      } else {
        setPasswordApiError('Failed to change password. Please check your old password.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

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

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleOpenProfileModal}
              id="admin-info-update-btn"
              sx={{
                py: 1.2,
                px: 2.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                },
              }}
            >
              Update Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              onClick={handleOpenPasswordModal}
              id="admin-info-change-password-btn"
              sx={{
                py: 1.2,
                px: 2.5,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#E0E7FF',
                '&:hover': {
                  borderColor: '#818CF8',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              Change Password
            </Button>
          </Stack>
        </Stack>

        {/* Admin Profile Overview */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            src={admin?.avatar || avatarDefault}
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

        {/* Update Profile Dialog Modal */}
        <Dialog
          open={profileModalOpen}
          onClose={handleCloseProfileModal}
          fullWidth
          maxWidth="sm"
          slotProps={{
            paper: {
              sx: {
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
                color: '#F8FAFC',
              },
            },
          }}
        >
          <form onSubmit={handleUpdateProfile}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Update Admin Profile
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {profileApiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {profileApiError}
                </Alert>
              )}
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <TextField
                  label="Surname"
                  variant="outlined"
                  fullWidth
                  id="update-surname-input"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  error={!!profileErrors.surname}
                  helperText={profileErrors.surname}
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: { sx: { color: '#FFFFFF' } },
                  }}
                />
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  id="update-firstname-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!profileErrors.firstName}
                  helperText={profileErrors.firstName}
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: { sx: { color: '#FFFFFF' } },
                  }}
                />
                <TextField
                  label="Avatar URL"
                  variant="outlined"
                  fullWidth
                  id="update-avatar-input"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: { sx: { color: '#FFFFFF' } },
                  }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Button onClick={handleCloseProfileModal} sx={{ color: 'text.secondary' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={profileLoading}
                startIcon={profileLoading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Change Password Dialog Modal */}
        <Dialog
          open={passwordModalOpen}
          onClose={handleClosePasswordModal}
          fullWidth
          maxWidth="sm"
          slotProps={{
            paper: {
              sx: {
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
                color: '#F8FAFC',
              },
            },
          }}
        >
          <form onSubmit={handleChangePassword}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Change Password
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {passwordApiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {passwordApiError}
                </Alert>
              )}
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <TextField
                  label="Old Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  id="change-old-password-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  error={!!passwordErrors.oldPassword}
                  helperText={passwordErrors.oldPassword}
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: { sx: { color: '#FFFFFF' } },
                  }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  id="change-new-password-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword || 'Minimum 8 characters'}
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: { sx: { color: '#FFFFFF' } },
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  id="change-confirm-password-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword}
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: { sx: { color: '#FFFFFF' } },
                  }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Button onClick={handleClosePasswordModal} sx={{ color: 'text.secondary' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={passwordLoading}
                startIcon={passwordLoading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                }}
              >
                Update Password
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Global Toast Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

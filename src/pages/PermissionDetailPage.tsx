import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import KeyIcon from '@mui/icons-material/VpnKey';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import CodeIcon from '@mui/icons-material/Code';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  getPermissionDetailApi,
  updatePermissionApi,
  ApiError,
} from '../services/api';
import type { PermissionItem } from '../types/auth';
import { ROUTE_PATHS } from '../router/routePaths';

export const PermissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const permissionId = id;
  const navigate = useNavigate();

  const [permission, setPermission] = useState<PermissionItem | null>(null);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Snackbar feedback state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPermissionData = useCallback(async () => {
    if (!permissionId) {
      setFetchError('No Permission ID provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const data = await getPermissionDetailApi(permissionId);
      setPermission(data);
      setName(data.name || '');
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message);
      } else {
        setFetchError('Failed to load permission details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [permissionId]);

  useEffect(() => {
    fetchPermissionData();
  }, [fetchPermissionData]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setNameError('Permission name is required.');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionId) return;
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await updatePermissionApi(permissionId, {
        name: name.trim(),
      });

      setSnackbar({
        open: true,
        message: 'Permission name updated successfully!',
        severity: 'success',
      });

      // Reload fresh data from API
      await fetchPermissionData();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Failed to update permission name. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: 2,
          }}
        >
          <CircularProgress color="primary" size={40} />
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Loading permission details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (fetchError || !permission) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={fetchPermissionData}>
                Retry
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate(ROUTE_PATHS.PERMISSIONS)}
              >
                Back to List
              </Button>
            </Stack>
          }
          sx={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#FCA5A5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          {fetchError || 'Permission not found.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Back navigation & Top Bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTE_PATHS.PERMISSIONS)}
          id="back-to-permissions-btn"
          sx={{
            color: '#94A3B8',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              color: '#F8FAFC',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Back to Permissions
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={fetchPermissionData}
          id="reload-permission-btn"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#CBD5E1',
            '&:hover': {
              borderColor: '#818CF8',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          }}
        >
          Reload
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Left Column: Overview / Metadata Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background:
                'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                  mb: 2,
                }}
              >
                <KeyIcon sx={{ color: '#FFFFFF', fontSize: 32 }} />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#F8FAFC',
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {permission.name}
              </Typography>

              <Chip
                label={permission.permissionCode}
                size="small"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  height: 24,
                }}
              />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2.5 }} />

            {/* Metadata properties */}
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                  }}
                >
                  Permission ID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#F8FAFC', fontFamily: 'monospace', fontWeight: 600 }}
                >
                  #{permission.id}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                  }}
                >
                  Permission Code
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#A5B4FC', fontFamily: 'monospace', fontWeight: 600 }}
                >
                  {permission.permissionCode}
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                  <CalendarTodayIcon sx={{ color: '#94A3B8', fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    Created At
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#CBD5E1', pl: 3 }}>
                  {formatDate(permission.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                  <AccessTimeIcon sx={{ color: '#94A3B8', fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    Last Updated
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#CBD5E1', pl: 3 }}>
                  {formatDate(permission.updatedAt)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Edit Form Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              background:
                'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#F8FAFC',
                  mb: 0.5,
                }}
              >
                Edit Permission Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update the display name for this system authorization permission.
              </Typography>
            </Box>

            {formError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#FCA5A5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                {formError}
              </Alert>
            )}

            <form onSubmit={handleUpdate}>
              <Stack spacing={3}>
                <TextField
                  label="Permission Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) {
                      setNameError(null);
                    }
                  }}
                  fullWidth
                  required
                  error={Boolean(nameError)}
                  helperText={nameError || 'Human-readable name describing this authorization'}
                  disabled={saving}
                  id="edit-permission-name"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                    },
                    '& .MuiInputLabel-root': { color: '#94A3B8' },
                    '& .MuiInputBase-input': { color: '#F8FAFC' },
                  }}
                />

                <TextField
                  label="Permission Code"
                  value={permission?.permissionCode || ''}
                  disabled
                  fullWidth
                  helperText="System permission code (read-only)"
                  id="edit-permission-code"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(15, 23, 42, 0.3)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.06)' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiInputBase-input': {
                      color: '#94A3B8 !important',
                      WebkitTextFillColor: '#94A3B8 !important',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    id="update-permission-submit-btn"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3.5,
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                      },
                    }}
                  >
                    {saving ? 'Updating...' : 'Update Permission'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* SNACKBAR FEEDBACK */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

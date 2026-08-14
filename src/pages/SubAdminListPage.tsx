import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Avatar,
  TextField,
  Grid,
  InputAdornment,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import UsersIcon from '@mui/icons-material/PeopleAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { getSubAdminsApi, deleteSubAdminApi, registerApi, ApiError } from '../services/api';
import type { AdminProfile } from '../types/auth';
import { avatarDefault } from '../assets/images';

export const SubAdminListPage: React.FC = () => {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<AdminProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Create Sub-Admin dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

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

  const fetchSubAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubAdminsApi();
      setSubAdmins(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load sub-admin accounts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubAdmins();
  }, [fetchSubAdmins]);

  // Handle Delete Dialog
  const handleOpenDeleteDialog = (subAdmin: AdminProfile) => {
    setSelectedSubAdmin(subAdmin);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteLoading) return;
    setDeleteDialogOpen(false);
    setSelectedSubAdmin(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubAdmin) return;
    setDeleteLoading(true);
    try {
      await deleteSubAdminApi(selectedSubAdmin.id);
      setSnackbar({
        open: true,
        message: `Sub-admin "${selectedSubAdmin.email}" deleted successfully.`,
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setSelectedSubAdmin(null);
      await fetchSubAdmins();
    } catch (err) {
      if (err instanceof ApiError) {
        setSnackbar({
          open: true,
          message: err.message,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete sub-admin. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Create Dialog
  const handleOpenCreateDialog = () => {
    setSurname('');
    setFirstName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (createLoading) return;
    setCreateDialogOpen(false);
    setCreateError(null);
  };

  const validateCreateForm = (): boolean => {
    const trimmedSurname = surname.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedSurname) {
      setCreateError('Surname is required.');
      return false;
    }
    if (!trimmedFirstName) {
      setCreateError('First name is required.');
      return false;
    }
    if (!trimmedEmail) {
      setCreateError('Email address is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setCreateError('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setCreateError('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setCreateError('Password must be at least 6 characters long.');
      return false;
    }

    if (!confirmPassword) {
      setCreateError('Please confirm the password.');
      return false;
    }
    if (password !== confirmPassword) {
      setCreateError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!validateCreateForm()) {
      return;
    }

    setCreateLoading(true);
    try {
      await registerApi({
        email: email.trim(),
        surname: surname.trim(),
        firstName: firstName.trim(),
        password,
      });

      setCreateDialogOpen(false);
      setSnackbar({
        open: true,
        message: `New sub-admin "${email.trim()}" created successfully!`,
        severity: 'success',
      });
      await fetchSubAdmins();
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message);
      } else {
        setCreateError('Failed to create sub-admin. Please try again.');
      }
    } finally {
      setCreateLoading(false);
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

  const columns: GridColDef<AdminProfile>[] = [
    {
      field: 'adminInfo',
      headerName: 'Sub-Admin User',
      flex: 1.5,
      minWidth: 240,
      renderCell: (params) => {
        const row = params.row;
        const fullName = [row.surname, row.firstName].filter(Boolean).join(' ') || 'Unnamed';
        const initial = (row.firstName?.[0] || row.email?.[0] || 'S').toUpperCase();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
            <Avatar
              src={row.avatar || avatarDefault}
              alt={fullName}
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              {initial}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#F8FAFC',
                  lineHeight: 1.2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#94A3B8', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {row.email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'type',
      headerName: 'Role Type',
      width: 140,
      renderCell: (params) => (
        <Chip
          icon={<ShieldIcon sx={{ fontSize: '14px !important', color: '#818CF8 !important' }} />}
          label={params.value || 'SUB_ADMIN'}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#A5B4FC',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        />
      ),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
            <Tooltip title="View & Edit Permissions" arrow>
              <IconButton
                size="small"
                id={`subadmin-view-btn-${row.id}`}
                onClick={() => navigate(`/admin/support-admin/${row.id}`)}
                sx={{
                  color: '#818CF8',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.25)',
                    color: '#C7D2FE',
                  },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Sub-Admin" arrow>
              <IconButton
                size="small"
                id={`subadmin-delete-btn-${row.id}`}
                onClick={() => handleOpenDeleteDialog(row)}
                sx={{
                  color: '#F87171',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.25)',
                    color: '#FCA5A5',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          width: '100%',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          borderRadius: 3,
        }}
      >
        {/* Header section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3.5,
            pb: 2.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <UsersIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                id="subadmin-list-heading"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Manage Sub-Admins
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              View and manage delegated sub-admin accounts, role permissions, and access privileges.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchSubAdmins}
              disabled={loading}
              id="subadmin-refresh-btn"
              sx={{
                py: 1,
                px: 2.5,
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#E0E7FF',
                '&:hover': {
                  borderColor: '#818CF8',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenCreateDialog}
              id="subadmin-add-new-btn"
              sx={{
                py: 1,
                px: 2.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                },
              }}
            >
              Add new
            </Button>
          </Stack>
        </Stack>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            id="subadmin-list-error-alert"
            action={
              <Button color="inherit" size="small" onClick={fetchSubAdmins}>
                Retry
              </Button>
            }
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* DataGrid Table */}
        <Box
          sx={{
            height: 520,
            width: '100%',
            '& .MuiDataGrid-root': {
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              color: '#F8FAFC',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              color: '#94A3B8',
            },
            '& .MuiTablePagination-root': {
              color: '#94A3B8',
            },
            '& .MuiSvgIcon-root': {
              color: '#94A3B8',
            },
          }}
        >
          <DataGrid
            rows={subAdmins}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            autoHeight={false}
          />
        </Box>

        {/* Create Sub-Admin Dialog Modal */}
        <Dialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
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
          <form onSubmit={handleCreateSubAdmin} noValidate>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, fontSize: '1.25rem' }}>
              <PersonAddIcon sx={{ color: '#818CF8' }} /> Add New Sub-Admin
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {createError && (
                <Alert severity="error" id="create-subadmin-error-alert" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {createError}
                </Alert>
              )}

              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      id="create-subadmin-surname"
                      label="Surname"
                      variant="outlined"
                      fullWidth
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="e.g. Le"
                      slotProps={{
                        inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                        input: { sx: { color: '#FFFFFF' } },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      id="create-subadmin-firstname"
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Dang"
                      slotProps={{
                        inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                        input: { sx: { color: '#FFFFFF' } },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  id="create-subadmin-email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="subadmin@example.com"
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: {
                      sx: { color: '#FFFFFF' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  id="create-subadmin-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (min 6 chars)"
                  helperText="Minimum 6 characters"
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: {
                      sx: { color: '#FFFFFF' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            id="toggle-create-subadmin-password-btn"
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

                <TextField
                  id="create-subadmin-confirm-password"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  slotProps={{
                    inputLabel: { sx: { color: 'rgba(255, 255, 255, 0.7)' } },
                    input: {
                      sx: { color: '#FFFFFF' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            id="toggle-create-subadmin-confirm-password-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            sx={{ color: 'text.secondary' }}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Button
                onClick={handleCloseCreateDialog}
                disabled={createLoading}
                id="create-subadmin-cancel-btn"
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createLoading}
                id="create-subadmin-submit-btn"
                startIcon={createLoading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                  },
                }}
              >
                {createLoading ? 'Creating...' : 'Create Sub-Admin'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="xs"
          slotProps={{
            paper: {
              sx: {
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(16px)',
                color: '#F8FAFC',
                p: 1,
              },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#F87171' }}>
            <WarningAmberIcon /> Confirm Delete Sub-Admin
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#CBD5E1', mb: 1 }}>
              Are you sure you want to delete the sub-admin account{' '}
              <strong style={{ color: '#FFFFFF' }}>{selectedSubAdmin?.email}</strong>?
            </DialogContentText>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              This will soft delete the account and immediately revoke all currently assigned permissions.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={deleteLoading}
              id="subadmin-cancel-delete-btn"
              sx={{ color: '#94A3B8' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={deleteLoading}
              id="subadmin-confirm-delete-btn"
              startIcon={deleteLoading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                },
              }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Sub-Admin'}
            </Button>
          </DialogActions>
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

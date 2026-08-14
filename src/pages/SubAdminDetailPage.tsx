import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  getSubAdminDetailApi,
  getAllPermissionsApi,
  updateSubAdminPermissionsApi,
  ApiError,
} from '../services/api';
import type { SubAdminDetail, PermissionItem } from '../types/auth';
import { ROUTE_PATHS } from '../router/routePaths';
import { avatarDefault } from '../assets/images';

export const SubAdminDetailPage: React.FC = () => {
  const { id, sub_admin_id } = useParams<{ id?: string; sub_admin_id?: string }>();
  const subAdminId = id || sub_admin_id;
  const navigate = useNavigate();

  const [subAdmin, setSubAdmin] = useState<SubAdminDetail | null>(null);
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const fetchData = useCallback(async () => {
    if (!subAdminId) {
      setFetchError('No Sub-Admin ID provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const [detailData, permissionsData] = await Promise.all([
        getSubAdminDetailApi(subAdminId),
        getAllPermissionsApi(),
      ]);

      setSubAdmin(detailData);
      setAllPermissions(permissionsData);

      // Pre-check currently assigned permissions
      const initialAssignedIds = new Set(
        (detailData.permissions || []).map((p) => p.id)
      );
      setSelectedPermissionIds(initialAssignedIds);
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message);
      } else {
        setFetchError('Failed to load sub-admin details or permissions.');
      }
    } finally {
      setLoading(false);
    }
  }, [subAdminId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTogglePermission = (permId: number) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredPermissions.map((p) => p.id));
    setSelectedPermissionIds((prev) => new Set([...prev, ...allIds]));
  };

  const handleDeselectAll = () => {
    const filteredIds = new Set(filteredPermissions.map((p) => p.id));
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      filteredIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleSavePermissions = async () => {
    if (!subAdminId) return;

    setSaving(true);
    try {
      const updatedPermissions = await updateSubAdminPermissionsApi(
        subAdminId,
        Array.from(selectedPermissionIds)
      );

      // Update local sub-admin detail
      if (subAdmin) {
        setSubAdmin({
          ...subAdmin,
          permissions: updatedPermissions,
        });
      }

      setSnackbar({
        open: true,
        message: 'Sub-admin permissions updated successfully!',
        severity: 'success',
      });
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
          message: 'Failed to update permissions. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const fullName = subAdmin?.surname || subAdmin?.firstName
    ? `${subAdmin?.surname || ''} ${subAdmin?.firstName || ''}`.trim()
    : 'Sub Administrator';

  const avatarInitial = (subAdmin?.firstName?.[0] || subAdmin?.email?.[0] || 'S').toUpperCase();

  const filteredPermissions = allPermissions.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.permissionCode?.toLowerCase().includes(q) ||
      p.endpoint?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 2 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            Loading sub-admin details & permissions...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (fetchError || !subAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert
          severity="error"
          id="subadmin-detail-error-alert"
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {fetchError || 'Sub-admin not found.'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTE_PATHS.SUP_ADMIN)}
        >
          Back to Sub-Admins
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
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
        {/* Top bar & actions */}
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
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            id="subadmin-back-btn"
            onClick={() => navigate(ROUTE_PATHS.SUP_ADMIN)}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#E0E7FF',
              '&:hover': {
                borderColor: '#818CF8',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Back to Sub-Admins
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            disabled={saving}
            id="subadmin-save-permissions-btn"
            onClick={handleSavePermissions}
            sx={{
              py: 1.2,
              px: 3,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
              },
            }}
          >
            {saving ? 'Saving Permissions...' : 'Save Permissions'}
          </Button>
        </Stack>

        {/* Sub-Admin Profile Overview */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            src={subAdmin.avatar || avatarDefault}
            alt={fullName}
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
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '1.8rem' } }}>
                {fullName}
              </Typography>
              <Chip
                label={subAdmin.type || 'SUB_ADMIN'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {subAdmin.email}
            </Typography>
          </Box>
        </Box>

        {/* Sub-Admin Metadata Grid */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <EmailIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Email
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                {subAdmin.email}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <PersonIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Account ID
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#CBD5E1', wordBreak: 'break-all' }}>
                {subAdmin.id}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Last Login
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                {formatDate(subAdmin.lastLogin)}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'primary.light' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Created At
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                {formatDate(subAdmin.createdAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />

        {/* Permissions Assignment Section */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              mb: 2.5,
            }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                <SecurityIcon sx={{ color: '#818CF8' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Assigned Permissions
                </Typography>
                <Chip
                  label={`${selectedPermissionIds.size} of ${allPermissions.length} selected`}
                  size="small"
                  color={selectedPermissionIds.size > 0 ? 'primary' : 'default'}
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Select the system permissions and authorization privileges delegated to this sub-admin account.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CheckBoxIcon />}
                onClick={handleSelectAll}
                id="subadmin-select-all-btn"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#CBD5E1',
                  fontSize: '0.78rem',
                }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CheckBoxOutlineBlankIcon />}
                onClick={handleDeselectAll}
                id="subadmin-deselect-all-btn"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#CBD5E1',
                  fontSize: '0.78rem',
                }}
              >
                Deselect All
              </Button>
            </Stack>
          </Stack>

          {/* Search permissions filter */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search permissions by name, code, or endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="subadmin-permissions-search"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
              },
            }}
          />

          {/* Permissions Grid */}
          {filteredPermissions.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderRadius: 2,
                border: '1px dashed rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No permissions found matching "{searchQuery}".
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredPermissions.map((permission) => {
                const isSelected = selectedPermissionIds.has(permission.id);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permission.id}>
                    <Card
                      variant="outlined"
                      onClick={() => handleTogglePermission(permission.id)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: isSelected
                          ? 'rgba(99, 102, 241, 0.12)'
                          : 'rgba(15, 23, 42, 0.5)',
                        borderColor: isSelected
                          ? 'rgba(99, 102, 241, 0.45)'
                          : 'rgba(255, 255, 255, 0.08)',
                        '&:hover': {
                          borderColor: isSelected
                            ? 'rgba(99, 102, 241, 0.7)'
                            : 'rgba(255, 255, 255, 0.2)',
                          backgroundColor: isSelected
                            ? 'rgba(99, 102, 241, 0.18)'
                            : 'rgba(30, 41, 59, 0.6)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleTogglePermission(permission.id)}
                              id={`perm-checkbox-${permission.id}`}
                              sx={{
                                color: 'rgba(255, 255, 255, 0.3)',
                                '&.Mui-checked': {
                                  color: '#818CF8',
                                },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ ml: 0.5 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color: isSelected ? '#FFFFFF' : '#E2E8F0',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {permission.name || permission.permissionCode}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: 'monospace',
                                  color: isSelected ? '#A5B4FC' : '#94A3B8',
                                  display: 'block',
                                  fontSize: '0.72rem',
                                }}
                              >
                                {permission.permissionCode}
                              </Typography>
                              {permission.endpoint && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#64748B',
                                    display: 'block',
                                    fontSize: '0.68rem',
                                    mt: 0.25,
                                  }}
                                >
                                  {permission.endpoint}
                                </Typography>
                              )}
                            </Box>
                          }
                          sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {/* Footer save action */}
        <Box
          sx={{
            pt: 3,
            mt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTE_PATHS.SUP_ADMIN)}
            sx={{ color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            disabled={saving}
            id="subadmin-bottom-save-btn"
            onClick={handleSavePermissions}
            sx={{
              py: 1.2,
              px: 3.5,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            }}
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </Button>
        </Box>

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

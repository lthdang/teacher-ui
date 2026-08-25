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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/VpnKey';
import CodeIcon from '@mui/icons-material/Code';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import {
  getRoleByIdApi,
  updateRoleApi,
  deleteRoleApi,
  getAllPermissionsApi,
  ApiError,
} from '../services/api';
import type { RoleItem, UpdateRoleRequest } from '../types/role';
import type { PermissionItem } from '../types/auth';
import { ROUTE_PATHS } from '../router/routePaths';

export const RoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Role data
  const [role, setRole] = useState<RoleItem | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);

  // Form states
  const [name, setName] = useState<string>('');
  const [hierarchyLevel, setHierarchyLevel] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [selectedPermissionCodes, setSelectedPermissionCodes] = useState<Set<string>>(new Set());
  const [customJsonMode, setCustomJsonMode] = useState<boolean>(false);
  const [permissionsJsonText, setPermissionsJsonText] = useState<string>('{}');

  // Loading & Error states
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    hierarchyLevel?: string;
    permissions?: string;
  }>({});

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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

  const parseExistingPermissions = (perms: unknown): { codes: Set<string>; jsonText: string } => {
    const codes = new Set<string>();
    let jsonText = '{}';

    if (!perms) return { codes, jsonText };

    if (typeof perms === 'string') {
      jsonText = perms;
      try {
        const parsed = JSON.parse(perms);
        if (Array.isArray(parsed)) {
          parsed.forEach((p) => {
            if (typeof p === 'string') codes.add(p);
            else if (p && p.permissionCode) codes.add(p.permissionCode);
          });
        } else if (typeof parsed === 'object' && parsed !== null) {
          Object.keys(parsed).forEach((k) => {
            if (parsed[k]) codes.add(k);
          });
        }
      } catch {
        // Raw string
      }
    } else if (Array.isArray(perms)) {
      perms.forEach((p) => {
        if (typeof p === 'string') codes.add(p);
        else if (p && p.permissionCode) codes.add(p.permissionCode);
      });
      jsonText = JSON.stringify(perms, null, 2);
    } else if (typeof perms === 'object' && perms !== null) {
      Object.keys(perms as Record<string, unknown>).forEach((k) => {
        if ((perms as Record<string, unknown>)[k]) codes.add(k);
      });
      jsonText = JSON.stringify(perms, null, 2);
    }

    return { codes, jsonText };
  };

  const fetchRoleDetails = useCallback(async () => {
    if (!id) {
      setFetchError('Role ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const [roleData, permsData] = await Promise.all([
        getRoleByIdApi(id),
        getAllPermissionsApi().catch(() => []),
      ]);

      setRole(roleData);
      setAvailablePermissions(permsData || []);

      // Populate form
      setName(roleData.name || '');
      setHierarchyLevel(roleData.hierarchyLevel ?? 1);
      setDescription(roleData.description || '');

      const { codes, jsonText } = parseExistingPermissions(roleData.permissions);
      setSelectedPermissionCodes(codes);
      setPermissionsJsonText(jsonText);
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message);
      } else {
        setFetchError('Failed to load role details.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoleDetails();
  }, [fetchRoleDetails]);

  // Handle copy UUID
  const handleCopyId = () => {
    if (role?.id) {
      navigator.clipboard.writeText(role.id);
      setSnackbar({
        open: true,
        message: 'Role ID copied to clipboard.',
        severity: 'success',
      });
    }
  };

  // Toggle permission
  const handleTogglePermission = (permCode: string) => {
    setSelectedPermissionCodes((prev) => {
      const next = new Set(prev);
      if (next.has(permCode)) {
        next.delete(permCode);
      } else {
        next.add(permCode);
      }
      return next;
    });
  };

  const handleSelectAllPermissions = () => {
    if (selectedPermissionCodes.size === availablePermissions.length) {
      setSelectedPermissionCodes(new Set());
    } else {
      setSelectedPermissionCodes(new Set(availablePermissions.map((p) => p.permissionCode)));
    }
  };

  // Submit Update Role
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !id) return;

    const errors: {
      name?: string;
      hierarchyLevel?: string;
      permissions?: string;
    } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'Role name is required.';
    } else if (trimmedName.length > 255) {
      errors.name = 'Role name cannot exceed 255 characters.';
    }

    if (hierarchyLevel === undefined || hierarchyLevel === null || isNaN(hierarchyLevel)) {
      errors.hierarchyLevel = 'Hierarchy level is required.';
    }

    let finalPermissions: unknown = {};
    if (customJsonMode) {
      try {
        finalPermissions = permissionsJsonText.trim() ? JSON.parse(permissionsJsonText) : {};
      } catch {
        errors.permissions = 'Invalid JSON format for permissions.';
      }
    } else {
      const permObj: Record<string, boolean> = {};
      selectedPermissionCodes.forEach((code) => {
        permObj[code] = true;
      });
      finalPermissions = permObj;
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload: UpdateRoleRequest = {
        name: trimmedName,
        hierarchyLevel: Number(hierarchyLevel),
        permissions: finalPermissions,
        description: description.trim(),
      };

      const updated = await updateRoleApi(id, payload);
      setRole(updated);
      setSnackbar({
        open: true,
        message: 'Role details updated successfully.',
        severity: 'success',
      });
      await fetchRoleDetails();
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
          message: 'Failed to update role.',
          severity: 'error',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Role
  const handleConfirmDelete = async () => {
    if (!role || !id) return;
    setDeleteLoading(true);
    try {
      await deleteRoleApi(id);
      setSnackbar({
        open: true,
        message: `Role "${role.name}" deleted successfully.`,
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      navigate(ROUTE_PATHS.ROLES);
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
          message: 'Failed to delete role.',
          severity: 'error',
        });
      }
    } finally {
      setDeleteLoading(false);
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
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2 }}>
          <CircularProgress size={48} sx={{ color: '#818CF8' }} />
          <Typography variant="body1" sx={{ color: '#94A3B8' }}>
            Loading role information...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (fetchError || !role) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {fetchError || 'Role not found.'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate(ROUTE_PATHS.ROLES)}
            sx={{ color: '#818CF8', borderColor: 'rgba(99, 102, 241, 0.4)' }}
          >
            Back to Roles List
          </Button>
        </Paper>
      </Container>
    );
  }

  const isSystemRole = Boolean(role.isSystemRole);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Top Breadcrumb / Back Button */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          id="back-to-roles-btn"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTE_PATHS.ROLES)}
          sx={{
            color: '#94A3B8',
            '&:hover': { color: '#F8FAFC', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          Back to Roles List
        </Button>

        {!isSystemRole && (
          <Button
            id="open-delete-role-btn"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              borderColor: 'rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              '&:hover': {
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Delete Role
          </Button>
        )}
      </Stack>

      <form onSubmit={handleUpdateSubmit}>
        <Grid container spacing={3}>
          {/* LEFT COLUMN: Overview & Metadata */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Role Header Avatar / Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '12px',
                    background: isSystemRole
                      ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
                      : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <SecurityIcon sx={{ color: '#FFFFFF', fontSize: 28 }} />
                </Box>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }} noWrap>
                    {role.name}
                  </Typography>
                  <Chip
                    icon={<ShieldIcon style={{ fontSize: 13 }} />}
                    label={role.code}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.725rem',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#A5B4FC',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      '& .MuiChip-icon': { color: '#818CF8' },
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

              {/* Attributes Card List */}
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Role ID (UUID)
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94A3B8', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                      {role.id}
                    </Typography>
                    <Tooltip title="Copy ID">
                      <IconButton size="small" onClick={handleCopyId} sx={{ color: '#64748B', '&:hover': { color: '#818CF8' } }}>
                        <ContentCopyIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Role Classification
                  </Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                    <Chip
                      label={isSystemRole ? 'System Protected Role' : 'Custom Role'}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        backgroundColor: isSystemRole ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isSystemRole ? '#FCA5A5' : '#6EE7B7',
                        border: `1px solid ${isSystemRole ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                      }}
                    />
                    <Chip
                      label={`Level ${role.hierarchyLevel}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        color: '#38BDF8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Created Timestamp
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                    <CalendarTodayIcon sx={{ color: '#64748B', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      {formatDate(role.createdAt)}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Last Updated
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                    <AccessTimeIcon sx={{ color: '#64748B', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      {formatDate(role.updateAt)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* RIGHT COLUMN: Edit Form & Permissions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
                Role Configuration
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                Update role parameters, hierarchy rankings, and authority permissions.
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    disabled
                    id="role-detail-code"
                    label="Role Code (Immutable)"
                    value={role.code}
                    helperText="Role code cannot be changed once created."
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CodeIcon sx={{ color: '#64748B', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    id="role-detail-name"
                    label="Role Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                    }}
                    error={Boolean(formErrors.name)}
                    helperText={formErrors.name || 'Display name for this role'}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    id="role-detail-hierarchy"
                    label="Hierarchy Level"
                    value={hierarchyLevel}
                    onChange={(e) => {
                      setHierarchyLevel(Number(e.target.value));
                      if (formErrors.hierarchyLevel) setFormErrors((p) => ({ ...p, hierarchyLevel: undefined }));
                    }}
                    error={Boolean(formErrors.hierarchyLevel)}
                    helperText={formErrors.hierarchyLevel || '1 is highest privilege'}
                    slotProps={{
                      htmlInput: { min: 1, max: 999 },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    id="role-detail-description"
                    label="Description"
                    placeholder="Role responsibilities and description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                {/* Permissions Configuration Section */}
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#818CF8', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <KeyIcon fontSize="small" /> Permissions & Authorities
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setCustomJsonMode(!customJsonMode)}
                      sx={{ color: '#94A3B8', fontSize: '0.75rem' }}
                    >
                      {customJsonMode ? 'Switch to Checkbox Mode' : 'Switch to Raw JSON Mode'}
                    </Button>
                  </Stack>

                  {customJsonMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      id="role-detail-permissions-json"
                      label="Permissions JSON"
                      value={permissionsJsonText}
                      onChange={(e) => {
                        setPermissionsJsonText(e.target.value);
                        if (formErrors.permissions) setFormErrors((p) => ({ ...p, permissions: undefined }));
                      }}
                      error={Boolean(formErrors.permissions)}
                      helperText={formErrors.permissions || 'JSON object mapping permission keys or array of authorities.'}
                      slotProps={{
                        input: {
                          sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                        },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        maxHeight: 280,
                        overflowY: 'auto',
                      }}
                    >
                      {availablePermissions.length > 0 ? (
                        <>
                          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pb: 1.5, mb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                              Select permissions ({selectedPermissionCodes.size} selected)
                            </Typography>
                            <Button size="small" variant="text" onClick={handleSelectAllPermissions} sx={{ fontSize: '0.7rem', color: '#818CF8' }}>
                              {selectedPermissionCodes.size === availablePermissions.length ? 'Deselect All' : 'Select All'}
                            </Button>
                          </Stack>
                          <Grid container spacing={1.5}>
                            {availablePermissions.map((perm) => {
                              const isChecked = selectedPermissionCodes.has(perm.permissionCode);
                              return (
                                <Grid size={{ xs: 12, sm: 6 }} key={perm.id}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size="small"
                                        checked={isChecked}
                                        onChange={() => handleTogglePermission(perm.permissionCode)}
                                        sx={{
                                          color: 'rgba(255, 255, 255, 0.3)',
                                          '&.Mui-checked': { color: '#818CF8' },
                                        }}
                                      />
                                    }
                                    label={
                                      <Box>
                                        <Typography variant="body2" sx={{ fontSize: '0.825rem', color: isChecked ? '#F8FAFC' : '#94A3B8', fontWeight: isChecked ? 600 : 400 }}>
                                          {perm.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#64748B' }}>
                                          {perm.permissionCode}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </Grid>
                              );
                            })}
                          </Grid>
                        </>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textAlign: 'center', py: 2 }}>
                          No system permissions available. Switch to JSON mode to configure permission keys.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>

              {/* Submit / Action Bar */}
              <Box sx={{ mt: 4, pt: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  id="cancel-role-edit-btn"
                  variant="outlined"
                  onClick={() => navigate(ROUTE_PATHS.ROLES)}
                  sx={{ color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  id="save-role-btn"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                      boxShadow: '0 6px 18px rgba(99, 102, 241, 0.6)',
                    },
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 3,
              color: '#F8FAFC',
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
              Delete Role
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <DialogContentText sx={{ color: '#CBD5E1', mb: 2 }}>
            Are you sure you want to permanently delete role{' '}
            <strong style={{ color: '#F8FAFC' }}>"{role.name}"</strong> ({role.code})?
          </DialogContentText>
          <Alert severity="warning" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#FDE68A', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            This action cannot be undone.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
            sx={{ color: '#94A3B8' }}
          >
            Cancel
          </Button>
          <Button
            id="confirm-delete-role-from-detail-btn"
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            sx={{
              backgroundColor: '#EF4444',
              '&:hover': { backgroundColor: '#DC2626' },
            }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
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
          sx={{ width: '100%', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RoleDetailPage;

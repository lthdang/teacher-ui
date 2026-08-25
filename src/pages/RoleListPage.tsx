import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
  Checkbox,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import KeyIcon from '@mui/icons-material/VpnKey';
import CodeIcon from '@mui/icons-material/Code';

import {
  getRolesApi,
  createRoleApi,
  deleteRoleApi,
  getAllPermissionsApi,
  ApiError,
} from '../services/api';
import type { RoleItem, CreateRoleRequest } from '../types/role';
import type { PermissionItem } from '../types/auth';
import { ROUTE_PATHS } from '../router/routePaths';

export const RoleListPage: React.FC = () => {
  const navigate = useNavigate();

  // Roles list state
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Available permissions list for picker
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Create Role dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [hierarchyLevel, setHierarchyLevel] = useState<number>(1);
  const [isSystemRole, setIsSystemRole] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [selectedPermissionCodes, setSelectedPermissionCodes] = useState<Set<string>>(new Set());
  const [customJsonMode, setCustomJsonMode] = useState<boolean>(false);
  const [permissionsJsonText, setPermissionsJsonText] = useState<string>('{}');

  const [formErrors, setFormErrors] = useState<{
    code?: string;
    name?: string;
    hierarchyLevel?: string;
    permissions?: string;
  }>({});
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

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRolesApi();
      setRoles(response.data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load roles list. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissionsList = useCallback(async () => {
    try {
      const perms = await getAllPermissionsApi();
      setAvailablePermissions(perms || []);
    } catch {
      // Fallback silently if permissions cannot be fetched
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissionsList();
  }, [fetchRoles, fetchPermissionsList]);

  // Open Create Dialog
  const handleOpenCreateDialog = () => {
    setCode('');
    setName('');
    setHierarchyLevel(1);
    setIsSystemRole(false);
    setDescription('');
    setSelectedPermissionCodes(new Set());
    setCustomJsonMode(false);
    setPermissionsJsonText('{}');
    setFormErrors({});
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (createLoading) return;
    setCreateDialogOpen(false);
  };

  // Toggle permission in picker
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

  // Submit Create Role
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const errors: {
      code?: string;
      name?: string;
      hierarchyLevel?: string;
      permissions?: string;
    } = {};

    const trimmedCode = code.trim();
    const trimmedName = name.trim();

    if (!trimmedCode) {
      errors.code = 'Role code is required.';
    } else if (trimmedCode.length > 50) {
      errors.code = 'Role code cannot exceed 50 characters.';
    }

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
      // Build permission object or array
      const permObj: Record<string, boolean> = {};
      selectedPermissionCodes.forEach((code) => {
        permObj[code] = true;
      });
      finalPermissions = permObj;
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCreateLoading(true);
    try {
      const payload: CreateRoleRequest = {
        code: trimmedCode,
        name: trimmedName,
        hierarchyLevel: Number(hierarchyLevel),
        permissions: finalPermissions,
        isSystemRole,
        description: description.trim() || undefined,
      };

      await createRoleApi(payload);
      setSnackbar({
        open: true,
        message: `Role "${trimmedName}" created successfully.`,
        severity: 'success',
      });
      setCreateDialogOpen(false);
      await fetchRoles();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && (err.message.includes('existed') || err.message.includes('EXISTED'))) {
          setFormErrors((prev) => ({
            ...prev,
            code: 'Role code already exists. Please use a unique code.',
          }));
        } else {
          setCreateError(err.message);
        }
      } else {
        setCreateError('Failed to create role. Please try again.');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete Dialog Handlers
  const handleOpenDeleteDialog = (role: RoleItem) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteLoading) return;
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    setDeleteLoading(true);
    try {
      await deleteRoleApi(selectedRole.id);
      setSnackbar({
        open: true,
        message: `Role "${selectedRole.name}" (${selectedRole.code}) deleted successfully.`,
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setSelectedRole(null);
      await fetchRoles();
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

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase().trim();
    return roles.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.code?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        String(r.hierarchyLevel).includes(q) ||
        r.id?.toLowerCase().includes(q)
    );
  }, [roles, searchQuery]);

  const columns: GridColDef<RoleItem>[] = [
    {
      field: 'code',
      headerName: 'Role Code',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Chip
          icon={<ShieldIcon style={{ fontSize: 14 }} />}
          label={params.value || '—'}
          size="small"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#A5B4FC',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            '& .MuiChip-icon': { color: '#818CF8' },
          }}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Role Name',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#F8FAFC',
            lineHeight: 1.3,
          }}
        >
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'hierarchyLevel',
      headerName: 'Hierarchy Level',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={`Level ${params.value ?? 0}`}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.725rem',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: '#38BDF8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }}
        />
      ),
    },
    {
      field: 'isSystemRole',
      headerName: 'Type',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const isSys = Boolean(params.value);
        return (
          <Chip
            label={isSys ? 'System' : 'Custom'}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              backgroundColor: isSys ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isSys ? '#FCA5A5' : '#6EE7B7',
              border: `1px solid ${isSys ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            }}
          />
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.6,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: '#94A3B8',
            fontSize: '0.8rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const row = params.row;
        const isSys = Boolean(row.isSystemRole);
        return (
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Tooltip title="View & Edit Role Details" arrow>
              <IconButton
                size="small"
                id={`role-view-btn-${row.id}`}
                onClick={() =>
                  navigate(ROUTE_PATHS.ROLE_DETAIL.replace(':id', row.id))
                }
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

            <Tooltip
              title={isSys ? 'System roles cannot be deleted' : 'Delete Role'}
              arrow
            >
              <span>
                <IconButton
                  size="small"
                  id={`role-delete-btn-${row.id}`}
                  disabled={isSys}
                  onClick={() => handleOpenDeleteDialog(row)}
                  sx={{
                    color: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.25)',
                      color: '#FCA5A5',
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
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
                <SecurityIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                id="roles-heading"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Roles and Authorities
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Manage educational user roles, hierarchy levels, and authority permission templates.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              id="refresh-roles-btn"
              startIcon={<RefreshIcon />}
              onClick={fetchRoles}
              disabled={loading}
              sx={{
                color: '#94A3B8',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  borderColor: '#818CF8',
                  color: '#818CF8',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              id="add-role-btn"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                  boxShadow: '0 6px 18px rgba(99, 102, 241, 0.6)',
                },
              }}
            >
              Add New Role
            </Button>
          </Stack>
        </Stack>

        {/* Global Error Banner */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchRoles}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Search & Filter Toolbar */}
        <Box sx={{ mb: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            id="role-search-input"
            placeholder="Search roles by code, name, description, or level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: 480,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#818CF8' },
              },
            }}
          />
        </Box>

        {/* Roles DataGrid */}
        <Box sx={{ height: 560, width: '100%' }}>
          <DataGrid
            rows={filteredRoles}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              color: '#F8FAFC',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.06)',
              },
              '& .MuiTablePagination-root': {
                color: '#94A3B8',
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
            }}
          />
        </Box>
      </Paper>

      {/* ========================================================================= */}
      {/* ADD NEW ROLE DIALOG */}
      {/* ========================================================================= */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              color: '#F8FAFC',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SecurityIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                Create New Role
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Define role code, hierarchy level, and authorization permissions.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <form onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ py: 2.5 }}>
            {createError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {createError}
              </Alert>
            )}

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  id="create-role-code"
                  label="Role Code"
                  placeholder="e.g. ROLE_HEAD_MASTER"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                    if (formErrors.code) setFormErrors((p) => ({ ...p, code: undefined }));
                  }}
                  error={Boolean(formErrors.code)}
                  helperText={formErrors.code || 'Uppercase identifier (e.g. ROLE_TEACHER)'}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
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
                  id="create-role-name"
                  label="Role Name"
                  placeholder="e.g. Head Master"
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
                  id="create-role-hierarchy"
                  label="Hierarchy Level"
                  placeholder="1"
                  value={hierarchyLevel}
                  onChange={(e) => {
                    setHierarchyLevel(Number(e.target.value));
                    if (formErrors.hierarchyLevel) setFormErrors((p) => ({ ...p, hierarchyLevel: undefined }));
                  }}
                  error={Boolean(formErrors.hierarchyLevel)}
                  helperText={formErrors.hierarchyLevel || '1 is highest privilege (e.g. Super Admin)'}
                  slotProps={{
                    htmlInput: { min: 1, max: 999 },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        id="create-role-is-system"
                        checked={isSystemRole}
                        onChange={(e) => setIsSystemRole(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                          System Role
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Protected system role (cannot be deleted)
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  id="create-role-description"
                  label="Description"
                  placeholder="Describe the scope, responsibilities, or target users of this role..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              {/* Permissions Configuration Section */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
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
                    rows={4}
                    id="create-role-permissions-json"
                    label="Permissions JSON"
                    value={permissionsJsonText}
                    onChange={(e) => {
                      setPermissionsJsonText(e.target.value);
                      if (formErrors.permissions) setFormErrors((p) => ({ ...p, permissions: undefined }));
                    }}
                    error={Boolean(formErrors.permissions)}
                    helperText={formErrors.permissions || 'Enter valid JSON object (e.g. {"permission.view_roles": true})'}
                    slotProps={{
                      input: {
                        sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      p: 1.5,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      backgroundColor: 'rgba(15, 23, 42, 0.4)',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {availablePermissions.length > 0 ? (
                      <>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pb: 1, mb: 1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            Select permissions ({selectedPermissionCodes.size} selected)
                          </Typography>
                          <Button size="small" variant="text" onClick={handleSelectAllPermissions} sx={{ fontSize: '0.7rem', color: '#818CF8' }}>
                            {selectedPermissionCodes.size === availablePermissions.length ? 'Deselect All' : 'Select All'}
                          </Button>
                        </Stack>
                        <Grid container spacing={1}>
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
                                      <Typography variant="body2" sx={{ fontSize: '0.8rem', color: isChecked ? '#F8FAFC' : '#94A3B8' }}>
                                        {perm.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#64748B' }}>
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
                        No system permissions found. Switch to JSON mode to specify custom permission keys.
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button
              onClick={handleCloseCreateDialog}
              disabled={createLoading}
              sx={{ color: '#94A3B8' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              id="submit-create-role-btn"
              variant="contained"
              disabled={createLoading}
              startIcon={createLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                },
              }}
            >
              {createLoading ? 'Creating...' : 'Create Role'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================================================= */}
      {/* DELETE ROLE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
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
            <strong style={{ color: '#F8FAFC' }}>"{selectedRole?.name}"</strong> ({selectedRole?.code})?
          </DialogContentText>
          <Alert severity="warning" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#FDE68A', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            This action cannot be undone. Users currently assigned this role will lose associated authorities.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleteLoading}
            sx={{ color: '#94A3B8' }}
          >
            Cancel
          </Button>
          <Button
            id="confirm-delete-role-btn"
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

export default RoleListPage;

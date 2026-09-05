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
  MenuItem,
  Grid,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import {
  getTenantsApi,
  createTenantApi,
  deleteTenantApi,
  ApiError,
} from '../services/api';
import type { TenantSimple, SchoolLevel, CreateTenantRequest } from '../types/tenant';
import { ROUTE_PATHS } from '../router/routePaths';

const SCHOOL_LEVEL_LABELS: Record<SchoolLevel, { label: string; color: string; bg: string }> = {
  primary: {
    label: 'Primary / Tiểu học',
    color: '#34D399',
    bg: 'rgba(52, 211, 153, 0.15)',
  },
  secondary: {
    label: 'Secondary / Trung học',
    color: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.15)',
  },
  university: {
    label: 'University / Đại học',
    color: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.15)',
  },
};

export const TenantListPage: React.FC = () => {
  const navigate = useNavigate();

  // Tenants state
  const [tenants, setTenants] = useState<TenantSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantSimple | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Create Tenant dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('university');
  const [provinceCode, setProvinceCode] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [settingsJson, setSettingsJson] = useState<string>('{}');

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    slug?: string;
    schoolLevel?: string;
    provinceCode?: string;
    settings?: string;
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

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTenantsApi();
      setTenants(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load tenants. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Handle Delete Dialog
  const handleOpenDeleteDialog = (tenant: TenantSimple) => {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteLoading) return;
    setDeleteDialogOpen(false);
    setSelectedTenant(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTenant) return;
    setDeleteLoading(true);
    try {
      await deleteTenantApi(selectedTenant.id);
      setSnackbar({
        open: true,
        message: `Tenant "${selectedTenant.name}" deleted successfully.`,
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setSelectedTenant(null);
      await fetchTenants();
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
          message: 'Failed to delete tenant. Please try again.',
          severity: 'error',
        });
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleGenerateSlug = () => {
    if (!name.trim()) return;
    const generated = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(generated);
  };

  // Handle Create Dialog
  const handleOpenCreateDialog = () => {
    setName('');
    setSlug('');
    setSchoolLevel('university');
    setProvinceCode('');
    setIsActive(true);
    setSettingsJson('{}');
    setFormErrors({});
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (createLoading) return;
    setCreateDialogOpen(false);
    setCreateError(null);
    setFormErrors({});
  };

  const validateCreateForm = (): boolean => {
    const errors: {
      name?: string;
      slug?: string;
      schoolLevel?: string;
      provinceCode?: string;
      settings?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Tenant name is required.';
    } else if (name.trim().length > 255) {
      errors.name = 'Tenant name cannot exceed 255 characters.';
    }

    if (!slug.trim()) {
      errors.slug = 'Tenant slug is required.';
    } else if (slug.trim().length > 100) {
      errors.slug = 'Tenant slug cannot exceed 100 characters.';
    } else if (!/^[a-z0-9-_]+$/i.test(slug.trim())) {
      errors.slug = 'Slug can only contain alphanumeric characters, hyphens, and underscores.';
    }

    if (!schoolLevel) {
      errors.schoolLevel = 'School level is required.';
    }

    if (provinceCode.trim() && provinceCode.trim().length > 2) {
      errors.provinceCode = 'Province code cannot exceed 2 characters.';
    }

    if (settingsJson.trim()) {
      try {
        JSON.parse(settingsJson.trim());
      } catch {
        errors.settings = 'Settings must be a valid JSON object or string.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    setCreateLoading(true);
    setCreateError(null);

    let parsedSettings: any = {};
    if (settingsJson.trim()) {
      try {
        parsedSettings = JSON.parse(settingsJson.trim());
      } catch {
        parsedSettings = settingsJson.trim();
      }
    }

    const payload: CreateTenantRequest = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      school_level: schoolLevel,
      province_code: provinceCode.trim() || undefined,
      is_active: isActive,
      settings: parsedSettings,
    };

    try {
      const created = await createTenantApi(payload);
      setSnackbar({
        open: true,
        message: `Tenant "${created.name || payload.name}" created successfully!`,
        severity: 'success',
      });
      setCreateDialogOpen(false);
      await fetchTenants();
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message);
      } else {
        setCreateError('Failed to create tenant. Please try again.');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  // Filter tenants by search query
  const filteredTenants = useMemo(() => {
    if (!searchQuery.trim()) return tenants;
    const q = searchQuery.toLowerCase().trim();
    return tenants.filter((tenant) => {
      const tenantName = (tenant.name || '').toLowerCase();
      const tenantSlug = (tenant.slug || '').toLowerCase();
      const level = (tenant.school_level || tenant.schoolLevel || '').toLowerCase();
      const prov = (tenant.province_code || tenant.provinceCode || '').toLowerCase();
      return (
        tenantName.includes(q) ||
        tenantSlug.includes(q) ||
        level.includes(q) ||
        prov.includes(q)
      );
    });
  }, [tenants, searchQuery]);

  // DataGrid Columns Definition
  const columns: GridColDef<TenantSimple>[] = [
    {
      field: 'name',
      headerName: 'Organization / Tenant',
      flex: 1.6,
      minWidth: 220,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', height: '100%' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                flexShrink: 0,
              }}
            >
              <ApartmentIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#F8FAFC' }}
                noWrap
              >
                {row.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.75rem' }}
                noWrap
              >
                {row.id}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: 'slug',
      headerName: 'Slug Identifier',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          size="small"
          sx={{
            fontFamily: 'monospace',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            color: '#A5B4FC',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            fontWeight: 600,
            fontSize: '0.78rem',
          }}
        />
      ),
    },
    {
      field: 'school_level',
      headerName: 'School Level',
      flex: 1.2,
      minWidth: 170,
      valueGetter: (_value, row) => row.school_level || row.schoolLevel || 'N/A',
      renderCell: (params) => {
        const level = (params.row.school_level || params.row.schoolLevel || '') as SchoolLevel;
        const config = SCHOOL_LEVEL_LABELS[level] || {
          label: level || 'N/A',
          color: '#94A3B8',
          bg: 'rgba(148, 163, 184, 0.15)',
        };
        return (
          <Chip
            label={config.label}
            size="small"
            sx={{
              backgroundColor: config.bg,
              color: config.color,
              fontWeight: 600,
              fontSize: '0.75rem',
              border: `1px solid ${config.color}33`,
            }}
          />
        );
      },
    },
    {
      field: 'province_code',
      headerName: 'Province Code',
      width: 130,
      valueGetter: (_value, row) => row.province_code || row.provinceCode || '—',
      renderCell: (params) => {
        const code = params.row.province_code || params.row.provinceCode;
        return (
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', color: code ? '#F8FAFC' : '#64748B', fontWeight: 600 }}
          >
            {code || '—'}
          </Typography>
        );
      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      valueGetter: (_value, row) => (row.is_active ?? row.isActive ?? true ? 'Active' : 'Inactive'),
      renderCell: (params) => {
        const active = params.row.is_active ?? params.row.isActive ?? true;
        return (
          <Chip
            label={active ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: active ? '#34D399' : '#F87171',
              border: `1px solid ${active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      },
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
            <Tooltip title="View Details" arrow>
              <IconButton
                size="small"
                id={`tenant-view-btn-${row.id}`}
                onClick={() => navigate(`${ROUTE_PATHS.TENANTS}/${row.id}`)}
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

            <Tooltip title="Delete Tenant" arrow>
              <IconButton
                size="small"
                id={`tenant-delete-btn-${row.id}`}
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
        {/* Header Section */}
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
                <ApartmentIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                id="tenant-list-heading"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Manage Tenants
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              View and manage educational tenant organizations, configuration settings, and school levels.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchTenants}
              disabled={loading}
              id="tenant-refresh-btn"
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
              startIcon={<AddBusinessIcon />}
              onClick={handleOpenCreateDialog}
              id="tenant-add-new-btn"
              sx={{
                py: 1,
                px: 2.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                },
              }}
            >
              Add New Tenant
            </Button>
          </Stack>
        </Stack>

        {/* Search Bar & Stats */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by name, slug, school level, or province code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            id="tenant-search-input"
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
              maxWidth: { xs: '100%', md: 450 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: '#818CF8' },
                '&.Mui-focused fieldset': { borderColor: '#6366F1' },
              },
            }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Tenants:
            </Typography>
            <Chip
              label={filteredTenants.length}
              size="small"
              sx={{
                fontWeight: 700,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            />
          </Stack>
        </Stack>

        {/* Global Error Banner */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchTenants}>
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
            height: 580,
            width: '100%',
            '& .MuiDataGrid-root': {
              border: 'none',
              borderRadius: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              color: '#F8FAFC',
              fontFamily: 'inherit',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              alignItems: 'center',
              display: 'flex',
              lineHeight: 'normal !important'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.06)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              color: '#94A3B8',
            },
            '& .MuiTablePagination-root': {
              color: '#94A3B8',
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#94A3B8',
            },
            '& .MuiIconButton-root': {
              color: '#94A3B8',
            },
          }}
        >
          <DataGrid
            rows={filteredTenants}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Create Tenant Dialog Modal */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
        id="create-tenant-dialog"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#1E293B',
              backgroundImage: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              color: '#F8FAFC',
            },
          },
        }}
      >
        <form onSubmit={handleConfirmCreate}>
          <DialogTitle
            sx={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              pb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddBusinessIcon sx={{ color: '#FFFFFF', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Add New Educational Tenant
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText sx={{ color: '#94A3B8', mb: 3 }}>
              Enter the organization information to register a new tenant in the system.
            </DialogContentText>

            {createError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {createError}
              </Alert>
            )}

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Tenant / Organization Name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name || 'e.g. Trường Đại học Sư Phạm Hà Nội'}
                  id="tenant-create-name"
                  placeholder="Enter full tenant name"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ApartmentIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="Unique Slug Identifier"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase());
                    if (formErrors.slug) setFormErrors({ ...formErrors, slug: undefined });
                  }}
                  error={Boolean(formErrors.slug)}
                  helperText={formErrors.slug || 'Unique URL-friendly slug (e.g. dh-su-pham-hn)'}
                  id="tenant-create-slug"
                  placeholder="dh-su-pham-hn"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleGenerateSlug}
                  startIcon={<AutoFixHighIcon />}
                  id="tenant-generate-slug-btn"
                  fullWidth
                  sx={{
                    py: 1.8,
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#C7D2FE',
                    '&:hover': {
                      borderColor: '#818CF8',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    },
                  }}
                >
                  Generate Slug
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="School Level"
                  required
                  value={schoolLevel}
                  onChange={(e) => {
                    setSchoolLevel(e.target.value as SchoolLevel);
                    if (formErrors.schoolLevel)
                      setFormErrors({ ...formErrors, schoolLevel: undefined });
                  }}
                  error={Boolean(formErrors.schoolLevel)}
                  helperText={formErrors.schoolLevel || 'Select educational organization level'}
                  id="tenant-create-school-level"
                >
                  <MenuItem value="primary">Primary / Tiểu học</MenuItem>
                  <MenuItem value="secondary">Secondary / Trung học</MenuItem>
                  <MenuItem value="university">University / Đại học</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Province Code"
                  value={provinceCode}
                  onChange={(e) => {
                    setProvinceCode(e.target.value);
                    if (formErrors.provinceCode)
                      setFormErrors({ ...formErrors, provinceCode: undefined });
                  }}
                  error={Boolean(formErrors.provinceCode)}
                  helperText={formErrors.provinceCode || '2-character code (e.g. 01 for Hanoi, 79 for HCMC)'}
                  id="tenant-create-province-code"
                  placeholder="01"
                  slotProps={{ htmlInput: { maxLength: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      color="primary"
                      id="tenant-create-is-active"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#F8FAFC' }}>
                      Active Status (Tenant is enabled and accessible)
                    </Typography>
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={6}
                  label="Settings (JSON)"
                  value={settingsJson}
                  onChange={(e) => {
                    setSettingsJson(e.target.value);
                    if (formErrors.settings) setFormErrors({ ...formErrors, settings: undefined });
                  }}
                  error={Boolean(formErrors.settings)}
                  helperText={formErrors.settings || 'JSON configuration object for tenant-specific policies'}
                  id="tenant-create-settings"
                  slotProps={{
                    input: {
                      sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              justifyContent: 'space-between',
            }}
          >
            <Button
              onClick={handleCloseCreateDialog}
              disabled={createLoading}
              id="tenant-cancel-create-btn"
              sx={{ color: '#94A3B8' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createLoading}
              id="tenant-submit-create-btn"
              startIcon={createLoading ? <CircularProgress size={18} color="inherit" /> : <AddBusinessIcon />}
              sx={{
                px: 3,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                },
              }}
            >
              {createLoading ? 'Creating...' : 'Create Tenant'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        id="delete-tenant-dialog"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#1E293B',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F8FAFC',
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#F87171' }}>
          <WarningAmberIcon /> Confirm Delete Tenant
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#CBD5E1' }}>
            Are you sure you want to delete the tenant{' '}
            <strong style={{ color: '#F8FAFC' }}>
              {selectedTenant?.name} ({selectedTenant?.slug})
            </strong>
            ? This action cannot be undone and will revoke organization access.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleteLoading}
            id="tenant-cancel-delete-btn"
            sx={{ color: '#94A3B8' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            id="tenant-confirm-delete-btn"
            startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            sx={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              },
            }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Tenant'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

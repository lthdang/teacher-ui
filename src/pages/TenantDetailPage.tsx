import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CodeIcon from '@mui/icons-material/Code';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import {
  getTenantByIdApi,
  updateTenantApi,
  deleteTenantApi,
  ApiError,
} from '../services/api';
import type { TenantDetail, SchoolLevel, UpdateTenantRequest } from '../types/tenant';
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

export const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Form State
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

  const fetchTenantData = useCallback(async () => {
    if (!id) {
      setFetchError('No Tenant ID provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const data = await getTenantByIdApi(id);
      setTenant(data);

      setName(data.name || '');
      setSlug(data.slug || '');
      setSchoolLevel((data.school_level || data.schoolLevel || 'university') as SchoolLevel);
      setProvinceCode(data.province_code || data.provinceCode || '');
      setIsActive(data.is_active ?? data.isActive ?? true);

      let settingsStr = '{}';
      if (typeof data.settings === 'object' && data.settings !== null) {
        settingsStr = JSON.stringify(data.settings, null, 2);
      } else if (typeof data.settings === 'string' && data.settings.trim()) {
        try {
          const parsed = JSON.parse(data.settings);
          settingsStr = JSON.stringify(parsed, null, 2);
        } catch {
          settingsStr = data.settings;
        }
      }
      setSettingsJson(settingsStr);
    } catch (err) {
      if (err instanceof ApiError) {
        setFetchError(err.message);
      } else {
        setFetchError('Failed to load tenant details.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  const handleCopyId = () => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      slug?: string;
      schoolLevel?: string;
      provinceCode?: string;
      settings?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Tenant name cannot be empty.';
    } else if (name.trim().length > 255) {
      errors.name = 'Tenant name cannot exceed 255 characters.';
    }

    if (!slug.trim()) {
      errors.slug = 'Tenant slug cannot be empty.';
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
        errors.settings = 'Settings must be valid JSON syntax.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateTenant = async () => {
    if (!id || !validateForm()) return;

    setSaving(true);
    let parsedSettings: any = {};
    if (settingsJson.trim()) {
      try {
        parsedSettings = JSON.parse(settingsJson.trim());
      } catch {
        parsedSettings = settingsJson.trim();
      }
    }

    const payload: UpdateTenantRequest = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      school_level: schoolLevel,
      province_code: provinceCode.trim() || undefined,
      is_active: isActive,
      settings: parsedSettings,
    };

    try {
      const updated = await updateTenantApi(id, payload);
      setTenant(updated);
      setSnackbar({
        open: true,
        message: 'Tenant details updated successfully!',
        severity: 'success',
      });
      await fetchTenantData();
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
          message: 'Failed to update tenant details.',
          severity: 'error',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await deleteTenantApi(id);
      setSnackbar({
        open: true,
        message: 'Tenant deleted successfully.',
        severity: 'success',
      });
      navigate(ROUTE_PATHS.TENANTS);
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
          message: 'Failed to delete tenant.',
          severity: 'error',
        });
      }
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (isoString?: string | null): string => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress color="primary" size={48} />
          <Typography variant="body2" color="text.secondary">
            Loading tenant details...
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (fetchError || !tenant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {fetchError || 'Tenant not found.'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTE_PATHS.TENANTS)}
          sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', color: '#E0E7FF' }}
        >
          Back to Tenants List
        </Button>
      </Container>
    );
  }

  const currentLevel = (tenant.school_level || tenant.schoolLevel || 'university') as SchoolLevel;
  const levelConfig = SCHOOL_LEVEL_LABELS[currentLevel] || {
    label: currentLevel,
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.15)',
  };
  const activeStatus = tenant.is_active ?? tenant.isActive ?? true;

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
        {/* Top bar & Actions */}
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
            id="tenant-back-btn"
            onClick={() => navigate(ROUTE_PATHS.TENANTS)}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#E0E7FF',
              '&:hover': {
                borderColor: '#818CF8',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Back to Tenants
          </Button>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              id="tenant-detail-delete-btn"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                '&:hover': {
                  borderColor: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              Delete Tenant
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              disabled={saving}
              id="tenant-save-btn"
              onClick={handleUpdateTenant}
              sx={{
                py: 1.2,
                px: 3,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                },
              }}
            >
              {saving ? 'Updating...' : 'Update'}
            </Button>
          </Stack>
        </Stack>

        {/* Tenant Profile Overview Banner */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              flexShrink: 0,
            }}
          >
            <ApartmentIcon sx={{ fontSize: 38 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.8, flexWrap: 'wrap', gap: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#F8FAFC',
                  fontSize: { xs: '1.5rem', sm: '1.85rem' },
                }}
              >
                {tenant.name}
              </Typography>
              <Chip
                label={levelConfig.label}
                size="small"
                sx={{
                  backgroundColor: levelConfig.bg,
                  color: levelConfig.color,
                  border: `1px solid ${levelConfig.color}44`,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                label={activeStatus ? 'Active' : 'Inactive'}
                size="small"
                sx={{
                  backgroundColor: activeStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: activeStatus ? '#34D399' : '#F87171',
                  border: `1px solid ${activeStatus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Chip
                label={`Slug: ${tenant.slug}`}
                size="small"
                sx={{
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  color: '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
              {tenant.province_code || tenant.provinceCode ? (
                <Chip
                  icon={<LocationOnIcon sx={{ fontSize: '14px !important', color: '#CBD5E1' }} />}
                  label={`Province: ${tenant.province_code || tenant.provinceCode}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#CBD5E1',
                    fontSize: '0.75rem',
                  }}
                />
              ) : null}
            </Stack>
          </Box>
        </Box>

        {/* Metadata Cards Grid */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <CodeIcon sx={{ fontSize: 16, color: '#818CF8' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Tenant UUID
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}
                  noWrap
                >
                  {tenant.id}
                </Typography>
                <Tooltip title={copiedId ? 'Copied!' : 'Copy UUID'} arrow>
                  <IconButton size="small" onClick={handleCopyId} sx={{ color: '#818CF8' }}>
                    {copiedId ? <CheckIcon fontSize="small" sx={{ color: '#34D399' }} /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: '#34D399' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Created At
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                {formatDate(tenant.created_at || tenant.createdAt)}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: '#FBBF24' }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  Last Updated
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                {formatDate(tenant.updated_at || tenant.updatedAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Editable Form Section */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2.5,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#F8FAFC' }}>
            Organization Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Modify tenant information, school level assignment, and custom JSON configuration.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 8 }}>
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
                helperText={formErrors.name}
                id="tenant-detail-name"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Slug Identifier"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase());
                  if (formErrors.slug) setFormErrors({ ...formErrors, slug: undefined });
                }}
                error={Boolean(formErrors.slug)}
                helperText={formErrors.slug}
                id="tenant-detail-slug"
              />
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
                helperText={formErrors.schoolLevel}
                id="tenant-detail-school-level"
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
                id="tenant-detail-province-code"
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
                    id="tenant-detail-is-active"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 500 }}>
                    Active Status (Tenant is enabled and accessible for teachers and students)
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={5}
                maxRows={12}
                label="Tenant Settings (JSON Configuration)"
                value={settingsJson}
                onChange={(e) => {
                  setSettingsJson(e.target.value);
                  if (formErrors.settings) setFormErrors({ ...formErrors, settings: undefined });
                }}
                error={Boolean(formErrors.settings)}
                helperText={formErrors.settings || 'Configurable JSON object for tenant branding, modules, and limits'}
                id="tenant-detail-settings"
                slotProps={{
                  input: {
                    sx: { fontFamily: 'monospace', fontSize: '0.85rem' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Update Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTE_PATHS.TENANTS)}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', color: '#94A3B8' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            disabled={saving}
            onClick={handleUpdateTenant}
            id="tenant-bottom-update-btn"
            sx={{
              py: 1.2,
              px: 4,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
              },
            }}
          >
            {saving ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        id="detail-delete-tenant-dialog"
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
              {tenant?.name} ({tenant?.slug})
            </strong>
            ? All configuration and associations will be permanently removed.
          </DialogContentText>
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
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

      {/* Snackbar Toast Feedback */}
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

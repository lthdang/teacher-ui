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
  Button,
  Alert,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import KeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { getAllPermissionsApi, ApiError } from '../services/api';
import type { PermissionItem } from '../types/auth';
import { ROUTE_PATHS } from '../router/routePaths';

export const PermissionListPage: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPermissionsApi();
      setPermissions(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load permissions list. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    const q = searchQuery.toLowerCase().trim();
    return permissions.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.permissionCode?.toLowerCase().includes(q) ||
        String(p.id).includes(q)
    );
  }, [permissions, searchQuery]);

  const columns: GridColDef<PermissionItem>[] = [
    {
      field: 'id',
      headerName: '# ID',
      width: 80,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            color: '#94A3B8',
            fontWeight: 600,
            fontSize: '0.8rem',
          }}
        >
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Permission Name',
      flex: 1.5,
      minWidth: 220,
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
      field: 'permissionCode',
      headerName: 'Permission Code',
      flex: 1.5,
      minWidth: 240,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#A5B4FC',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            height: 24,
          }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', height: '100%' }}>
            <Tooltip title="View & Edit Permission" arrow>
              <IconButton
                size="small"
                id={`permission-view-btn-${row.id}`}
                onClick={() =>
                  navigate(ROUTE_PATHS.PERMISSION_DETAIL.replace(':id', String(row.id)))
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
                <KeyIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
              </Box>
              <Typography
                variant="h1"
                component="h1"
                id="permission-list-heading"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Manage Permissions
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              View and manage system authorization permissions and display configurations.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchPermissions}
              disabled={loading}
              id="permission-refresh-btn"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                '&:hover': {
                  borderColor: '#818CF8',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {/* Filter bar */}
        <Box sx={{ mb: 2.5 }}>
          <TextField
            size="small"
            placeholder="Search permissions by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="permission-search-input"
            sx={{
              maxWidth: { xs: '100%', sm: 400 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 2,
                color: '#F8FAFC',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366F1',
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchPermissions}>
                Retry
              </Button>
            }
            sx={{
              mb: 3,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {error}
          </Alert>
        )}

        {/* DataGrid Table */}
        <Box
          sx={{
            width: '100%',
            height: 520,
            '& .MuiDataGrid-root': {
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              color: '#E2E8F0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontWeight: 700,
              fontSize: '0.825rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.06)',
            },
            '& .MuiTablePagination-root': {
              color: '#94A3B8',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
            },
            '& .MuiIconButton-root': {
              color: '#94A3B8',
            },
          }}
        >
          <DataGrid
            rows={filteredPermissions}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight={false}
          />
        </Box>
      </Paper>
    </Container>
  );
};

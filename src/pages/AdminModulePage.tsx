import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Breadcrumbs,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Building2,
  Users,
  ShieldCheck,
  Network,
  BadgeCheck,
  Layers3,
  FileBarChart,
  Settings,
  KeyRound,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import { ROUTE_PATHS, navigationConfig } from '../config/navigation.config';

export const AdminModulePage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Tìm item tương ứng trong navigationConfig
  let currentLabel = 'Back Office Module';
  let currentLabelEn = 'Module';
  let IconComponent = LayoutDashboard;
  let sectionTitle = 'HỆ THỐNG';

  for (const section of navigationConfig) {
    for (const item of section.items) {
      if (item.path === currentPath) {
        currentLabel = item.label;
        currentLabelEn = item.labelEn || item.label;
        IconComponent = item.icon;
        sectionTitle = section.title || 'GENERAL';
        break;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === currentPath) {
            currentLabel = `${item.label} / ${child.label}`;
            currentLabelEn = child.labelEn || child.label;
            IconComponent = child.icon;
            sectionTitle = section.title || 'GENERAL';
            break;
          }
        }
      }
    }
  }

  // Visual icon mapping
  const getIcon = () => {
    switch (currentPath) {
      case ROUTE_PATHS.TENANTS:
        return <Building2 size={36} color="#818CF8" />;
      case ROUTE_PATHS.DEPARTMENTS:
        return <Network size={36} color="#34D399" />;
      case ROUTE_PATHS.USERS:
        return <Users size={36} color="#60A5FA" />;
      case ROUTE_PATHS.ROLES:
        return <ShieldCheck size={36} color="#F472B6" />;
      case ROUTE_PATHS.USER_TENANT_ROLES:
        return <KeyRound size={36} color="#FBBF24" />;
      case ROUTE_PATHS.USER_CAREER_RANKS:
        return <BadgeCheck size={36} color="#A78BFA" />;
      case ROUTE_PATHS.USER_ROLE_CONTEXTS:
        return <Layers3 size={36} color="#38BDF8" />;
      case ROUTE_PATHS.REPORTS:
        return <FileBarChart size={36} color="#F87171" />;
      case ROUTE_PATHS.SETTINGS:
        return <Settings size={36} color="#94A3B8" />;
      default:
        return <IconComponent size={36} color="#818CF8" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header & Breadcrumb */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: '#94A3B8', mb: 1, fontSize: '0.875rem' }}>
          <Typography color="inherit">BE Admin</Typography>
          <Typography color="inherit">{sectionTitle}</Typography>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {currentLabel}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getIcon()}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                {currentLabel}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Quản lý và cấu hình dữ liệu phân hệ ({currentLabelEn})
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`Route: ${currentPath}`}
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              color: '#818CF8',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              px: 1,
            }}
          />
        </Box>
      </Box>

      {/* Main Content Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#F8FAFC' }}>
          Tổng quan phân hệ: {currentLabel}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 4 }}>
          Mô hình dữ liệu và giao diện quản trị backend cho {currentLabelEn}. Điều hướng sidebar hoạt động chính xác với cấu hình navigationConfig.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#818CF8', mb: 1, fontWeight: 700 }}>
                  TRẠNG THÁI PHÂN QUYỀN
                </Typography>
                <Typography variant="body2" sx={{ color: '#F8FAFC', mb: 2 }}>
                  Tự động lọc theo CurrentUserContext & PermissionKeys
                </Typography>
                <Button variant="outlined" size="small" endIcon={<ArrowRight size={16} />} sx={{ color: '#818CF8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  Kiểm tra Permissions
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#34D399', mb: 1, fontWeight: 700 }}>
                  CẤU TRÚC ĐIỀU HƯỚNG
                </Typography>
                <Typography variant="body2" sx={{ color: '#F8FAFC', mb: 2 }}>
                  Sidebar hỗ trợ toggle đóng/mở & accordion menu con
                </Typography>
                <Button variant="outlined" size="small" endIcon={<ArrowRight size={16} />} sx={{ color: '#34D399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                  Xem Config
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#F472B6', mb: 1, fontWeight: 700 }}>
                  TÍCH HỢP HEADING & BRAND
                </Typography>
                <Typography variant="body2" sx={{ color: '#F8FAFC', mb: 2 }}>
                  Tối ưu giao diện Back Office chuẩn MUI & Lucide icons
                </Typography>
                <Button variant="outlined" size="small" endIcon={<ArrowRight size={16} />} sx={{ color: '#F472B6', borderColor: 'rgba(244, 114, 182, 0.3)' }}>
                  Giao diện BE-UI
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

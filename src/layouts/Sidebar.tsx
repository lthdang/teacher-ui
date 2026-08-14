import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  School,
  ShieldCheck,
  Building,
} from 'lucide-react';
import type { CurrentUserContext } from '../types/navigation.types';
import { navigationConfig } from '../config/navigation.config';
import { filterNavSections, defaultUserContext } from '../utils/navigationFilter';
import { SidebarItem } from '../components/navigation/SidebarItem';
import { NavItemGroup } from '../components/navigation/NavItemGroup';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../utils/contants';

export interface SidebarProps {
  userContext?: CurrentUserContext;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const SIDEBAR_WIDTH_EXPANDED = 270;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

export const Sidebar: React.FC<SidebarProps> = ({
  userContext,
  collapsed: externalCollapsed,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { admin } = useAuth();

  // Internal collapse state
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('be_ui_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('be_ui_sidebar_collapsed', JSON.stringify(next));
        return next;
      });
    }
  };

  const isSuperAdmin = admin?.type === UserRole.SUPER_ADMIN;

  const adminPermissionsMap: Record<string, boolean> = {};
  if (admin?.permissions && admin.permissions.length > 0) {
    admin.permissions.forEach((perm) => {
      adminPermissionsMap[perm] = true;
    });
  }

  const activeUserContext: CurrentUserContext = userContext || {
    ...defaultUserContext,
    userId: admin?.id || 'admin-01',
    isSuperAdmin,
    isSystemRole: isSuperAdmin,
    permissions: Object.keys(adminPermissionsMap).length > 0
      ? adminPermissionsMap
      : defaultUserContext.permissions,
  };

  const visibleSections = filterNavSections(navigationConfig, activeUserContext);

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0F172A',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#F8FAFC',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Header / Brand Bar */}
      <Box
        sx={{
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          px: isCollapsed ? 1 : 2.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              flexShrink: 0,
            }}
          >
            <School size={22} color="#FFFFFF" />
          </Box>
          {!isCollapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                TEACHER
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                System Management
              </Typography>
            </Box>
          )}
        </Box>

        {!isMobile && (
          <Tooltip title={isCollapsed ? 'Expands ' : 'Collapses'} placement="right">
            <IconButton
              onClick={handleToggle}
              id="sidebar-toggle-btn"
              sx={{
                color: '#94A3B8',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818CF8',
                },
                width: 32,
                height: 32,
                ml: isCollapsed ? 0 : 1,
              }}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 2. Navigation Sections List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          py: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
          },
        }}
      >
        {visibleSections.map((section, idx) => (
          <Box key={section.id} sx={{ mb: 2 }}>
            {section.title && !isCollapsed && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 0.75,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#64748B',
                  textTransform: 'uppercase',
                }}
              >
                {section.title}
              </Typography>
            )}

            {section.title && isCollapsed && idx > 0 && (
              <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
            )}

            <List component="nav" disablePadding>
              {section.items.map((item) =>
                item.children && item.children.length > 0 ? (
                  <NavItemGroup
                    key={item.id}
                    item={item}
                    collapsed={isCollapsed}
                    onItemClick={isMobile ? onMobileClose : undefined}
                  />
                ) : (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    collapsed={isCollapsed}
                    onItemClick={isMobile ? onMobileClose : undefined}
                  />
                )
              )}
            </List>
          </Box>
        ))}
      </Box>

      {/* 3. Footer / User Context Card */}
      <Box
        sx={{
          p: isCollapsed ? 1.5 : 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#4F46E5',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {admin?.firstName ? admin.firstName.charAt(0) : 'A'}
          </Avatar>

          {!isCollapsed && (
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: 600, color: '#F8FAFC' }}
              >
                {admin?.firstName ? `${admin.surname || ''} ${admin.firstName}` : admin?.email || 'System Admin'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                {activeUserContext.isSystemRole && (
                  <Chip
                    icon={<ShieldCheck size={12} color="#10B981" />}
                    label="System Role"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      '& .MuiChip-icon': { ml: 0.5, mr: -0.25 },
                    }}
                  />
                )}
                {activeUserContext.tenantId && (
                  <Chip
                    icon={<Building size={12} color="#818CF8" />}
                    label={`Tenant: ${activeUserContext.tenantId}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#818CF8',
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  // Render Mobile Drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH_EXPANDED,
            boxSizing: 'border-box',
            backgroundColor: '#0F172A',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop Persistent Sidebar
  return (
    <Box
      component="aside"
      sx={{
        width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {sidebarContent}
    </Box>
  );
};

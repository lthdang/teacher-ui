import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  Box,
} from '@mui/material';
import type { NavItem } from '../../types/navigation.types';

interface SidebarItemProps {
  item: NavItem;
  collapsed?: boolean;
  depth?: number;
  onItemClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed = false,
  depth = 0,
  onItemClick,
}) => {
  const location = useLocation();
  const IconComponent = item.icon;

  // Kiếm tra route path active
  const isActive = item.path
    ? location.pathname === item.path ||
      (item.path !== '/admin' && location.pathname.startsWith(`${item.path}/`))
    : false;

  const content = (
    <ListItemButton
      component={item.path ? RouterLink : 'div'}
      {...(item.path ? { to: item.path } : {})}
      onClick={onItemClick}
      id={`nav-item-${item.id}`}
      sx={{
        borderRadius: 2,
        mx: 1,
        my: '2px',
        pl: 1.5 + depth * 1.5,
        pr: 1.5,
        minHeight: 44,
        color: isActive ? '#FFFFFF' : '#94A3B8',
        backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
        justifyContent: collapsed ? 'center' : 'initial',
        px: collapsed ? 1.5 : undefined,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.05)',
          color: '#F8FAFC',
          '& .MuiListItemIcon-root': {
            color: '#818CF8',
            transform: 'scale(1.05)',
          },
        },
        '& .MuiListItemIcon-root': {
          color: isActive ? '#818CF8' : '#64748B',
          transition: 'all 0.2s ease',
          minWidth: collapsed ? 'auto' : 36,
          mr: collapsed ? 0 : 1,
          justifyContent: 'center',
        },
      }}
    >
      <ListItemIcon>
        <IconComponent size={20} />
      </ListItemIcon>

      {!collapsed && (
        <>
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                noWrap: true,
                sx: {
                  fontSize: depth > 0 ? '0.875rem' : '0.925rem',
                  fontWeight: isActive ? 600 : 500,
                },
              },
            }}
          />
          {item.badge !== undefined && (
            <Chip
              label={item.badge}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: isActive ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                borderRadius: '6px',
                ml: 1,
              }}
            />
          )}
        </>
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" arrow>
        <Box>{content}</Box>
      </Tooltip>
    );
  }

  return content;
};

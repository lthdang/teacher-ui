import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Tooltip,
  Box,
} from '@mui/material';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { NavItem } from '../../types/navigation.types';
import { SidebarItem } from './SidebarItem';

interface NavItemGroupProps {
  item: NavItem;
  collapsed?: boolean;
  depth?: number;
  onItemClick?: () => void;
}

export const NavItemGroup: React.FC<NavItemGroupProps> = ({
  item,
  collapsed = false,
  depth = 0,
  onItemClick,
}) => {
  const location = useLocation();
  const IconComponent = item.icon;

  const hasActiveChild = Boolean(
    item.children?.some(
      (child) =>
        child.path &&
        (location.pathname === child.path ||
          (child.path !== '/admin' && location.pathname.startsWith(`${child.path}/`)))
    )
  );

  const isSelfActive = item.path
    ? location.pathname === item.path ||
      (item.path !== '/admin' && location.pathname.startsWith(`${item.path}/`))
    : false;

  const isActive = isSelfActive || hasActiveChild;

  const [open, setOpen] = useState<boolean>(isActive);

  useEffect(() => {
    if (hasActiveChild) {
      setOpen(true);
    }
  }, [hasActiveChild]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const groupContent = (
    <>
      <ListItemButton
        component={item.path ? RouterLink : 'div'}
        {...(item.path ? { to: item.path } : {})}
        onClick={(e: React.MouseEvent) => {
          if (!item.path) {
            handleToggle(e);
          } else if (onItemClick) {
            onItemClick();
          }
        }}
        id={`nav-group-${item.id}`}
        sx={{
          borderRadius: 2,
          mx: 1,
          my: '2px',
          pl: 1.5 + depth * 1.5,
          pr: 1.5,
          minHeight: 44,
          color: isActive ? '#FFFFFF' : '#94A3B8',
          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
          justifyContent: collapsed ? 'center' : 'initial',
          px: collapsed ? 1.5 : undefined,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#F8FAFC',
            '& .MuiListItemIcon-root': {
              color: '#818CF8',
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
            <Box
              component="span"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggle(e);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 0.5,
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Box>
          </>
        )}
      </ListItemButton>

      {!collapsed && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 1 }}>
            {item.children?.map((child) =>
              child.children && child.children.length > 0 ? (
                <NavItemGroup
                  key={child.id}
                  item={child}
                  collapsed={collapsed}
                  depth={depth + 1}
                  onItemClick={onItemClick}
                />
              ) : (
                <SidebarItem
                  key={child.id}
                  item={child}
                  collapsed={collapsed}
                  depth={depth + 1}
                  onItemClick={onItemClick}
                />
              )
            )}
          </List>
        </Collapse>
      )}
    </>
  );

  if (collapsed) {
    return (
      <Tooltip title={`${item.label} (${item.children?.length || 0})`} placement="right" arrow>
        <Box>{groupContent}</Box>
      </Tooltip>
    );
  }

  return <Box>{groupContent}</Box>;
};

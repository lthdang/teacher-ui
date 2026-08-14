import type { LucideIcon } from 'lucide-react';
export type PermissionKey = string;

export interface NavItem {
  id: string;
  label: string;
  labelEn?: string;
  icon: LucideIcon;
  path?: string;
  permissions?: PermissionKey[];
  systemOnly?: boolean;
  superAdminOnly?: boolean;
  badge?: string | number;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface CurrentUserContext {
  userId: string;
  tenantId: string | null;
  isSystemRole: boolean;
  isSuperAdmin?: boolean;
  permissions: Record<PermissionKey, boolean>;
}

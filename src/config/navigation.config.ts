import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Network,
  BadgeCheck,
  Layers3,
  FileBarChart,
  Settings,
  KeyRound,
} from "lucide-react";
import type { NavSection } from "../types/navigation.types";
import { ROUTE_PATHS } from "../router/routePaths";

export { ROUTE_PATHS };

export const navigationConfig: NavSection[] = [
  {
    id: "general",
    items: [
      {
        id: "dashboard",
        label: "Tổng quan",
        labelEn: "Dashboard",
        icon: LayoutDashboard,
        path: ROUTE_PATHS.DASHBOARD,
      },
    ],
  },
  {
    id: "organization",
    title: "TỔ CHỨC",
    items: [
      {
        id: "tenants",
        label: "Trường / Tenant",
        labelEn: "Tenants",
        icon: Building2,
        path: ROUTE_PATHS.TENANTS,
        systemOnly: true,
      },
      {
        id: "departments",
        label: "Phòng ban",
        labelEn: "Departments",
        icon: Network,
        path: ROUTE_PATHS.DEPARTMENTS,
        permissions: ["department.manage", "department.view"],
      },
    ],
  },
  {
    id: "identity",
    title: "USERS & PERMISSIONS",
    items: [
      {
        id: "sup-admin",
        label: "Quản lý Sub-admin",
        labelEn: "Manage Sub-admins",
        icon: Users,
        path: ROUTE_PATHS.SUPPORT_ADMIN,
        superAdminOnly: true,
      },
      {
        id: "permissions",
        label: "Quản lý Quyền",
        labelEn: "Manage Permissions",
        icon: KeyRound,
        path: ROUTE_PATHS.PERMISSIONS,
        superAdminOnly: true,
      },
      {
        id: "roles",
        label: "Quản lý Vai trò",
        labelEn: "Manage Roles",
        icon: ShieldCheck,
        path: ROUTE_PATHS.ROLES,
        superAdminOnly: true,
      },
      {
        id: "user-tenant-roles",
        label: "Vai trò tại Tenant",
        labelEn: "Tenant Roles",
        icon: KeyRound,
        path: ROUTE_PATHS.USER_TENANT_ROLES,
        permissions: ["user_role.manage"],
        children: [
          {
            id: "user-role-contexts",
            label: "Ngữ cảnh vai trò",
            labelEn: "Role Contexts",
            icon: Layers3,
            path: ROUTE_PATHS.USER_ROLE_CONTEXTS,
            permissions: ["user_role.manage"],
          },
        ],
      },
      {
        id: "career-ranks",
        label: "Cấp bậc nghề nghiệp",
        labelEn: "Career Ranks",
        icon: BadgeCheck,
        path: ROUTE_PATHS.USER_CAREER_RANKS,
        permissions: ["career_rank.manage", "career_rank.view"],
      },
    ],
  },
  {
    id: "system",
    title: "SYSTEM",
    items: [
      {
        id: "reports",
        label: "Báo cáo",
        labelEn: "Reports",
        icon: FileBarChart,
        path: ROUTE_PATHS.REPORTS,
        permissions: ["report.view"],
      },
      {
        id: "settings",
        label: "Cài đặt",
        labelEn: "Settings",
        icon: Settings,
        path: ROUTE_PATHS.SETTINGS,
      },
    ],
  },
];

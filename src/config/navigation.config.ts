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

export const ROUTE_PATHS = {
  DASHBOARD: "/admin",
  TENANTS: "/admin/tenants",
  DEPARTMENTS: "/admin/departments",
  USERS: "/admin/users",
  ROLES: "/admin/roles",
  USER_TENANT_ROLES: "/admin/user-tenant-roles",
  USER_CAREER_RANKS: "/admin/career-ranks",
  USER_ROLE_CONTEXTS: "/admin/role-contexts",
  REPORTS: "/admin/reports",
  SETTINGS: "/admin/settings",
} as const;

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
        id: "users",
        label: "Người dùng",
        labelEn: "Users",
        icon: Users,
        path: ROUTE_PATHS.USERS,
        permissions: ["user.view", "user.manage"],
      },
      {
        id: "roles",
        label: "Roles and Authorities",
        labelEn: "Roles & Permissions",
        icon: ShieldCheck,
        path: ROUTE_PATHS.ROLES,
        permissions: ["role.manage"],
        systemOnly: true,
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

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { SuperAdminRoute } from '../components/SuperAdminRoute';
import { RootRedirect } from '../components/RootRedirect';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminInfoPage } from '../pages/AdminInfoPage';
import { AdminModulePage } from '../pages/AdminModulePage';
import { SubAdminListPage } from '../pages/SubAdminListPage';
import { SubAdminDetailPage } from '../pages/SubAdminDetailPage';
import { PermissionListPage } from '../pages/PermissionListPage';
import { PermissionDetailPage } from '../pages/PermissionDetailPage';
import { RoleListPage } from '../pages/RoleListPage';
import { RoleDetailPage } from '../pages/RoleDetailPage';
import { TenantListPage } from '../pages/TenantListPage';
import { TenantDetailPage } from '../pages/TenantDetailPage';
import { ROUTE_PATHS } from './routePaths';

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.HOME,
    element: <RootRedirect />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTE_PATHS.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTE_PATHS.LEGACY_DASHBOARD, element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace /> },
      {
        path: ROUTE_PATHS.SUPPORT_ADMIN,
        element: (
          <SuperAdminRoute>
            <SubAdminListPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.SUPPORT_ADMIN_DETAIL,
        element: (
          <SuperAdminRoute>
            <SubAdminDetailPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.PERMISSIONS,
        element: (
          <SuperAdminRoute>
            <PermissionListPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.PERMISSION_DETAIL,
        element: (
          <SuperAdminRoute>
            <PermissionDetailPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.ROLES,
        element: (
          <SuperAdminRoute>
            <RoleListPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.ROLE_DETAIL,
        element: (
          <SuperAdminRoute>
            <RoleDetailPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.TENANTS,
        element: (
          <SuperAdminRoute>
            <TenantListPage />
          </SuperAdminRoute>
        ),
      },
      {
        path: ROUTE_PATHS.TENANT_DETAIL,
        element: (
          <SuperAdminRoute>
            <TenantDetailPage />
          </SuperAdminRoute>
        ),
      },
      { path: ROUTE_PATHS.DEPARTMENTS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.USERS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.USER_TENANT_ROLES, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.USER_CAREER_RANKS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.USER_ROLE_CONTEXTS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.REPORTS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.SETTINGS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.ADMIN_INFO, element: <AdminInfoPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTE_PATHS.LOGIN, element: <LoginPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTE_PATHS.HOME} replace />,
  },
]);
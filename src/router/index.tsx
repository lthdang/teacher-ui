import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminInfoPage } from '../pages/AdminInfoPage';
import { AdminModulePage } from '../pages/AdminModulePage';
import { ROUTE_PATHS } from './routePaths';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTE_PATHS.HOME, element: <HomePage /> },
    ],
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
      { path: ROUTE_PATHS.TENANTS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.DEPARTMENTS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.USERS, element: <AdminModulePage /> },
      { path: ROUTE_PATHS.ROLES, element: <AdminModulePage /> },
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
      { path: ROUTE_PATHS.REGISTER, element: <RegisterPage /> },
    ],
  },
]);
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTE_PATHS } from '../router/routePaths';

export const Navbar: React.FC = () => {
  const { isAuthenticated, admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTE_PATHS.HOME);
  };

  return (
    <header className="navbar">
      <div className="app-container nav-inner">
        <Link
          to={isAuthenticated ? ROUTE_PATHS.DASHBOARD : ROUTE_PATHS.HOME}
          className="brand"
        >
          <div className="brand-icon">
            <GraduationCap size={24} color="#FFFFFF" />
          </div>
          <span className="brand-title">Teacher Management</span>
        </Link>

        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTE_PATHS.ADMIN_INFO}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                id="nav-admin-link"
              >
                <User size={16} />
                <span>{admin?.firstName || admin?.email || 'Admin'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                id="nav-logout-btn"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTE_PATHS.LOGIN}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                id="nav-login-link"
              >
                Login
              </Link>
              <Link
                to={ROUTE_PATHS.REGISTER}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                id="nav-register-link"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
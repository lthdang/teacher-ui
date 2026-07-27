import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/');
    await logout();
  };

  return (
    <header className="navbar">
      <div className="app-container nav-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} color="#FFFFFF" />
          </div>
          <span className="brand-title">Teacher Management</span>
        </Link>

        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/admin-info" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} id="nav-admin-link">
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
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }} id="nav-login-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }} id="nav-register-link">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

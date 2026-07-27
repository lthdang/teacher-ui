import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content animate-fade-in">
      <div className="hero-section">
        <div className="hero-badge">
          <ShieldCheck size={16} />
          <span>Teacher Management System v1.0</span>
        </div>

        <h1 className="hero-title">
          Welcome to Teacher Management System
        </h1>

        <p className="hero-description">
          Manage administrator accounts, authentication, and teacher profiles with security and ease. Select an option below to get started.
        </p>

        <div className="hero-actions" style={{ marginTop: '32px' }}>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            id="home-login-btn"
            style={{ padding: '16px 36px', fontSize: '1.05rem' }}
          >
            <LogIn size={20} />
            <span>Login</span>
          </button>

          <button
            onClick={() => navigate('/register')}
            className="btn btn-secondary"
            id="home-register-btn"
            style={{ padding: '16px 36px', fontSize: '1.05rem' }}
          >
            <UserPlus size={20} />
            <span>Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};

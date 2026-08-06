import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Calendar, Key, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminInfoPage: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/');
    await logout();
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="main-content animate-fade-in" style={{ width: '100%', maxWidth: '900px' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          padding: '40px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '24px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div className="hero-badge" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={14} />
              <span>Admin Profile Verified</span>
            </div>
            <h1
              id="admin-info-heading"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Admin Information
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-danger"
            id="admin-info-logout-btn"
            style={{ padding: '12px 24px' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Administrator Details */}
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <User size={20} color="#818CF8" />
            <span>Administrator Information</span>
          </h2>

          <div className="info-grid">
            <div className="info-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--primary-light)" />
                <span className="info-label">Email Address</span>
              </div>
              <span className="info-value" id="adm-email">{admin?.email || 'N/A'}</span>
            </div>

            <div className="info-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="var(--primary-light)" />
                <span className="info-label">Full Name</span>
              </div>
              <span className="info-value" id="adm-fullname">
                {admin?.surname || admin?.firstName
                  ? `${admin.surname || ''} ${admin.firstName || ''}`.trim()
                  : 'System Administrator'}
              </span>
            </div>

            <div className="info-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} color="var(--primary-light)" />
                <span className="info-label">Account ID</span>
              </div>
              <span className="info-value" style={{ fontSize: '0.85rem' }} id="adm-id">
                {admin?.id || 'N/A'}
              </span>
            </div>

            <div className="info-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--primary-light)" />
                <span className="info-label">Last Login</span>
              </div>
              <span className="info-value" id="adm-lastlogin">{formatDate(admin?.lastLogin)}</span>
            </div>

            <div className="info-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--primary-light)" />
                <span className="info-label">Created At</span>
              </div>
              <span className="info-value" id="adm-createdat">{formatDate(admin?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

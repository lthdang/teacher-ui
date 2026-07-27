import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="main-content animate-fade-in" style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1
          id="dashboard-heading"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #FFFFFF 0%, #C7D2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          Dashboard
        </h1>
        <p
          id="dashboard-coming-soon"
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          Coming Soon
        </p>
      </div>
    </div>
  );
};

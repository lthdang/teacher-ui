import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from './Layout';

export const AuthLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
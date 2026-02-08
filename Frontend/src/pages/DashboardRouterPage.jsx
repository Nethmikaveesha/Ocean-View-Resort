import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminDashboardPage } from './SuperAdminDashboardPage';

export function DashboardRouterPage() {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ovr_user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  if (currentUser.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboardPage user={currentUser} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-700 text-sm">
        You are logged in as a customer. You can browse rooms and create reservations from the Home page.
      </p>
    </div>
  );
}


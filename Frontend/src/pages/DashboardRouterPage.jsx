import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminDashboardPage } from './SuperAdminDashboardPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { FrontOfficerDashboardPage } from './FrontOfficerDashboardPage';
import { ManagerDashboardPage } from './ManagerDashboardPage';

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

  const role = currentUser.role;

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboardPage user={currentUser} />;
  }
  if (role === 'ADMIN') {
    return <AdminDashboardPage user={currentUser} />;
  }
  if (role === 'FRONT_OFFICER') {
    return <FrontOfficerDashboardPage user={currentUser} />;
  }
  if (role === 'MANAGER') {
    return <ManagerDashboardPage user={currentUser} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Customer Dashboard</h1>
      <p className="text-slate-700 text-sm">
        You are logged in as a customer. You can browse rooms and create reservations.
      </p>
    </div>
  );
}


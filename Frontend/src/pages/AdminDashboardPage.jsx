import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminDashboardPage } from './SuperAdminDashboardPage';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ovr_user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }
    if (currentUser.role !== 'SUPER_ADMIN') {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return null;
  }

  return <SuperAdminDashboardPage user={currentUser} />;
}

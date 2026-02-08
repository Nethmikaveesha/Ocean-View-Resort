import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminRedirectPage() {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ovr_user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (currentUser && currentUser.role === 'SUPER_ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/admin/login', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className="text-center text-slate-600 py-8">
      Redirecting…
    </div>
  );
}

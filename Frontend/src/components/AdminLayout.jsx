import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

export function AdminLayout() {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ovr_user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;

  const handleLogout = () => {
    window.localStorage.removeItem('ovr_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-xl font-semibold tracking-wide">
            Ocean View Resort — Admin
          </Link>
          <nav className="space-x-4 text-sm md:text-base flex items-center">
            {currentUser && (
              <>
                <Link to="/admin/dashboard" className="hover:text-slate-200">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs md:text-sm underline underline-offset-4 hover:text-slate-200"
                >
                  Logout
                </button>
              </>
            )}
            {!currentUser && (
              <Link to="/admin/login" className="hover:text-slate-200">
                Login
              </Link>
            )}
            <Link to="/" className="text-slate-400 hover:text-slate-200 text-xs">
              ← Customer site
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          &copy; {new Date().getFullYear()} Ocean View Resort — Admin area
        </div>
      </footer>
    </div>
  );
}

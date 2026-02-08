import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Layout({ children }) {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ovr_user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;

  const handleLogout = () => {
    window.localStorage.removeItem('ovr_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-sky-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-wide">
            Ocean View Resort
          </Link>
          <nav className="space-x-4 text-sm md:text-base flex items-center">
            <Link to="/" className="hover:text-sky-200">
              Home
            </Link>
            <Link to="/about" className="hover:text-sky-200">
              About
            </Link>
            <Link to="/help" className="hover:text-sky-200">
              Help
            </Link>
            {currentUser && (
              <>
                <Link to="/dashboard" className="hover:text-sky-200">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs md:text-sm underline underline-offset-4 hover:text-sky-200"
                >
                  Logout
                </button>
              </>
            )}
            {!currentUser && (
              <Link to="/login" className="hover:text-sky-200">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>

      <footer className="bg-slate-900 text-slate-300 text-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <span>&copy; {new Date().getFullYear()} Ocean View Resort</span>
          <span>Secure Logout available after login</span>
        </div>
      </footer>
    </div>
  );
}


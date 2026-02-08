import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerReservationPage } from './pages/CustomerReservationPage';
import { ReservationConfirmPage } from './pages/ReservationConfirmPage';
import { AdminRedirectPage } from './pages/AdminRedirectPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <Routes>
      {/* Customer site: /, /about, /help, /login, /register, /reserve, /reservation/confirm */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reserve" element={<CustomerReservationPage />} />
        <Route path="reservation/confirm" element={<ReservationConfirmPage />} />
      </Route>

      {/* Admin site: /admin, /admin/login, /admin/dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminRedirectPage />} />
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Page not found</h1>
              <Link to="/" className="text-sky-700 underline">Go to customer site</Link>
              <span className="mx-2">|</span>
              <Link to="/admin" className="text-sky-700 underline">Go to admin</Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;


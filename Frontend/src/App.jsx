import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerReservationPage } from './pages/CustomerReservationPage';
import { ReservationConfirmPage } from './pages/ReservationConfirmPage';
import { DashboardRouterPage } from './pages/DashboardRouterPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reserve" element={<CustomerReservationPage />} />
        <Route path="/reservation/confirm" element={<ReservationConfirmPage />} />
        <Route path="/dashboard" element={<DashboardRouterPage />} />
        <Route
          path="*"
          element={
            <div>
              <h1 className="text-2xl font-bold mb-2">Page not found</h1>
              <Link to="/" className="text-sky-700 underline">
                Go back home
              </Link>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;


import React, { useEffect, useState } from 'react';
import { RoomManagement } from '../components/RoomManagement';

export function AdminDashboardPage({ user }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/dashboard/admin?userId=${encodeURIComponent(user.userId)}`)
      .then((res) => (res.ok ? res.json() : res.text().then((t) => Promise.reject(t))))
      .then(setSummary)
      .catch((err) => setError(typeof err === 'string' ? err : 'Failed to load dashboard.'));
  }, [user.userId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {!summary && !error && <p className="text-sm text-slate-700">Loading...</p>}
      {summary && (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <DashboardCard label="Total Rooms" value={summary.totalRooms} />
            <DashboardCard label="Total Reservations" value={summary.totalReservations} />
            <DashboardCard label="Today's Arrivals" value={summary.todaysArrivals} />
            <DashboardCard label="Today's Departures" value={summary.todaysDepartures} />
          </div>
          <p className="text-sm text-slate-700">
            As Admin you can manage rooms and create reservations for walk-in customers using the
            room and reservation forms.
          </p>
          <RoomManagement user={user} />
        </>
      )}
    </div>
  );
}

function DashboardCard({ label, value }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}


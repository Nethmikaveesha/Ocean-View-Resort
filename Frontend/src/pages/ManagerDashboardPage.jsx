import React, { useEffect, useState } from 'react';

export function ManagerDashboardPage({ user }) {
  const [summary, setSummary] = useState(null);
  const [helpText, setHelpText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/dashboard/manager?userId=${encodeURIComponent(user.userId)}`)
      .then((res) => (res.ok ? res.json() : res.text().then((t) => Promise.reject(t))))
      .then(setSummary)
      .catch((err) => setError(typeof err === 'string' ? err : 'Failed to load dashboard.'));

    fetch('/api/help/staff')
      .then((res) => res.text())
      .then(setHelpText)
      .catch(() => setHelpText('Staff help information is unavailable.'));
  }, [user.userId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {!summary && !error && <p className="text-sm text-slate-700">Loading...</p>}
      {summary && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <DashboardCard label="Total Customers" value={summary.totalCustomers} />
          <DashboardCard label="Total Reservations" value={summary.totalReservations} />
          <DashboardCard label="Today's Arrivals" value={summary.todaysArrivals} />
        </div>
      )}
      <section>
        <h2 className="text-lg font-semibold mb-2">Help for New Staff</h2>
        <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded border text-sm text-slate-800">
          {helpText}
        </pre>
      </section>
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


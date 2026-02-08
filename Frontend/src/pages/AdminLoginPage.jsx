import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Please enter username and password.');
      return;
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      if (data.role !== 'SUPER_ADMIN') {
        setError('Access denied. Super Admin only.');
        return;
      }
      localStorage.setItem('ovr_user', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <p className="text-slate-600 text-sm mb-4">Super Admin only. Use the customer site to log in as a customer.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded-md text-sm font-semibold hover:bg-slate-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

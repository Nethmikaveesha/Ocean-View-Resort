import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [roomsAvailable, setRoomsAvailable] = useState(null);

  useEffect(() => {
    fetch('/api/rooms/availability')
      .then((res) => res.json())
      .then((data) => setRoomsAvailable(data.available === true))
      .catch(() => setRoomsAvailable(false));
  }, []);

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
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await res.json();
      localStorage.setItem('ovr_user', JSON.stringify(data));
      if (data.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ovr_user');
    navigate('/');
  };

  if (roomsAvailable === false) {
    return (
      <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-2 text-amber-900">Login unavailable</h1>
        <p className="text-amber-800 text-sm mb-4">
          No rooms are currently available. Registration and login are temporarily disabled. Please check back later.
        </p>
        <Link to="/" className="text-sky-700 underline text-sm">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
          className="w-full bg-sky-700 text-white py-2 rounded-md text-sm font-semibold hover:bg-sky-800"
        >
          Login
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="mt-4 text-sm text-sky-700 underline hover:text-sky-900"
      >
        Logout / Exit System
      </button>
    </div>
  );
}


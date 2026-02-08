import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();
  const [roomsAvailable, setRoomsAvailable] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    nicNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    if (!form.username || !form.password || !form.email) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Registration failed');
      }
      setSuccess('Registration successful. You can now log in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  if (roomsAvailable === false) {
    return (
      <div className="max-w-lg mx-auto bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-2 text-amber-900">Registration unavailable</h1>
        <p className="text-amber-800 text-sm mb-4">
          No rooms are currently available. Registration and login are temporarily disabled. Please check back later.
        </p>
        <Link to="/" className="text-sky-700 underline text-sm">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-emerald-600 text-sm">{success}</div>}

        {['username', 'password', 'fullName', 'email', 'phone', 'address', 'nicNumber'].map(
          (field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field === 'nicNumber' ? 'NIC Number' : field}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          )
        )}

        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 rounded-md text-sm font-semibold hover:bg-sky-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}


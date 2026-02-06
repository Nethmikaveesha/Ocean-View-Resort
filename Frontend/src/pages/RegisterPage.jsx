import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();
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
      setError('Registration failed. Username may already exist.');
    }
  };

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


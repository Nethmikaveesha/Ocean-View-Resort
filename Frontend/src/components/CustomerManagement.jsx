import React, { useEffect, useState } from 'react';

export function CustomerManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('CUSTOMER');
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    nicNumber: '',
    role: 'CUSTOMER'
  });

  const headers = () => ({
    'Content-Type': 'application/json',
    ...(user?.userId ? { 'X-User-Id': user.userId } : {})
  });

  const loadUsers = () => {
    const q = roleFilter ? `?role=${roleFilter}` : '';
    fetch(`/api/admin/users${q}`, { headers: headers() })
      .then((res) => (res.ok ? res.json() : res.text().then((t) => Promise.reject(t))))
      .then(setUsers)
      .catch((err) => setError(String(err)));
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      nicNumber: '',
      role: 'CUSTOMER'
    });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const body = { ...form };
    if (editingId) {
      if (!body.password) delete body.password;
      try {
        const res = await fetch(`/api/admin/users/${editingId}`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(await res.text());
        setSuccess('User updated.');
        loadUsers();
        resetForm();
      } catch (err) {
        setError(err.message || 'Update failed');
      }
    } else {
      if (!body.password) {
        setError('Password is required for new user');
        return;
      }
      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(await res.text());
        setSuccess('User created.');
        loadUsers();
        resetForm();
      } catch (err) {
        setError(err.message || 'Create failed');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('User deleted.');
      loadUsers();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      username: u.username,
      password: '',
      fullName: u.fullName || '',
      email: u.email || '',
      phone: '',
      address: '',
      nicNumber: '',
      role: u.role || 'CUSTOMER'
    });
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Manage Customers</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-emerald-600 text-sm mb-2">{success}</div>}

      <div className="mb-3">
        <label className="text-sm text-slate-600 mr-2">Show:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="CUSTOMER">Customers only</option>
          <option value="">All users</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm mb-4 space-y-3 max-w-xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={!!editingId}
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Password {editingId && '(leave blank to keep)'}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Full name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input type="text" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="border rounded px-2 py-1.5 text-sm" disabled={!!editingId}>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-sky-700 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-sky-800">
            {editingId ? 'Update user' : 'Create user'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-300">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Full name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.fullName}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <button type="button" onClick={() => startEdit(u)} className="text-sky-600 hover:underline text-xs mr-2">Edit</button>
                  <button type="button" onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-slate-500 text-sm p-2">No users match the filter.</p>}
      </div>
    </section>
  );
}

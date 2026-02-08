import React, { useEffect, useState } from 'react';

export function RoomManagement({ user }) {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    roomNumber: '',
    roomType: 'STANDARD',
    description: '',
    capacity: 2,
    ratePerNight: '',
    status: 'AVAILABLE',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const headers = () => ({
    'Content-Type': 'application/json',
    ...(user?.userId ? { 'X-User-Id': user.userId } : {})
  });

  const loadRooms = () => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value
    }));
  };

  const resetForm = () => {
    setForm({
      roomNumber: '',
      roomType: 'STANDARD',
      description: '',
      capacity: 2,
      ratePerNight: '',
      status: 'AVAILABLE',
      imageUrl: ''
    });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.userId) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/rooms/upload', {
        method: 'POST',
        headers: { 'X-User-Id': user.userId },
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl || '' }));
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const body = {
      ...form,
      ratePerNight: parseFloat(form.ratePerNight) || 0,
      imageUrl: form.imageUrl || null
    };
    const url = editingId ? `/api/rooms/${editingId}` : '/api/rooms';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }
      setSuccess(editingId ? 'Room updated.' : 'Room added.');
      loadRooms();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save room.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    setError('');
    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('Room deleted.');
      loadRooms();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const startEdit = (room) => {
    setEditingId(room.id);
    setForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType || 'STANDARD',
      description: room.description || '',
      capacity: room.capacity ?? 2,
      ratePerNight: String(room.ratePerNight ?? ''),
      status: room.status || 'AVAILABLE',
      imageUrl: room.imageUrl || ''
    });
  };

  const imagePreviewUrl = form.imageUrl
    ? (form.imageUrl.startsWith('http') ? form.imageUrl : form.imageUrl)
    : null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Manage Rooms</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-emerald-600 text-sm mb-2">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm mb-4 space-y-3 max-w-xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Room number</label>
            <input
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Room type</label>
            <input
              type="text"
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              placeholder="e.g. STANDARD, DELUXE, SUITE"
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Rate per night (Rs)</label>
            <input
              type="number"
              name="ratePerNight"
              min="0"
              step="0.01"
              value={form.ratePerNight}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1.5 text-sm"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Room image</label>
          <div className="flex flex-wrap items-start gap-3">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="block w-full text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-sky-50 file:text-sky-700"
              />
              {uploading && <span className="text-xs text-slate-500">Uploading…</span>}
            </div>
            <span className="text-slate-500 text-xs">or paste URL:</span>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://… or /uploads/…"
              className="flex-1 min-w-[200px] border rounded px-2 py-1.5 text-sm"
            />
          </div>
          {imagePreviewUrl && (
            <div className="mt-2">
              <img
                src={imagePreviewUrl}
                alt="Room preview"
                className="h-24 w-auto rounded border object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-sky-700 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-sky-800"
          >
            {editingId ? 'Update room' : 'Add room'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">Image</th>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Capacity</th>
              <th className="text-left p-2">Rate/night</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
                <td className="p-2">
                  {room.imageUrl ? (
                    <img
                      src={room.imageUrl}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                <td className="p-2">{room.roomNumber}</td>
                <td className="p-2">{room.roomType}</td>
                <td className="p-2">{room.capacity}</td>
                <td className="p-2">Rs. {Number(room.ratePerNight).toFixed(2)}</td>
                <td className="p-2">{room.status}</td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => startEdit(room)}
                    className="text-sky-600 hover:underline text-xs mr-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && (
          <p className="text-slate-500 text-sm p-2">No rooms yet. Add one above.</p>
        )}
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';

function toDatetimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ReservationManagement({ user }) {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    guestName: '',
    address: '',
    nicNumber: '',
    contactNumber: '',
    roomId: '',
    roomType: '',
    checkInDateTime: '',
    checkOutDateTime: ''
  });

  const headers = () => ({
    'Content-Type': 'application/json',
    ...(user?.userId ? { 'X-User-Id': user.userId } : {})
  });

  const loadReservations = () => {
    fetch('/api/admin/reservations', { headers: headers() })
      .then((res) => (res.ok ? res.json() : res.text().then((t) => Promise.reject(t))))
      .then(setReservations)
      .catch(() => setReservations([]));
  };

  const loadRooms = () => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    loadReservations();
    loadRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSelect = (e) => {
    const roomId = e.target.value;
    const room = rooms.find((r) => r.id === roomId);
    setForm((prev) => ({
      ...prev,
      roomId,
      roomType: room?.roomType || ''
    }));
  };

  const resetForm = () => {
    setForm({
      guestName: '',
      address: '',
      nicNumber: '',
      contactNumber: '',
      roomId: '',
      roomType: '',
      checkInDateTime: '',
      checkOutDateTime: ''
    });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const checkIn = form.checkInDateTime ? new Date(form.checkInDateTime).toISOString().slice(0, 19) : null;
    const checkOut = form.checkOutDateTime ? new Date(form.checkOutDateTime).toISOString().slice(0, 19) : null;
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in.');
      return;
    }
    const body = {
      guestName: form.guestName,
      address: form.address,
      nicNumber: form.nicNumber,
      contactNumber: form.contactNumber,
      roomId: form.roomId,
      roomType: form.roomType,
      checkInDateTime: checkIn,
      checkOutDateTime: checkOut,
      createdByStaffId: user.userId
    };
    if (editingId) {
      try {
        const res = await fetch(`/api/admin/reservations/${editingId}`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(await res.text());
        setSuccess('Reservation updated.');
        loadReservations();
        resetForm();
      } catch (err) {
        setError(err.message || 'Update failed');
      }
    } else {
      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(await res.text());
        setSuccess('Reservation created.');
        loadReservations();
        resetForm();
      } catch (err) {
        setError(err.message || 'Create failed');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('Reservation deleted.');
      loadReservations();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      guestName: r.guestName || '',
      address: r.address || '',
      nicNumber: r.nicNumber || '',
      contactNumber: r.contactNumber || '',
      roomId: r.roomId || '',
      roomType: r.roomType || '',
      checkInDateTime: toDatetimeLocal(r.checkInDateTime),
      checkOutDateTime: toDatetimeLocal(r.checkOutDateTime)
    });
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Manage Reservations (walk-in)</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-emerald-600 text-sm mb-2">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm mb-4 space-y-3 max-w-2xl">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Guest name</label>
          <input type="text" name="guestName" value={form.guestName} onChange={handleChange} required className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">NIC</label>
            <input type="text" name="nicNumber" value={form.nicNumber} onChange={handleChange} required className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contact</label>
            <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Room</label>
          <select name="roomId" value={form.roomId} onChange={handleRoomSelect} required className="w-full border rounded px-2 py-1.5 text-sm">
            <option value="">Select room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomType} #{room.roomNumber} — Rs. {Number(room.ratePerNight).toFixed(2)}/night
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Check-in</label>
            <input type="datetime-local" name="checkInDateTime" value={form.checkInDateTime} onChange={handleChange} required className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Check-out</label>
            <input type="datetime-local" name="checkOutDateTime" value={form.checkOutDateTime} onChange={handleChange} required className="w-full border rounded px-2 py-1.5 text-sm" />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-sky-700 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-sky-800">
            {editingId ? 'Update reservation' : 'Add reservation'}
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
              <th className="text-left p-2">Ref</th>
              <th className="text-left p-2">Guest</th>
              <th className="text-left p-2">Room</th>
              <th className="text-left p-2">Check-in</th>
              <th className="text-left p-2">Check-out</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.reservationNumber}</td>
                <td className="p-2">{r.guestName}</td>
                <td className="p-2">{r.roomType}</td>
                <td className="p-2">{r.checkInDateTime ? new Date(r.checkInDateTime).toLocaleString() : '—'}</td>
                <td className="p-2">{r.checkOutDateTime ? new Date(r.checkOutDateTime).toLocaleString() : '—'}</td>
                <td className="p-2">Rs. {Number(r.totalAmount).toFixed(2)}</td>
                <td className="p-2">
                  <button type="button" onClick={() => startEdit(r)} className="text-sky-600 hover:underline text-xs mr-2">Edit</button>
                  <button type="button" onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && <p className="text-slate-500 text-sm p-2">No reservations yet.</p>}
      </div>
    </section>
  );
}

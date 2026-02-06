import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CustomerReservationPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
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
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    const room = rooms.find((r) => r.id === roomId);
    setForm({
      ...form,
      roomId,
      roomType: room?.roomType || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.roomId || !form.checkInDateTime || !form.checkOutDateTime) {
      setError('Please fill all required fields.');
      return;
    }
    if (new Date(form.checkOutDateTime) <= new Date(form.checkInDateTime)) {
      setError('Check-out must be after check-in.');
      return;
    }
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Reservation failed');
      }
      const reservation = await res.json();
      navigate('/reservation/confirm', { state: { reservation } });
    } catch (err) {
      setError('Reservation failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Guest Name</label>
          <input
            type="text"
            name="guestName"
            value={form.guestName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={form.nicNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Room</label>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleRoomChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomType} #{room.roomNumber} (Rs. {room.ratePerNight}/night)
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in (date &amp; time)</label>
            <input
              type="datetime-local"
              name="checkInDateTime"
              value={form.checkInDateTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-out (date &amp; time)</label>
            <input
              type="datetime-local"
              name="checkOutDateTime"
              value={form.checkOutDateTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-emerald-700"
        >
          Add Reservation &amp; Calculate Bill
        </button>
      </form>
    </div>
  );
}


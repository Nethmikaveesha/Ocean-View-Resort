import React, { useEffect, useState } from 'react';

export function HomePage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to Ocean View Resort</h1>
      <p className="mb-6 text-slate-700">
        Browse our rooms and make your reservation online in just a few steps.
      </p>
      <section>
        <h2 className="text-xl font-semibold mb-3">Available Rooms</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {room.roomType} #{room.roomNumber}
                </h3>
                <p className="text-sm text-slate-600 mb-2">{room.description}</p>
                <p className="text-sm text-slate-700">
                  Sleeps {room.capacity} guests • Rs. {room.ratePerNight.toFixed(2)} per night
                </p>
              </div>
              <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wide text-emerald-600">
                {room.status}
              </span>
            </div>
          ))}
          {rooms.length === 0 && (
            <p className="text-sm text-slate-600">
              No rooms added yet. Admin can add rooms from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}


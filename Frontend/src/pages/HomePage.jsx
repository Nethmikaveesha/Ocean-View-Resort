import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

function RoomCard({ room }) {
  const imageSrc = room.imageUrl ? (room.imageUrl.startsWith('http') ? room.imageUrl : API_BASE + room.imageUrl) : null;
  const [imageError, setImageError] = useState(false);
  const showImage = imageSrc && !imageError;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col justify-between">
      {showImage ? (
        <img
          src={imageSrc}
          alt={`${room.roomType} ${room.roomNumber}`}
          className="w-full h-40 object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-40 bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
          No image
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {room.roomType} #{room.roomNumber}
        </h3>
        <p className="text-sm text-slate-600 mb-2">{room.description}</p>
        <p className="text-sm text-slate-700">
          Sleeps {room.capacity} guests • Rs. {room.ratePerNight.toFixed(2)} per night
        </p>
        <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wide text-emerald-600">
          {room.status}
        </span>
      </div>
    </div>
  );
}

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
      <div className="relative w-full rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src="/resort-hero.png"
          alt="Ocean View Resort at sunset — pool, palm trees and modern architecture"
          className="w-full h-[280px] md:h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">Welcome to Ocean View Resort</h1>
          <p className="mt-2 text-white/95 text-lg drop-shadow">
            Browse our rooms and make your reservation online in just a few steps.
          </p>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-3">Available Rooms</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
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


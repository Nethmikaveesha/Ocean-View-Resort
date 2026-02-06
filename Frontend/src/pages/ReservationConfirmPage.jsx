import React from 'react';
import { useLocation } from 'react-router-dom';

export function ReservationConfirmPage() {
  const location = useLocation();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return <p>No reservation data to display.</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
      <p className="mb-4 text-slate-700">
        Your reservation has been created. Please keep these details for your records.
      </p>
      <dl className="space-y-1 text-sm">
        <div>
          <dt className="font-semibold">Reservation Number</dt>
          <dd>{reservation.reservationNumber}</dd>
        </div>
        <div>
          <dt className="font-semibold">Guest Name</dt>
          <dd>{reservation.guestName}</dd>
        </div>
        <div>
          <dt className="font-semibold">Room</dt>
          <dd>
            {reservation.roomType} (ID: {reservation.roomId})
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Check-in</dt>
          <dd>{reservation.checkInDateTime}</dd>
        </div>
        <div>
          <dt className="font-semibold">Check-out</dt>
          <dd>{reservation.checkOutDateTime}</dd>
        </div>
        <div>
          <dt className="font-semibold">Nights</dt>
          <dd>{reservation.nights}</dd>
        </div>
        <div>
          <dt className="font-semibold">Total Amount</dt>
          <dd>Rs. {reservation.totalAmount}</dd>
        </div>
      </dl>
      <button
        onClick={() => window.print()}
        className="mt-4 bg-sky-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-sky-800"
      >
        Print Reservation
      </button>
    </div>
  );
}


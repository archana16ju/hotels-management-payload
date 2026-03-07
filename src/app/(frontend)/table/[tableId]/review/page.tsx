'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReviewPage({ params }: any) {
  const tableId = params.tableId;
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!orderId) return alert('No order ID');
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, rating, comment }),
    });
    alert('Review submitted! Thank you.');
    window.location.href = `/table/${tableId}`;
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <label className="block mb-2">Rating (1-5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded w-full mb-4"
        />

        <label className="block mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentPage({ params }: any) {
  const tableId = params.tableId;
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data);
    }
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!orderId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (res.ok) {
      alert('Payment successful!');
      window.location.href = `/table/${tableId}/review?orderId=${orderId}`;
    } else {
      alert('Payment failed');
    }
  };

  if (!order) return <div className="p-4">Loading order...</div>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Payment for Table {tableId}</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <ul>
          {order.items.map((item: any, idx: number) => (
            <li key={idx} className="flex justify-between">
              <span>{item.product.name}</span>
              <span>₹{item.product.price}</span>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-2">Total: ₹{order.total}</p>
        <button
          onClick={handlePayment}
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
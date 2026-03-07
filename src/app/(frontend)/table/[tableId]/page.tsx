'use client';

import React, { useEffect, useState } from 'react';

export default function TablePage({ params }: any) {
  const tableId = params.tableId;
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getProducts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
      const data = await res.json();
      setProducts(data.docs || []);
    }
    getProducts();
  }, []);

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold">Table: {tableId}</h2>
        <div className="flex gap-4 text-xl">
          <span>👤</span>
          <span>🛒</span>
        </div>
      </div>


      <div className="p-4">
        <input
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto p-4">
        <button className="border px-4 py-1 rounded">Pizza</button>
        <button className="border px-4 py-1 rounded">Burger</button>
        <button className="border px-4 py-1 rounded">Drinks</button>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredProducts.map((item: any) => (
          <div key={item.id} className="border p-3 rounded flex flex-col items-center">
            {item.image?.url && (
              <img
                src={item.image.url}
                alt={item.name}
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold">{item.name}</h3>
            <p>₹{item.price}</p>
            <button className="bg-black text-white px-3 py-1 rounded mt-2">
              Add
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
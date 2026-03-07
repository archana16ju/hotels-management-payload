'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: { url: string };
  category: string;
};

type Category = {
  id: string;
  name: string;
};

export default function TablePage({ params }: any) {
  const tableId = params.tableId;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
      const data = await res.json();
      setCategories(data.docs || []);
      if (data.docs && data.docs.length > 0) setSelectedCategory(data.docs[0].id);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
      const data = await res.json();
      setProducts(data.docs || []);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory ? item.category === selectedCategory : true)
  );

  const addToCart = (item: Product) => setCart((prev) => [...prev, item]);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="font-bold text-xl">Table: {tableId}</h2>
        <div className="flex gap-4 text-xl">
          <span>👤</span>
          <span>🛒 {cart.length}</span>
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
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`border px-4 py-1 rounded ${
              selectedCategory === cat.id ? 'bg-black text-white' : ''
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="border p-3 rounded flex flex-col items-center bg-white shadow-sm"
          >
            {item.image?.url && (
              <img
                src={item.image.url}
                alt={item.name}
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold">{item.name}</h3>
            <p>₹{item.price}</p>
            <button
              className="bg-black text-white px-3 py-1 rounded mt-2"
              onClick={() => addToCart(item)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded w-64">
          <h3 className="font-bold mb-2">Cart ({cart.length})</h3>
          <ul>
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
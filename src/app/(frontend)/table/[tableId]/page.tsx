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
  image?: { url: string };
};

export default function TablePage({ params }: any) {
  const tableId = params.tableId;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
      const data = await res.json();
      setCategories(data.docs || []);
      if (data.docs && data.docs.length > 0) setSelectedCategory(data.docs[0].id);
    }
    fetchCategories();
  }, []);

  // Fetch products
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

  const addToCart = (item: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === item.id);
      if (existing) return prev.map((i) => (i.product.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product: item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
        <h2 className="font-bold text-xl">Table: {tableId}</h2>
        <div className="flex gap-4 text-xl">
          <span>👤</span>
          <span>🛒 {cart.reduce((sum, i) => sum + i.qty, 0)}</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-4">
        <input
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full shadow-sm"
        />
      </div>

      {/* CATEGORIES */}
      <div className="flex gap-3 overflow-x-auto p-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flex flex-col items-center border px-4 py-2 rounded transition-all ${
              selectedCategory === cat.id ? 'bg-black text-white scale-105' : 'bg-white'
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.image?.url && (
              <img
                src={cat.image.url}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-full mb-1"
              />
            )}
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="border p-3 rounded-lg flex flex-col items-center bg-white shadow-md hover:shadow-xl transition-shadow"
          >
            {item.image?.url && (
              <img
                src={item.image.url}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-semibold text-center">{item.name}</h3>
            <p className="text-green-700 font-bold">₹{item.price}</p>
            <button
              className="bg-black text-white px-3 py-1 rounded mt-2 w-full"
              onClick={() => addToCart(item)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* CART DRAWER */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 left-0 md:right-4 md:w-80 bg-white shadow-lg rounded-t-lg p-4">
          <h3 className="font-bold text-lg mb-2">Cart ({cart.reduce((sum, i) => sum + i.qty, 0)})</h3>
          <ul className="max-h-48 overflow-y-auto">
            {cart.map((i) => (
              <li key={i.product.id} className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">{i.product.name}</span>
                  <span> x{i.qty}</span>
                </div>
                <div className="flex gap-2">
                  <span>₹{i.product.price * i.qty}</span>
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => removeFromCart(i.product.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button
            className="mt-2 w-full bg-green-600 text-white py-2 rounded"
            onClick={() => alert('Order placed! You can integrate payment page next.')}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
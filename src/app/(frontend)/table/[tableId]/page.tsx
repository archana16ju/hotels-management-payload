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
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`);
        const data = await res.json();
        setCategories(data.docs || []);
        if (data.docs && data.docs.length > 0) setSelectedCategory(data.docs[0].id);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
        const data = await res.json();
        setProducts(data.docs || []);
      } catch (err) {
        console.error(err);
      }
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

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: tableId,
          items: cart.map((i) => ({ product: i.product.id, quantity: i.qty })),
          total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Order placed successfully! Redirecting to payment...');
        window.location.href = `/table/${tableId}/payment?orderId=${data.id}`;
      } else {
        alert('Failed to place order');
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 font-sans">

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center p-6 bg-orange-500 text-white shadow-md sticky top-0 z-10 rounded-b-lg">
        <h2 className="text-2xl font-bold tracking-wide mb-1">Table: {tableId}</h2>
        <div className="flex gap-6 text-2xl font-semibold">
          <span>👤</span>
          <span>🛒 {cart.reduce((sum, i) => sum + i.qty, 0)}</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-6 flex justify-center">
        <input
          placeholder="Search your favorite food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-orange-400 focus:border-orange-600 focus:ring-2 focus:ring-orange-300 p-3 rounded-full w-full max-w-md shadow-md"
        />
      </div>

      {/* CATEGORIES */}
      <div className="flex gap-4 overflow-x-auto px-6 py-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flex flex-col items-center border-2 p-3 rounded-lg transition-transform ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-white scale-105 shadow-lg'
                : 'bg-white text-gray-800 hover:scale-105 hover:shadow-md'
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.image?.url && (
              <img
                src={cat.image.url}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-orange-300"
              />
            )}
            <span className="font-semibold">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-24">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center hover:shadow-xl transition-shadow"
          >
            {item.image?.url && (
              <img
                src={item.image.url}
                alt={item.name}
                className="w-36 h-36 object-cover rounded-xl mb-3"
              />
            )}
            <h3 className="font-semibold text-center text-lg">{item.name}</h3>
            <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>
            <button
              className="bg-orange-500 text-white mt-3 px-4 py-2 rounded-full hover:bg-orange-600 w-full"
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART DRAWER */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 left-0 md:right-6 md:w-80 bg-white shadow-lg rounded-t-xl p-5 z-20">
          <h3 className="text-xl font-bold mb-3 text-center text-orange-600">
            Cart ({cart.reduce((sum, i) => sum + i.qty, 0)})
          </h3>
          <ul className="max-h-52 overflow-y-auto mb-3">
            {cart.map((i) => (
              <li key={i.product.id} className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">{i.product.name}</span>
                  <span> x{i.qty}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-orange-600">₹{i.product.price * i.qty}</span>
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
          <div className="flex justify-between font-bold mb-3">
            <span>Total</span>
            <span className="text-orange-600">₹{total}</span>
          </div>
          <button
            className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 font-semibold"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
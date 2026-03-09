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
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

    <div className="w-full bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">
          Table: {tableId}
        </h2>

        <div className="flex items-center gap-6 text-lg font-semibold">
          <span className="cursor-pointer">👤 Login</span>
          <span className="cursor-pointer">
            🛒 {cart.reduce((sum, i) => sum + i.qty, 0)}
          </span>
        </div>
      </div>
    </div>


    <div className="w-full flex justify-center mt-8">
      <input
        placeholder="Search your favorite food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-[500px]
          max-w-[90%]
          p-4
          rounded-full
          border
          border-gray-300
          shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-purple-400
        "
      />
    </div>


    <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto py-6 px-6">

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`flex flex-col items-center p-3 rounded-xl min-w-[110px] transition
          
          ${
            selectedCategory === cat.id
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white hover:shadow-md"
          }
          
          `}
        >
          {cat.image?.url && (
            <img
              src={cat.image.url}
              alt={cat.name}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
          )}

          <span className="text-sm font-semibold">{cat.name}</span>
        </button>
      ))}

    </div>


    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-32">

      {filteredProducts.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col items-center"
        >
          {item.image?.url && (
            <img
           src={`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image.url}`}
           alt={item.name}
           className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-orange-300"
             />
          )}

          <h3 className="font-semibold text-center">{item.name}</h3>

          <p className="text-purple-600 font-bold mt-1">
            ₹{item.price}
          </p>

          <button
            onClick={() => addToCart(item)}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full w-full"
          >
            Add to Cart
          </button>
        </div>
      ))}

    </div>


    {/* CART */}
    {cart.length > 0 && (
      <div className="fixed bottom-0 right-0 left-0 md:left-auto md:w-[350px] bg-white shadow-2xl p-6 rounded-t-xl">

        <h3 className="text-xl font-bold mb-4 text-purple-600">
          Cart ({cart.reduce((sum, i) => sum + i.qty, 0)})
        </h3>

        <ul className="max-h-60 overflow-y-auto mb-4">
          {cart.map((i) => (
            <li
              key={i.product.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {i.product.name} x{i.qty}
              </span>

              <div className="flex gap-3 items-center">
                <span className="font-semibold">
                  ₹{i.product.price * i.qty}
                </span>

                <button
                  onClick={() => removeFromCart(i.product.id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between font-bold mb-3">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={placeOrder}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full"
        >
          Place Order
        </button>

      </div>
    )}

  </div>
)
}
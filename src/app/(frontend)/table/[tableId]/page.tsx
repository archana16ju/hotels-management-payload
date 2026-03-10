'use client';

import { useEffect, useState, use } from 'react';


type Product = {
  id: string;
  name: string;
  price: number;
  image?: { url: string };
  category: string;
  description?: string;
  foodType?: 'veg' | 'non-veg';
  variants?: { price: number; [key: string]: any }[];
  images?: { url: string }[];
};

type Category = {
  id: string;
  name: string;
  image?: { url: string };
};

export default function TablePage(props: { params: Promise<{ tableId: string }> }) {
  const params = use(props.params);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-100 text-gray-800 font-sans pb-32">
      {/* HEADER: Table info (Center), Login/Cart (Right) */}
      <header className="w-full bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center px-4 py-4 relative h-16">
          
          {/* Centered Table Title */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-purple-600 text-2xl font-black tracking-widest shrink-0">TABLE</span>
            <span className="text-gray-800 text-lg font-bold border-l-2 border-purple-400 pl-2 ml-2">
              #{tableId}
            </span>
          </div>

          {/* Right Actions (Login / Cart) */}
          <div className="absolute right-4 lg:right-8 flex items-center gap-4 sm:gap-6 text-sm sm:text-base font-bold text-gray-700">
            <button className="flex items-center gap-2 hover:text-purple-600 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">👤</span> 
              <span className="hidden sm:inline">Sign In</span>
            </button>
            <button className="flex items-center gap-2 hover:text-purple-600 transition-colors group">
              <span className="text-xl group-hover:scale-110 transition-transform">🛒</span> 
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full ml-1 shadow-sm">
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH BAR (Desktop & Mobile) - Centered Exactly Under Header */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-4">
        <div className="relative w-full max-w-2xl mx-auto group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-purple-500 transition-colors">🔍</span>
          <input
            placeholder="Search for dishes, cuisines, or restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-white/40 shadow-xl pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all font-medium text-gray-800 placeholder-gray-500"
          />
        </div>
      </div>

      {/* CATEGORIES SECTION (Horizontal Landscape Rectangles) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-4">
        <h2 className="text-2xl font-extrabold text-white mb-6 drop-shadow-md">Explore Categories</h2>
        
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)}
              className="flex flex-col flex-shrink-0 group snap-center focus:outline-none transition-transform hover:-translate-y-1"
            >
              <div 
                className={`w-40 sm:w-48 h-24 sm:h-28 rounded-2xl overflow-hidden transition-all duration-300 relative shadow-lg ${
                  selectedCategory === cat.id 
                  ? 'ring-4 ring-purple-400 scale-105 shadow-purple-500/50' 
                  : 'ring-2 ring-white/20 hover:ring-white/60'
                }`}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs text-center font-medium p-2">
                    No Image
                  </div>
                )}

                {/* Category Name Overlaid on Image */}
                <span className={`absolute bottom-3 left-3 right-3 text-left font-bold z-20 leading-tight ${
                  selectedCategory === cat.id ? 'text-purple-300' : 'text-white'
                }`}>
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        <hr className="mt-4 border-t border-white/20" />
      </section>

      {/* PRODUCTS LISTING */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {selectedCategory ? 'Recommended in this category' : 'Recommended for you'}
        </h2>
        
        <div className="flex flex-col gap-8">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white flex justify-between items-start gap-4 border-b border-gray-200 pb-8 last:border-0"
            >
              {/* Product Info Left Side */}
              <div className="flex-1 pr-2 sm:pr-8">
                {/* Veg/Non-Veg icon mimic */}
                <div className={`w-4 h-4 rounded-sm border mb-2 flex items-center justify-center ${
                  item.foodType === 'non-veg' ? 'border-red-600' : 'border-green-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    item.foodType === 'non-veg' ? 'bg-red-600' : 'bg-green-600'
                  }`} />
                </div>
                
                <h3 className="font-bold text-lg sm:text-xl text-gray-800">{item.name}</h3>
                <p className="font-semibold text-gray-800 mt-1">₹{item.price || item.variants?.[0]?.price || 0}</p>
                <div className="mt-3 flex items-center text-xs font-bold text-yellow-500 bg-yellow-50 inline-block px-1 rounded">
                   ⭐ 4.5 (1k+ ratings)
                </div>
                <p className="text-sm text-gray-500 mt-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {item.description || 'A delicious, hand-crafted culinary delight tailored to excite your taste buds with rich, authentic flavors.'}
                </p>
              </div>

              {/* Product Image Right Side (With sticky 'Add' button) */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                {item.image?.url || item.images?.[0]?.url ? (
                  <img
                    src={item.image?.url || item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-2xl shadow-sm"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
                
                <button
                  onClick={() => addToCart(item)}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#fc8019] text-sm sm:text-lg font-extrabold border border-gray-300 shadow-lg px-8 py-2 rounded-xl uppercase hover:bg-gray-50 transition-colors active:scale-95 z-10"
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium border-dashed border-2 rounded-xl">
              No dishes found matching your search.
            </div>
          )}
        </div>
      </section>

      {/* FLOAT CART SUMMARY (BOTTOM STICKY) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 left-0 bg-white border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-30 p-4 sm:p-6 md:hidden">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{cart.reduce((sum, i) => sum + i.qty, 0)} ITEMS | ₹{total}</p>
                <p className="text-sm font-bold text-gray-800">Extra charges may apply</p>
              </div>
              <button
                onClick={placeOrder}
                className="bg-[#fc8019] text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-orange-600 active:scale-95 transition-all text-sm"
              >
                View Cart &gt;
              </button>
            </div>
        </div>
      )}

      {/* DESKTOP SIDE CART */}
      {cart.length > 0 && (
        <aside className="hidden md:flex fixed top-24 right-8 w-80 max-h-[calc(100vh-8rem)] bg-white shadow-xl rounded-2xl border flex-col z-20">
          <div className="p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
            <h3 className="text-2xl font-black text-gray-800">Cart</h3>
            <p className="text-sm text-gray-500 font-medium">{cart.reduce((sum, i) => sum + i.qty, 0)} ITEMS</p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
            {cart.map((i) => (
              <div key={i.product.id} className="flex justify-between items-center mb-5 group">
                <div className="flex-1 pr-2">
                  <div className={`w-3 h-3 rounded-sm border mb-1 flex items-center justify-center ${
                    i.product.foodType === 'non-veg' ? 'border-red-600' : 'border-green-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i.product.foodType === 'non-veg' ? 'bg-red-600' : 'bg-green-600'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 line-clamp-2">{i.product.name}</span>
                  <span className="text-xs text-gray-500 block">₹{i.product.price || i.product.variants?.[0]?.price || 0}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center border rounded bg-white shadow-sm overflow-hidden text-[#fc8019] font-bold">
                    <button onClick={() => removeFromCart(i.product.id)} className="px-2 py-1 hover:bg-gray-100 transition">-</button>
                    <span className="px-2 text-sm">{i.qty}</span>
                    <button onClick={() => addToCart(i.product)} className="px-2 py-1 hover:bg-gray-100 transition">+</button>
                  </div>
                  <span className="font-bold text-sm text-gray-800 w-12 text-right">
                    ₹{(i.product.price || i.product.variants?.[0]?.price || 0) * i.qty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t bg-gray-50 sticky bottom-0 rounded-b-2xl">
            <div className="flex justify-between font-bold text-gray-800 mb-4 text-lg">
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={placeOrder}
              className="w-full bg-[#fc8019] hover:bg-orange-600 transition-colors text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-md"
            >
              Checkout
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
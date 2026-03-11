'use client'

import { useEffect, useState, use } from 'react'

type Product = {
  id: string
  name: string
  price: number
  image?: { url: string }
  category?: { id: string }
  description?: string
  foodType?: 'veg' | 'non-veg'
}

type Category = {
  id: string
  name: string
  image?: { url: string }
}

export default function TablePage(props: { params: Promise<{ tableId: string }> }) {
  const params = use(props.params)
  const tableId = params.tableId

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`)
        const data = await res.json()
        setCategories(data.docs || [])
        if (data.docs?.length > 0) setSelectedCategory(data.docs[0].id)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`)
        const data = await res.json()
        setProducts(data.docs || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory ? item.category?.id === selectedCategory : true)
  )

  const addToCart = (item: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { product: item, qty: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id))
  }

  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: tableId,
          items: cart.map((i) => ({
            product: i.product.id,
            quantity: i.qty,
          })),
          total,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Order placed successfully!')
        window.location.href = `/table/${tableId}/payment?orderId=${data.id}`
      }
    } catch (err) {
      console.error(err)
      alert('Error placing order')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-400 pb-40">

      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-6 py-4">

          <div></div>

          <div className="text-center">
            <span className="text-purple-600 text-2xl font-black tracking-widest">
              TABLE
            </span>
            <span className="ml-2 text-gray-700 font-bold">
              #{tableId}
            </span>
          </div>

          <div className="flex justify-end items-center gap-6">

            <button className="flex items-center gap-2 font-semibold text-gray-700 hover:text-purple-600">
              👤 Login
            </button>

            <button className="flex items-center gap-2 font-semibold text-gray-700 hover:text-purple-600">
              🛒 Cart
              <span className="bg-purple-600 text-white text-xs px-2 rounded-full">
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            </button>

          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <input
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border p-4 shadow focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <section className="max-w-7xl mx-auto px-6 mt-10">

        <h2 className="text-white text-2xl font-bold mb-6">
          Explore Categories
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4">

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)
              }
              className="flex-shrink-0 w-44"
            >

              <div
                className={`relative rounded-xl overflow-hidden shadow-lg ${
                  selectedCategory === cat.id ? 'ring-4 ring-white' : ''
                }`}
              >
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-200"></div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70"></div>

                <span className="absolute bottom-2 left-3 text-white font-bold text-sm">
                  {cat.name}
                </span>
              </div>

            </button>
          ))}

        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mt-12">

        <div className="flex flex-col gap-8">

          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-start"
            >

              <div className="flex-1 pr-6">

                <h3 className="font-bold text-lg text-gray-800">
                  {item.name}
                </h3>

                <p className="text-gray-700 font-semibold mt-1">
                  ₹{item.price}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  {item.description || 'Delicious food item'}
                </p>

              </div>

              <div className="relative w-36 h-36 flex-shrink-0">

                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full rounded-xl"></div>
                )}

                <button
                  onClick={() => addToCart(item)}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-purple-600 border font-bold px-6 py-2 rounded-lg shadow"
                >
                  ADD
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow md:hidden">

          <div className="flex justify-between items-center">

            <div>
              <p className="font-bold">{cart.length} items</p>
              <p className="text-sm text-gray-600">₹{total}</p>
            </div>

            <button
              onClick={placeOrder}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              Checkout
            </button>

          </div>

        </div>
      )}

      {cart.length > 0 && (
        <aside className="hidden md:flex fixed right-10 top-28 w-80 bg-white rounded-xl shadow-xl flex-col">

          <div className="p-5 border-b font-bold text-lg">
            Cart
          </div>

          <div className="flex-1 p-5 overflow-y-auto">

            {cart.map((i) => (
              <div
                key={i.product.id}
                className="flex justify-between mb-4"
              >
                <span>{i.product.name}</span>
                <span>₹{i.product.price * i.qty}</span>
              </div>
            ))}

          </div>

          <div className="p-5 border-t">

            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold"
            >
              Checkout
            </button>

          </div>

        </aside>
      )}

    </div>
  )
}
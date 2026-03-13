"use client";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const shipping = total >= 999 ? 0 : 99;

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-6xl mb-6">🛍️</p>
      <h2 className="text-2xl font-bold text-stone-900 mb-3">Your cart is empty</h2>
      <p className="text-stone-500 mb-8">Add some sandals and walk in comfort.</p>
      <Link href="/shop" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm">
              <div className="w-20 h-20 bg-solio-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">👡</div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900">{item.product_name}</p>
                <p className="text-sm text-stone-500">{item.color} · Size {item.size}</p>
                <p className="font-bold text-stone-900 mt-1">&#8377;{(item.price * item.quantity).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(i, item.quantity - 1)} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(i, item.quantity + 1)} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => removeFromCart(i)} className="text-stone-400 hover:text-red-500 transition-colors ml-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-stone-900 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>&#8377;{total.toLocaleString()}</span></div>
            <div className="flex justify-between text-stone-600"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `₹${shipping}`}</span></div>
            {shipping > 0 && <p className="text-xs text-stone-400">Add &#8377;{999 - total} more for free shipping</p>}
            <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-900 text-base">
              <span>Total</span><span>&#8377;{(total + shipping).toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center block">Proceed to Checkout</Link>
          <Link href="/shop" className="block text-center text-sm text-stone-500 hover:text-stone-700 mt-3">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

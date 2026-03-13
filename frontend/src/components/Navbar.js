"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { count } = useCart();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-solio-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-stone-900">
          solio<span className="text-solio-500">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-stone-600">
          <Link href="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-stone-900 transition-colors">About</Link>
        </div>
        <Link href="/cart" className="relative">
          <ShoppingBag className="w-5 h-5 text-stone-700 hover:text-stone-900 transition-colors" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

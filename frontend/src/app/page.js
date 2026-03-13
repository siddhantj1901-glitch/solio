"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center bg-solio-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <p className="text-solio-500 font-semibold text-sm tracking-widest uppercase mb-4">New Collection</p>
            <h1 className="text-5xl md:text-7xl font-bold text-stone-900 leading-tight mb-6">
              Walk Like<br />You Mean It<span className="text-solio-500">.</span>
            </h1>
            <p className="text-stone-500 text-lg mb-8 max-w-md leading-relaxed">
              Comfort-first sandals for urban India. Arch support, premium straps, all-day wear. Starting &#8377;1,299.
            </p>
            <div className="flex gap-4">
              <Link href="/shop" className="btn-primary">Shop Now</Link>
              <Link href="/about" className="btn-outline">Our Story</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-80 h-80 bg-solio-100 rounded-full flex items-center justify-center">
              <span className="text-9xl">👡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🦶", title: "Arch Support", desc: "Contoured EVA footbed" },
              { icon: "☀️", title: "All-Day Comfort", desc: "8+ hour wear tested" },
              { icon: "💧", title: "Monsoon Ready", desc: "Anti-slip outsole" },
              { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
            ].map(f => (
              <div key={f.title} className="p-6">
                <p className="text-4xl mb-3">{f.icon}</p>
                <p className="font-semibold text-stone-900 mb-1">{f.title}</p>
                <p className="text-sm text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="py-20 bg-solio-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-stone-900 mb-2">The Collection</h2>
              <p className="text-stone-500">One sandal. Endless days.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Social proof */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-solio-500 font-semibold text-sm tracking-widest uppercase mb-4">Why Solio</p>
          <h2 className="text-3xl font-bold mb-12">Designed for real Indian life</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Finally a sandal I can wear from office to dinner without my feet dying.", author: "Urban professional, Bengaluru" },
              { quote: "The arch support is real. I have flat feet and these are the only sandals I can wear all day.", author: "WFH professional, Mumbai" },
              { quote: "Wore them through the entire monsoon season. Zero slipping.", author: "College student, Pune" },
            ].map((r, i) => (
              <div key={i} className="bg-stone-800 rounded-2xl p-6 text-left">
                <p className="text-stone-300 mb-4 leading-relaxed">"{r.quote}"</p>
                <p className="text-solio-500 text-sm font-semibold">— {r.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-solio-100">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Your feet deserve better.</h2>
          <p className="text-stone-500 mb-8">Free shipping on your first order. 7-day returns.</p>
          <Link href="/shop" className="btn-primary">Shop the Collection</Link>
        </div>
      </section>
    </div>
  );
}

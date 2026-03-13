"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">The Collection</h1>
        <p className="text-stone-500">Comfort-first sandals for every day.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-stone-200 rounded-2xl aspect-square mb-4"></div>
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-3 bg-stone-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

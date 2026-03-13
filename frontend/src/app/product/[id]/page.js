"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../components/CartProvider";
import { ShoppingBag, Check } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(p => {
      setProduct(p);
      if (p.colors?.length) setSelectedColor(p.colors[0]);
    }).catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) { setError("Please select a size"); return; }
    if (!selectedColor) { setError("Please select a color"); return; }
    setError("");
    addToCart({
      product_id: product.id,
      product_name: product.name,
      color: selectedColor.name,
      size: selectedSize,
      quantity: 1,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="animate-pulse grid md:grid-cols-2 gap-12">
        <div className="bg-stone-200 rounded-2xl aspect-square"></div>
        <div className="space-y-4 pt-8">
          <div className="h-8 bg-stone-200 rounded w-3/4"></div>
          <div className="h-4 bg-stone-200 rounded w-1/2"></div>
          <div className="h-12 bg-stone-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <div>
          <div className="bg-solio-100 rounded-3xl aspect-square flex items-center justify-center mb-4" style={{ background: selectedColor?.hex + "22" }}>
            <span className="text-9xl">👡</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.colors?.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${selectedColor?.name === c.name ? "ring-2 ring-stone-900 scale-105" : "opacity-60 hover:opacity-100"}`}
                style={{ background: c.hex + "33" }}
              >
                👡
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="fade-up">
          <p className="text-solio-500 text-sm font-semibold uppercase tracking-widest mb-2">Solio</p>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>
          <p className="text-stone-500 mb-4">{product.tagline}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-stone-900">&#8377;{product.price?.toLocaleString()}</span>
            {product.original_price && (
              <span className="text-lg text-stone-400 line-through">&#8377;{product.original_price?.toLocaleString()}</span>
            )}
            {discount && <span className="bg-stone-900 text-white text-xs px-2 py-1 rounded-full font-bold">{discount}% OFF</span>}
          </div>

          <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-stone-700 mb-3">Color: <span className="font-normal text-stone-500">{selectedColor?.name}</span></p>
            <div className="flex gap-3">
              {product.colors?.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor?.name === c.name ? "border-stone-900 scale-110" : "border-stone-300"}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-stone-700 mb-3">Size (UK)</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-12 rounded-xl text-sm font-semibold border transition-all ${
                    selectedSize === s
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-300 text-stone-700 hover:border-stone-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-sm transition-all ${added ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-800"}`}>
              {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
            </button>
            <button onClick={() => { handleAddToCart(); if (selectedSize) router.push("/checkout"); }} className="flex-1 btn-outline">
              Buy Now
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-200 grid grid-cols-3 gap-4 text-center text-sm">
            {[["🚚", "Free shipping", "above ₹999"], ["↩️", "7-day returns", "hassle-free"], ["✅", "Genuine product", "quality assured"]].map(([icon, title, sub]) => (
              <div key={title}>
                <p className="text-xl mb-1">{icon}</p>
                <p className="font-semibold text-stone-700">{title}</p>
                <p className="text-stone-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

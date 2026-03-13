import Link from "next/link";

export default function ProductCard({ product }) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-solio-100 rounded-2xl overflow-hidden aspect-square mb-4 relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-2">👡</p>
            <p className="text-xs text-stone-400">{product.name}</p>
          </div>
        </div>
        {discount && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {discount}% OFF
          </span>
        )}
      </div>
      <h3 className="font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">{product.name}</h3>
      <p className="text-sm text-stone-500 mb-1">{product.tagline}</p>
      <div className="flex items-center gap-2">
        <span className="font-bold text-stone-900">&#8377;{product.price.toLocaleString()}</span>
        {product.original_price && (
          <span className="text-sm text-stone-400 line-through">&#8377;{product.original_price.toLocaleString()}</span>
        )}
      </div>
    </Link>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="text-white text-xl font-bold mb-2">solio<span className="text-solio-500">.</span></p>
            <p className="text-sm max-w-xs">Comfort-first sandals for urban India. Walk like you mean it.</p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <p className="text-white font-semibold mb-3">Shop</p>
              <div className="space-y-2">
                <Link href="/shop" className="block hover:text-white transition-colors">All Products</Link>
                <Link href="/about" className="block hover:text-white transition-colors">Our Story</Link>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Help</p>
              <div className="space-y-2">
                <p className="text-stone-500 text-xs mt-4">© 2024 Solio. Made in India.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

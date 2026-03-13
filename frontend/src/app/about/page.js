export default function AboutPage() {
  return (
    <div>
      <section className="bg-stone-900 text-white py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-solio-500 font-semibold text-sm tracking-widest uppercase mb-4">Our Story</p>
          <h1 className="text-5xl font-bold mb-6">Built for Indian feet.<br />Designed for Indian life.</h1>
          <p className="text-stone-400 text-lg leading-relaxed">
            We started Solio because we were tired of choosing between looking good and feeling good on our feet.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-3xl mx-auto px-6">
        <div className="prose prose-stone max-w-none">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">The Problem We Solved</h2>
              <p className="text-stone-600 leading-relaxed">Indian professionals were stuck between two bad choices — cheap chappals that destroyed their feet, or expensive foreign brands that didn't understand Indian conditions. Monsoons, long commutes, office dress codes.</p>
              <p className="text-stone-600 leading-relaxed mt-4">Solio was built to fill that gap. Comfort-engineered, weather-ready, and priced for real people.</p>
            </div>
            <div className="bg-solio-100 rounded-3xl aspect-square flex items-center justify-center text-8xl">👡</div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-16 text-center">
            {[["₹1,299", "Starting price", "No compromise on quality"], ["8 hrs", "Wear tested", "By real urban professionals"], ["3", "Color options", "For every style and occasion"]].map(([stat, label, sub]) => (
              <div key={label} className="bg-solio-50 rounded-2xl p-6">
                <p className="text-3xl font-bold text-stone-900 mb-1">{stat}</p>
                <p className="font-semibold text-stone-700 text-sm">{label}</p>
                <p className="text-stone-400 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-stone-900 text-white rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Promise</h2>
            <p className="text-stone-300 leading-relaxed max-w-xl mx-auto">Every Solio sandal is built with one goal — that you forget you're wearing it. Arch-supported, anti-slip, breathable. Made for the miles ahead.</p>
            <a href="/shop" className="inline-block mt-8 bg-solio-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-solio-500/90 transition-colors">Shop Now</a>
          </div>
        </div>
      </section>
    </div>
  );
}

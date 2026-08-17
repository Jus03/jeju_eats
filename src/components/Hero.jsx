import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="home"
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="relative w-full bg-[#F6F2E9] overflow-hidden scroll-mt-16"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .ff-btn-primary:hover { background-color: #3A4A2C; }
        .ff-btn-secondary:hover { background-color: #EDE8D8; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4B5D3A] mb-4">
            Grilled fresh, daily
          </span>

          <h1 className="ff-serif text-[#2A2E22] text-4xl sm:text-5xl leading-tight mb-5">
            Burgers made the way they're meant to be.
          </h1>

          <p className="text-[#5B5A4E] text-base leading-relaxed mb-8 max-w-md">
            Premium ingredients, grilled to order, and on your table in minutes.
            No shortcuts, no frozen patties — just honest food done right.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="ff-btn-primary px-6 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
            >
              View Menu
            </Link>
            <Link

              to="/cart"
              className="ff-btn-secondary px-6 py-3 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm font-medium transition"
            >
              Order Now
            </Link>
          </div>

          {/* Quick trust signals */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
            <div>
              <p className="ff-serif text-[#2A2E22] text-2xl">15 min</p>
              <p className="text-[#8B8A78] text-xs">Average ready time</p>
            </div>
            <div>
              <p className="ff-serif text-[#2A2E22] text-2xl">100%</p>
              <p className="text-[#8B8A78] text-xs">Fresh, never frozen</p>
            </div>
            <div>
              <p className="ff-serif text-[#2A2E22] text-2xl">4.8★</p>
              <p className="text-[#8B8A78] text-xs">Customer rating</p>
            </div>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop"
              alt="Freshly grilled burger with melted cheese"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-5 py-4 shadow-lg hidden sm:block">
            <p className="ff-serif text-[#2A2E22] text-lg leading-none mb-1">Chef's Pick</p>
            <p className="text-[#8B8A78] text-xs">The Jeju Classic — ₱189</p>
          </div>
        </div>
      </div>
    </section>
  );
}
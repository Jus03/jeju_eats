import React from "react";
import { Link } from "react-router-dom";

const VALUES = [
  {
    title: "Store Hours",
    description: "Open Monday through Saturday from 2:00 PM to 11:00 PM.",
  },
  {
    title: "Store Location",
    description: "We're Located in 113 Adante St Tanong Malabon City.",
  },
 
];

export default function About() {
  return (
    <section
      id="about"
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="w-full bg-white py-16 sm:py-24 scroll-mt-16"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .ff-link-btn:hover { background-color: #3A4A2C; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: image */}
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] sm:aspect-[5/4] rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1200&auto=format&fit=crop"
              alt="Grill master preparing burgers at Jeju Eats"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating stat badge */}
          <div className="absolute -top-5 -right-5 bg-[#4B5D3A] rounded-2xl px-5 py-4 shadow-lg hidden sm:block">
            <p className="ff-serif text-[#F6F2E9] text-2xl leading-none mb-1">Since 2021</p>
            <p className="text-[#EDE8D8] text-xs">Serving the neighborhood</p>
          </div>
        </div>

        {/* Right: copy */}
        <div className="order-1 lg:order-2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4B5D3A] mb-4">
            Our story
          </span>

          <h2 className="ff-serif text-[#2A2E22] text-3xl sm:text-4xl leading-tight mb-5">
            Started with a grill, a family recipe, and a stubborn love of good food.
          </h2>

          <p className="text-[#5B5A4E] text-sm leading-relaxed mb-8">
            Jeju Eats began as a small backyard grill shared with neighbors before it ever became
            a menu. What hasn't changed since then is the standard: real ingredients, no
            shortcuts, and a burger that's grilled — not assembled — for every single order.
          </p>

          {/* Values list */}
          <div className="space-y-5 mb-9">
            {VALUES.map((value) => (
              <div key={value.title} className="flex gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" fill="#4B5D3A" />
                  <path
                    d="M8 12.5l2.5 2.5L16 9.5"
                    stroke="#F6F2E9"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="text-[#2A2E22] text-sm font-semibold mb-0.5">
                    {value.title}
                  </p>
                  <p className="text-[#8B8A78] text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

      
        </div>
      </div>
    </section>
  );
}
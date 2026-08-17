import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";

const BESTSELLERS = [
  {
    name: "The Jeju Classic",
    description: "Grilled beef patty, aged cheddar, caramelized onions, house sauce on a toasted brioche bun.",
    price: "₱189",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    badge: "Best Seller",
  },
  {
    name: "Smoky BBQ Bacon",
    description: "Double patty, crispy bacon, smoked BBQ glaze, and pickled jalapeños for a bit of kick.",
    price: "₱219",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800&auto=format&fit=crop",
    badge: "Fan Favorite",
  },
  {
    name: "Garden Veggie Stack",
    description: "Grilled portobello, roasted red pepper, avocado, and herb aioli on a whole wheat bun.",
    price: "₱169",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=800&auto=format&fit=crop",
    badge: "Vegetarian",
  },
];

export default function FeaturedMenu() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [addedItem, setAddedItem] = useState(null);

  const handleAddToCart = (item) => {
    addItem(item);
    setAddedItem(item.name);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const handleBuyNow = (item) => {
    console.log("Buy now:", item);
    navigate("/checkout", { state: { item } });
  };

  return (
    <section
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="w-full bg-[#F6F2E9] py-16 sm:py-24"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .menu-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(42,46,34,0.10); }
        .menu-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .ff-link-btn:hover { background-color: #3A4A2C; }
        .ff-add-btn:hover { background-color: #4B5D3A; color: #F6F2E9; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4B5D3A] mb-3">
            Crowd favorites
          </span>
          <h2 className="ff-serif text-[#2A2E22] text-3xl sm:text-4xl leading-tight mb-3">
            Our best sellers
          </h2>
          <p className="text-[#5B5A4E] text-sm leading-relaxed">
            The three burgers our customers keep coming back for — grilled fresh, every single order.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BESTSELLERS.map((item) => (
            <div
              key={item.name}
              className="menu-card bg-white rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#F6F2E9] text-[#4B5D3A] text-xs font-semibold px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="ff-serif text-[#2A2E22] text-lg leading-snug">
                    {item.name}
                  </h3>
                  <span className="ff-serif text-[#4B5D3A] text-lg whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
                <p className="text-[#8B8A78] text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="ff-add-btn flex-1 py-2.5 rounded-lg border border-[#4B5D3A] text-[#4B5D3A] text-sm font-medium transition"
                  >
                    {addedItem === item.name ? "Added ✓" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="ff-link-btn flex-1 py-2.5 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View full menu CTA */}
        <div className="text-center mt-12">
          <Link
            to="/menu"
            className="ff-link-btn inline-block px-6 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
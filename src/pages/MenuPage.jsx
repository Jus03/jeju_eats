import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "burgers", label: "Burgers" },
  { key: "fries", label: "Fries" },
  { key: "sandwiches", label: "Sandwiches" },
  { key: "pasta", label: "Pasta" },
];

function img(text) {
  return `https://placehold.co/600x450/F6F2E9/4B5D3A?text=${encodeURIComponent(
    text
  )}`;
}

function formatPeso(n) {
  return "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 0 });
}

export default function MenuPage() {
  const { addItem, count } = useCart();
  const [active, setActive] = useState("all");
  const [added, setAdded] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("id, slug, name, category, description, price, badge, available")
        .eq("available", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) setError(error.message);
      else setItems(data || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      active === "all" ? items : items.filter((i) => i.category === active),
    [items, active]
  );

  const handleAdd = (item) => {
    // Cart line uses the menu_items.slug so it matches order_items.item_key.
    addItem({
      id: item.slug,
      name: item.name,
      description: item.description,
      price: item.price,
      image: img(item.name),
    });
    setAdded(item.slug);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <section
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="w-full bg-[#F6F2E9] py-12 sm:py-16"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .menu-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(42,46,34,0.10); }
        .menu-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .ff-add-btn:hover { background-color: #4B5D3A; color: #F6F2E9; }
        .ff-tab-active { background-color: #4B5D3A; color: #F6F2E9; }
        .ff-tab:hover:not(.ff-tab-active) { background-color: #EDE8D8; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4B5D3A] mb-3">
            Eat what you love
          </span>
          <h1 className="ff-serif text-[#2A2E22] text-3xl sm:text-4xl leading-tight mb-3">
            Our full menu
          </h1>
          <p className="text-[#5B5A4E] text-sm leading-relaxed">
            Burgers, fries, sandwiches, and pasta — grilled fresh and made to
            order.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`ff-tab px-4 py-2 rounded-full text-sm font-medium border transition ${
                active === cat.key
                  ? "ff-tab-active border-[#4B5D3A]"
                  : "bg-white border-[#DAD5C4] text-[#2A2E22]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="text-center py-16 text-[#8B8A78] text-sm">
            Loading menu…
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto bg-white border border-[#E8B8B0] text-[#B3432B] text-sm rounded-2xl px-5 py-4 text-center">
            Couldn't load the menu: {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-[#8B8A78] text-sm">
            No items in this category yet.
          </div>
        )}

        {/* Items grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="menu-card bg-white rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-[#F6F2E9]">
                  <img
                    src={img(item.name)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-[#F6F2E9] text-[#4B5D3A] text-xs font-semibold px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="ff-serif text-[#2A2E22] text-lg leading-snug">
                      {item.name}
                    </h3>
                    <span className="ff-serif text-[#4B5D3A] text-lg whitespace-nowrap">
                      {formatPeso(item.price)}
                    </span>
                  </div>
                  <p className="text-[#8B8A78] text-sm leading-relaxed mb-4 flex-1">
                    {item.description}
                  </p>

                  <button
                    onClick={() => handleAdd(item)}
                    className="ff-add-btn w-full py-2.5 rounded-lg border border-[#4B5D3A] text-[#4B5D3A] text-sm font-medium transition"
                  >
                    {added === item.slug ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart CTA */}
        {count > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/cart"
              className="ff-add-btn inline-block px-6 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
            >
              View cart ({count})
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";

const DELIVERY_FEE = 49;

function formatPeso(n) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, increment, decrement, removeItem, clear, subtotal, count } =
    useCart();

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  return (
    <section
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="w-full bg-[#F6F2E9] py-12 sm:py-16 min-h-[calc(100vh-4rem)]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .ff-btn:hover { background-color: #3A4A2C; }
        .ff-qty:hover { border-color: #4B5D3A; }
        .ff-remove:hover { color: #B3432B; }
        .ff-link:hover { text-decoration: underline; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="ff-link text-xs font-medium text-[#5B5A4E] hover:text-[#2A2E22]"
          >
            ← Continue shopping
          </Link>
          <h1 className="ff-serif text-[#2A2E22] text-3xl sm:text-4xl leading-tight mt-3">
            Your cart
          </h1>
          <p className="text-[#5B5A4E] text-sm mt-1">
            {count > 0
              ? `${count} item${count > 1 ? "s" : ""} ready to go`
              : "Your cart is currently empty."}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F6F2E9] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 4h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 8H6"
                  stroke="#4B5D3A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1.4" fill="#4B5D3A" />
                <circle cx="17" cy="20" r="1.4" fill="#4B5D3A" />
              </svg>
            </div>
            <h2 className="ff-serif text-[#2A2E22] text-xl mb-2">
              No items in your cart yet
            </h2>
            <p className="text-[#8B8A78] text-sm mb-6 max-w-sm mx-auto">
              Browse our best sellers and add your favorites — they'll show up
              here.
            </p>
            <Link
              to="/menu"
              className="ff-btn inline-block px-6 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="ff-serif text-[#2A2E22] text-lg leading-snug truncate">
                          {item.name}
                        </h3>
                        <p className="text-[#8B8A78] text-xs leading-relaxed mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ff-remove text-[#8B8A78] text-xs font-medium transition shrink-0"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity selector */}
                      <div className="inline-flex items-center border border-[#DAD5C4] rounded-lg overflow-hidden">
                        <button
                          onClick={() => decrement(item.id)}
                          className="ff-qty w-8 h-8 text-[#2A2E22] text-base leading-none transition"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-[#2A2E22]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.id)}
                          className="ff-qty w-8 h-8 text-[#2A2E22] text-base leading-none transition"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#8B8A78]">
                          {formatPeso(item.unitPrice)} each
                        </p>
                        <p className="ff-serif text-[#4B5D3A] text-lg">
                          {formatPeso(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={clear}
                  className="ff-remove text-xs font-medium text-[#8B8A78] transition"
                >
                  Clear cart
                </button>
                <Link
                  to="/menu"
                  className="ff-link text-xs font-medium text-[#4B5D3A] hover:text-[#2A2E22]"
                >
                  Add more items
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-20">
                <h2 className="ff-serif text-[#2A2E22] text-lg mb-4">
                  Order summary
                </h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#5B5A4E]">Subtotal</dt>
                    <dd className="text-[#2A2E22] font-medium">
                      {formatPeso(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#5B5A4E]">Delivery fee</dt>
                    <dd className="text-[#2A2E22] font-medium">
                      {formatPeso(DELIVERY_FEE)}
                    </dd>
                  </div>
                  <div className="border-t border-[#EDE8D8] pt-3 flex justify-between">
                    <dt className="ff-serif text-[#2A2E22] text-base">Total</dt>
                    <dd className="ff-serif text-[#4B5D3A] text-base">
                      {formatPeso(total)}
                    </dd>
                  </div>
                </dl>

                <button
                  onClick={() => navigate("/checkout")}
                  className="ff-btn w-full mt-5 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
                >
                  Proceed to checkout
                </button>
                <p className="text-[#8B8A78] text-xs text-center mt-3">
                  Delivery in ~15 minutes · Fresh off the grill
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

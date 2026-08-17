import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabaseClient";

// ─────────────────────────────────────────────────────────────
// Drop the owner's GCash QR image into the project's `public/`
// folder as `gcash_qr.png` (or .jpg — update GCASH_QR_URL below).
// It'll be served from the site root at /gcash_qr.png.
// If the file doesn't exist yet, the page falls back to a
// friendly placeholder so nothing breaks.
// ─────────────────────────────────────────────────────────────
const GCASH_QR_URL = "/gcash.jpg";

const DELIVERY_FEE = 49;
const GCASH_NAME = "Jeju Eats";
const GCASH_NUMBER = "09328328312"; // ← replace with the real number

function formatPeso(n) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user, profile } = useAuth();

  const [form, setForm] = useState({
    name: profile?.full_name || "",
    phone: "",
    address: "",
    notes: "",
  });
  const [method, setMethod] = useState("cod"); // "cod" | "gcash"
  const [gcashRef, setGcashRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(null); // { orderId, method }
  const [error, setError] = useState("");
  const [qrFailed, setQrFailed] = useState(false);

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);
  const cartEmpty = items.length === 0;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }
    if (method === "gcash" && !gcashRef.trim()) {
      setError("Please enter your GCash reference number after sending payment.");
      return;
    }

    if (!user) {
      setError("Please sign in to place an order.");
      return;
    }

    setSubmitting(true);
    const reference = "JE-" + Date.now().toString().slice(-6);

    // 1) Insert the order row.
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        reference,
        user_id: user.id,
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || null,
        payment_method: method,
        gcash_ref: method === "gcash" ? gcashRef.trim() : null,
        subtotal,
        delivery_fee: DELIVERY_FEE,
        total,
        status: "pending",
      })
      .select("id, reference")
      .single();

    if (orderErr) {
      setSubmitting(false);
      setError("Couldn't place your order: " + orderErr.message);
      return;
    }

    // 2) Insert the order items.
    const rows = items.map((it) => ({
      order_id: order.id,
      item_key: String(it.id),
      name: it.name,
      unit_price: it.unitPrice,
      quantity: it.quantity,
    }));
    const { error: itemsErr } = await supabase.from("order_items").insert(rows);

    if (itemsErr) {
      // Best-effort cleanup so we don't leave an orphan order.
      await supabase.from("orders").delete().eq("id", order.id);
      setSubmitting(false);
      setError("Couldn't save your order items: " + itemsErr.message);
      return;
    }

    clear();
    setSubmitting(false);
    setPlaced({ orderId: order.reference, method });
  };

  // ─── Success screen ─────────────────────────────────────────
  if (placed) {
    return (
      <section
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="w-full bg-[#F6F2E9] min-h-[calc(100vh-4rem)] py-16 flex items-center"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
          .ff-serif { font-family: 'Fraunces', serif; }
          .ff-btn:hover { background-color: #3A4A2C; }
        `}</style>

        <div className="max-w-lg mx-auto px-6 sm:px-8 w-full">
          <div className="bg-white rounded-2xl p-8 sm:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F6F2E9] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4B5D3A" />
                <path
                  d="M8 12.5l2.5 2.5L16 9.5"
                  stroke="#F6F2E9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="ff-serif text-[#2A2E22] text-2xl sm:text-3xl mb-2">
              Order placed!
            </h1>
            <p className="text-[#5B5A4E] text-sm mb-1">
              Your order reference is
            </p>
            <p className="ff-serif text-[#4B5D3A] text-xl mb-5">
              {placed.orderId}
            </p>
            <p className="text-[#8B8A78] text-sm leading-relaxed mb-6">
              {placed.method === "gcash"
                ? "We'll verify your GCash payment shortly and start grilling. You'll get an update via the number you provided."
                : "We'll start grilling right away. Please prepare exact change for the rider — payment on delivery."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/menu"
                className="ff-btn px-6 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
              >
                Order again
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm font-medium"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Empty cart guard ───────────────────────────────────────
  if (cartEmpty) {
    return (
      <section
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="w-full bg-[#F6F2E9] min-h-[calc(100vh-4rem)] py-16 flex items-center"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
          .ff-serif { font-family: 'Fraunces', serif; }
          .ff-btn:hover { background-color: #3A4A2C; }
        `}</style>
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="ff-serif text-[#2A2E22] text-2xl mb-2">
            Nothing to check out
          </h1>
          <p className="text-[#8B8A78] text-sm mb-6">
            Your cart is empty. Add a few burgers first!
          </p>
          <Link
            to="/menu"
            className="ff-btn inline-block px-6 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
          >
            Browse menu
          </Link>
        </div>
      </section>
    );
  }

  // ─── Checkout form ──────────────────────────────────────────
  return (
    <section
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="w-full bg-[#F6F2E9] py-12 sm:py-16 min-h-[calc(100vh-4rem)]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .ff-input:focus { outline: none; border-color: #4B5D3A; box-shadow: 0 0 0 3px rgba(75,93,58,0.15); }
        .ff-btn:hover { background-color: #3A4A2C; }
        .ff-link:hover { text-decoration: underline; }
        .ff-method { transition: border-color 0.15s ease, background-color 0.15s ease; }
        .ff-method:hover:not(.ff-method-active) { border-color: #B8B4A0; }
        .ff-method-active { border-color: #4B5D3A; background-color: #F0EDE0; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="ff-link text-xs font-medium text-[#5B5A4E] hover:text-[#2A2E22]"
          >
            ← Back to cart
          </Link>
          <h1 className="ff-serif text-[#2A2E22] text-3xl sm:text-4xl leading-tight mt-3">
            Checkout
          </h1>
          <p className="text-[#5B5A4E] text-sm mt-1">
            A couple of details and we're grilling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          {/* Left column: delivery + payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery details */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="ff-serif text-[#2A2E22] text-lg mb-4">
                Delivery details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Juan Dela Cruz"
                    className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="09XX XXX XXXX"
                    className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                    Email {user ? "" : "(optional)"}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    placeholder="Not signed in"
                    className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-[#F6F2E9] border border-[#DAD5C4] text-[#5B5A4E] text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                    Delivery address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={set("address")}
                    rows={2}
                    placeholder="Street, barangay, city, landmark"
                    className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                    Order notes <span className="text-[#8B8A78] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="e.g. no onions, ring the doorbell"
                    className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="ff-serif text-[#2A2E22] text-lg mb-4">
                Payment method
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* COD */}
                <label
                  className={`ff-method cursor-pointer rounded-xl border-2 p-4 flex items-start gap-3 ${
                    method === "cod"
                      ? "ff-method-active"
                      : "border-[#DAD5C4] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="cod"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                    className="mt-1 accent-[#4B5D3A]"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="6" width="20" height="13" rx="2" stroke="#4B5D3A" strokeWidth="1.6" />
                        <circle cx="12" cy="12.5" r="2.5" stroke="#4B5D3A" strokeWidth="1.6" />
                      </svg>
                      <span className="ff-serif text-[#2A2E22] text-base">
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="text-[#8B8A78] text-xs leading-relaxed">
                      Pay the rider in cash when your order arrives. Please prepare exact change.
                    </p>
                  </div>
                </label>

                {/* GCash */}
                <label
                  className={`ff-method cursor-pointer rounded-xl border-2 p-4 flex items-start gap-3 ${
                    method === "gcash"
                      ? "ff-method-active"
                      : "border-[#DAD5C4] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="gcash"
                    checked={method === "gcash"}
                    onChange={() => setMethod("gcash")}
                    className="mt-1 accent-[#4B5D3A]"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#4B5D3A" strokeWidth="1.6" />
                        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#4B5D3A" strokeWidth="1.6" />
                        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#4B5D3A" strokeWidth="1.6" />
                        <path d="M14 14h3v3h-3zM18 14h3M14 18v3M18 18h3v3h-3z" stroke="#4B5D3A" strokeWidth="1.6" />
                      </svg>
                      <span className="ff-serif text-[#2A2E22] text-base">
                        GCash
                      </span>
                    </div>
                    <p className="text-[#8B8A78] text-xs leading-relaxed">
                      Scan the QR code and send payment. Enter your reference number below.
                    </p>
                  </div>
                </label>
              </div>

              {/* GCash QR + reference */}
              {method === "gcash" && (
                <div className="mt-5 rounded-xl bg-[#F6F2E9] p-5 sm:p-6">
                  <div className="grid sm:grid-cols-[220px_1fr] gap-5 items-start">
                    <div className="bg-white rounded-xl p-3 flex items-center justify-center aspect-square">
                      {qrFailed ? (
                        <div className="text-center px-3">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-[#F6F2E9] flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="7" height="7" rx="1" stroke="#4B5D3A" strokeWidth="1.6" />
                              <rect x="14" y="3" width="7" height="7" rx="1" stroke="#4B5D3A" strokeWidth="1.6" />
                              <rect x="3" y="14" width="7" height="7" rx="1" stroke="#4B5D3A" strokeWidth="1.6" />
                            </svg>
                          </div>
                          <p className="ff-serif text-[#2A2E22] text-sm mb-1">
                            QR code goes here
                          </p>
                          <p className="text-[#8B8A78] text-xs leading-snug">
                            Save the owner's GCash QR as{" "}
                            <code className="text-[#4B5D3A]">
                              public/gcash_qr.png
                            </code>
                          </p>
                        </div>
                      ) : (
                        <img
                          src={GCASH_QR_URL}
                          alt="GCash payment QR code"
                          onError={() => setQrFailed(true)}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    <div>
                      <p className="ff-serif text-[#2A2E22] text-base mb-3">
                        Pay {formatPeso(total)} via GCash
                      </p>
                      <ol className="text-[#5B5A4E] text-sm space-y-1.5 mb-4 list-decimal list-inside">
                        <li>Open GCash → Scan QR (or tap Send Money).</li>
                        <li>
                          Send to{" "}
                          <span className="font-medium text-[#2A2E22]">
                            {GCASH_NAME}
                          </span>{" "}
                          ({GCASH_NUMBER}).
                        </li>
                        <li>
                          Enter the exact amount:{" "}
                          <span className="font-medium text-[#2A2E22]">
                            {formatPeso(total)}
                          </span>
                          .
                        </li>
                        <li>Copy the reference number and paste it below.</li>
                      </ol>

                      <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                        GCash reference number
                      </label>
                      <input
                        type="text"
                        value={gcashRef}
                        onChange={(e) => setGcashRef(e.target.value)}
                        placeholder="e.g. 1234567890123"
                        className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p
                className="bg-white border border-[#E8B8B0] text-[#B3432B] text-sm rounded-lg px-4 py-3"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          {/* Right column: order summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-20">
              <h2 className="ff-serif text-[#2A2E22] text-lg mb-4">
                Order summary
              </h2>

              <ul className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F6F2E9] shrink-0">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#2A2E22] text-sm font-medium truncate">
                        {it.name}
                      </p>
                      <p className="text-[#8B8A78] text-xs">
                        {it.quantity} × {formatPeso(it.unitPrice)}
                      </p>
                    </div>
                    <p className="text-[#2A2E22] text-sm font-medium whitespace-nowrap">
                      {formatPeso(it.unitPrice * it.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-3 text-sm border-t border-[#EDE8D8] pt-4">
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
                type="submit"
                disabled={submitting}
                className="ff-btn w-full mt-5 py-3 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition disabled:opacity-70"
              >
                {submitting
                  ? "Placing order…"
                  : method === "gcash"
                  ? "Confirm GCash payment"
                  : "Place order (COD)"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="w-full mt-2 py-2.5 text-[#5B5A4E] text-xs font-medium hover:text-[#2A2E22]"
              >
                Edit cart
              </button>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

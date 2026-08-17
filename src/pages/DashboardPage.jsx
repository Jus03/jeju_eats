import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = ["burgers", "fries", "sandwiches", "pasta"];

// Turn a name into a URL-safe slug used as the stable menu_items.slug.
function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatPeso(n) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });
}

// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [section, setSection] = useState("overview"); // "overview" | "menu"

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="min-h-screen w-full flex bg-[#F6F2E9]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .nav-btn { transition: background-color 0.15s ease, color 0.15s ease; }
        .nav-btn:hover:not(.nav-btn-active) { background-color: #3A4A2C; color: #F6F2E9; }
        .nav-btn-active { background-color: #F6F2E9; color: #2A2E22; }
        .ff-btn:hover { background-color: #3A4A2C; }
        .ff-btn-danger:hover { background-color: #F1D6CF; }
        .ff-input:focus { outline: none; border-color: #4B5D3A; box-shadow: 0 0 0 3px rgba(75,93,58,0.15); }
        .ff-signout:hover { color: #E8B8B0; }
      `}</style>

      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex md:w-60 lg:w-64 bg-[#2A2E22] text-[#EDE8D8] flex-col">
        <div className="px-6 py-6 flex items-center gap-2 border-b border-white/10">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 10C5 6.8 8.1 4.5 12 4.5C15.9 4.5 19 6.8 19 10H5Z" fill="#F6F2E9" />
            <rect x="5" y="11" width="14" height="2" rx="1" fill="#F6F2E9" />
            <path d="M5 15H19V17C19 18.1 18.1 19 17 19H7C5.9 19 5 18.1 5 17V15Z" fill="#F6F2E9" />
          </svg>
          <span className="ff-serif text-[#F6F2E9] text-lg tracking-wide">
            Jeju eats
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarButton
            active={section === "overview"}
            onClick={() => setSection("overview")}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="13" y="3" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="3" y="15" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="13" y="11" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            }
            label="Overview"
          />
          <SidebarButton
            active={section === "menu"}
            onClick={() => setSection("menu")}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
            label="Menu management"
          />
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#4B5D3A] text-[#F6F2E9] flex items-center justify-center text-xs font-semibold">
              {(profile?.full_name || profile?.email || "A")
                .charAt(0)
                .toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-[#F6F2E9] truncate">
                {profile?.full_name || "Admin"}
              </p>
              <p className="text-xs text-[#B8B4A0] truncate">
                {profile?.role || "admin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="ff-signout w-full text-left px-3 py-2 mt-1 text-sm text-[#EDE8D8] transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-[#EDE8D8] px-6 sm:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="ff-serif text-[#2A2E22] text-xl">
              {section === "overview" ? "Overview" : "Menu management"}
            </h1>
            <p className="text-[#8B8A78] text-xs">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Mobile section switcher (sidebar is hidden on small screens) */}
          <div className="md:hidden flex gap-2">
            <button
              onClick={() => setSection("overview")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                section === "overview"
                  ? "bg-[#4B5D3A] text-[#F6F2E9]"
                  : "bg-[#F6F2E9] text-[#2A2E22]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSection("menu")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                section === "menu"
                  ? "bg-[#4B5D3A] text-[#F6F2E9]"
                  : "bg-[#F6F2E9] text-[#2A2E22]"
              }`}
            >
              Menu
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {section === "overview" ? <OverviewSection /> : <MenuSection />}
        </div>
      </main>
    </div>
  );
}

// ─── Sidebar button ─────────────────────────────────────────
function SidebarButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
        active ? "nav-btn-active" : "text-[#EDE8D8]"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─── Overview section ───────────────────────────────────────
// Returns [start, end) window for the given day offset from today (in local time).
// dayOffset = 0 → today; -1 → yesterday.
function dayWindow(dayOffset) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + dayOffset);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

// Percent change from `prev` to `curr`. Handles the 0-baseline edge case.
function pctDelta(curr, prev) {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
}

function OverviewSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    revenueToday: 0,
    ordersToday: 0,
    avgOrderValue: 0,
    activeCustomers: 0,
    revenueDelta: 0,
    ordersDelta: 0,
    aovDelta: 0,
  });
  const [last7Days, setLast7Days] = useState([]);
  const [topItems, setTopItems] = useState([]); // [{ name, revenue, quantity }]

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      const today = dayWindow(0);
      const yesterday = dayWindow(-1);
      const weekStart = dayWindow(-6).start; // 7 days including today

      // Fire the queries in parallel.
      const [todayRes, yestRes, weekRes, customersRes, itemsRes] =
        await Promise.all([
          supabase
            .from("orders")
            .select("total", { count: "exact" })
            .gte("created_at", today.start.toISOString())
            .lt("created_at", today.end.toISOString()),
          supabase
            .from("orders")
            .select("total", { count: "exact" })
            .gte("created_at", yesterday.start.toISOString())
            .lt("created_at", yesterday.end.toISOString()),
          supabase
            .from("orders")
            .select("total, created_at")
            .gte("created_at", weekStart.toISOString()),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "customer"),
          // Line items from orders in the last 7 days. `orders!inner(...)`
          // both filters on the parent and gives us created_at for grouping.
          supabase
            .from("order_items")
            .select(
              "name, item_key, quantity, line_total, orders!inner(created_at)"
            )
            .gte("orders.created_at", weekStart.toISOString()),
        ]);

      if (cancelled) return;

      const firstError =
        todayRes.error ||
        yestRes.error ||
        weekRes.error ||
        customersRes.error ||
        itemsRes.error;
      if (firstError) {
        setError(firstError.message);
        setLoading(false);
        return;
      }

      const sum = (rows) =>
        (rows || []).reduce((s, r) => s + Number(r.total || 0), 0);

      const revenueToday = sum(todayRes.data);
      const ordersToday = todayRes.count ?? (todayRes.data?.length || 0);
      const revenueYest = sum(yestRes.data);
      const ordersYest = yestRes.count ?? (yestRes.data?.length || 0);
      const aovToday = ordersToday ? revenueToday / ordersToday : 0;
      const aovYest = ordersYest ? revenueYest / ordersYest : 0;

      // Bucket the past 7 days by local date.
      const buckets = [];
      for (let i = 6; i >= 0; i--) {
        const { start } = dayWindow(-i);
        buckets.push({
          key: start.toDateString(),
          day: start.toLocaleDateString("en-PH", { weekday: "short" }),
          revenue: 0,
        });
      }
      const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
      for (const row of weekRes.data || []) {
        const d = new Date(row.created_at);
        d.setHours(0, 0, 0, 0);
        const b = byKey[d.toDateString()];
        if (b) b.revenue += Number(row.total || 0);
      }

      // Group line items by item_key to get top sellers by revenue.
      const byItem = new Map();
      for (const row of itemsRes.data || []) {
        const key = row.item_key || row.name;
        const bucket = byItem.get(key) || {
          key,
          name: row.name,
          revenue: 0,
          quantity: 0,
        };
        bucket.revenue += Number(row.line_total || 0);
        bucket.quantity += Number(row.quantity || 0);
        byItem.set(key, bucket);
      }
      const top = Array.from(byItem.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setStats({
        revenueToday,
        ordersToday,
        avgOrderValue: aovToday,
        activeCustomers: customersRes.count ?? 0,
        revenueDelta: pctDelta(revenueToday, revenueYest),
        ordersDelta: pctDelta(ordersToday, ordersYest),
        aovDelta: pctDelta(aovToday, aovYest),
      });
      setLast7Days(buckets);
      setTopItems(top);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-[#8B8A78] text-sm">
        Loading live data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#E8B8B0] text-[#B3432B] text-sm rounded-2xl px-5 py-4">
        Couldn't load dashboard data: {error}
      </div>
    );
  }

  const cards = [
    {
      label: "Revenue today",
      value: formatPeso(stats.revenueToday),
      delta: stats.revenueDelta,
      showDelta: true,
    },
    {
      label: "Orders today",
      value: stats.ordersToday.toString(),
      delta: stats.ordersDelta,
      showDelta: true,
    },
    {
      label: "Avg order value",
      value: formatPeso(Math.round(stats.avgOrderValue)),
      delta: stats.aovDelta,
      showDelta: true,
    },
    {
      label: "Registered customers",
      value: stats.activeCustomers.toString(),
      showDelta: false,
    },
  ];

  const weekTotal = last7Days.reduce((s, d) => s + d.revenue, 0);
  const maxRevenue = Math.max(1, ...last7Days.map((d) => d.revenue));

  return (
    <>
      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const positive = (card.delta ?? 0) >= 0;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5">
              <p className="text-[#8B8A78] text-xs font-medium uppercase tracking-wide">
                {card.label}
              </p>
              <p className="ff-serif text-[#2A2E22] text-2xl sm:text-3xl mt-2">
                {card.value}
              </p>
              {card.showDelta && (
                <p
                  className={`text-xs font-medium mt-2 ${
                    positive ? "text-[#4B5D3A]" : "text-[#B3432B]"
                  }`}
                >
                  {positive ? "▲" : "▼"} {Math.abs(card.delta).toFixed(1)}% vs.
                  yesterday
                </p>
              )}
              {!card.showDelta && (
                <p className="text-xs font-medium mt-2 text-[#8B8A78]">
                  Total on record
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue chart (last 7 days) */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="ff-serif text-[#2A2E22] text-lg">Revenue</h2>
            <p className="text-[#8B8A78] text-xs">Last 7 days</p>
          </div>
          <p className="ff-serif text-[#4B5D3A] text-xl">
            {formatPeso(weekTotal)}
          </p>
        </div>

        {weekTotal === 0 ? (
          <div className="h-48 flex items-center justify-center text-center text-[#8B8A78] text-sm">
            No orders in the last 7 days yet.
            <br />
            Once customers check out, they'll show up here.
          </div>
        ) : (
          <div className="flex items-end gap-3 h-48">
            {last7Days.map((d) => {
              const heightPct = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div
                  key={d.key}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-lg bg-[#4B5D3A]"
                      style={{ height: `${heightPct}%` }}
                      title={formatPeso(d.revenue)}
                    />
                  </div>
                  <span className="text-[#8B8A78] text-xs">{d.day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Revenue by menu item (last 7 days) */}
      <div className="bg-white rounded-2xl p-6 mt-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="ff-serif text-[#2A2E22] text-lg">
              Revenue by menu item
            </h2>
            <p className="text-[#8B8A78] text-xs">
              Top sellers · Last 7 days
            </p>
          </div>
        </div>

        {topItems.length === 0 ? (
          <div className="text-center text-[#8B8A78] text-sm py-8">
            No items sold in the last 7 days.
          </div>
        ) : (
          (() => {
            const maxItem = Math.max(...topItems.map((i) => i.revenue));
            return (
              <ul className="space-y-3">
                {topItems.map((item, idx) => {
                  const pct = Math.round((item.revenue / maxItem) * 100);
                  return (
                    <li key={item.key}>
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-[#2A2E22] text-sm font-medium">
                          <span className="text-[#8B8A78] text-xs mr-2">
                            #{idx + 1}
                          </span>
                          {item.name}
                        </p>
                        <p className="text-[#4B5D3A] text-sm font-medium whitespace-nowrap">
                          {formatPeso(item.revenue)}
                          <span className="text-[#8B8A78] text-xs font-normal ml-2">
                            · {item.quantity} sold
                          </span>
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-[#F6F2E9] overflow-hidden">
                        <div
                          className="h-full bg-[#4B5D3A]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          })()
        )}
      </div>
    </>
  );
}

// ─── Menu management section ────────────────────────────────
function MenuSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // item being edited (or "new")

  // Initial load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("id, slug, name, category, description, price, badge, available, sort_order")
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

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const okCat = filter === "all" || item.category === filter;
      const okSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.trim().toLowerCase());
      return okCat && okSearch;
    });
  }, [items, filter, search]);

  const toggleAvailability = async (item) => {
    // Optimistic update.
    setItems((m) =>
      m.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
    );
    const { error } = await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    if (error) {
      // Roll back on failure.
      setItems((m) =>
        m.map((i) => (i.id === item.id ? { ...i, available: item.available } : i))
      );
      setError(error.message);
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from the menu?`)) return;
    setBusy(true);
    const prev = items;
    setItems((m) => m.filter((i) => i.id !== item.id));
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", item.id);
    setBusy(false);
    if (error) {
      setItems(prev); // roll back
      setError(error.message);
    }
  };

  const saveItem = async (draft) => {
    setBusy(true);
    setError("");
    if (draft.id) {
      // Update existing.
      const { data, error } = await supabase
        .from("menu_items")
        .update({
          name: draft.name.trim(),
          category: draft.category,
          description: draft.description?.trim() || "",
          price: draft.price,
          badge: draft.badge?.trim() || null,
          available: draft.available,
        })
        .eq("id", draft.id)
        .select()
        .single();
      setBusy(false);
      if (error) {
        setError(error.message);
        return;
      }
      setItems((m) => m.map((i) => (i.id === draft.id ? data : i)));
    } else {
      // Insert new. Auto-generate a slug from the name; append a suffix
      // if it collides with an existing one.
      const base = toSlug(draft.name);
      let slug = base || "item";
      const used = new Set(items.map((i) => i.slug));
      let n = 2;
      while (used.has(slug)) slug = `${base}-${n++}`;

      const maxSort = items.reduce(
        (m, i) => (i.sort_order > m ? i.sort_order : m),
        0
      );

      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          slug,
          name: draft.name.trim(),
          category: draft.category,
          description: draft.description?.trim() || "",
          price: draft.price,
          badge: draft.badge?.trim() || null,
          available: draft.available,
          sort_order: maxSort + 10,
        })
        .select()
        .single();
      setBusy(false);
      if (error) {
        setError(error.message);
        return;
      }
      setItems((m) => [...m, data]);
    }
    setEditing(null);
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-[#8B8A78] text-sm">
        Loading menu…
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ff-input px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm capitalize"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setEditing({
              id: null,
              name: "",
              category: "burgers",
              description: "",
              price: 0,
              badge: "",
              available: true,
            })
          }
          disabled={busy}
          className="ff-btn px-5 py-2.5 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition disabled:opacity-60"
        >
          + Add item
        </button>
      </div>

      {error && (
        <div className="bg-white border border-[#E8B8B0] text-[#B3432B] text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F2E9] text-[#5B5A4E] text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Item</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-[#8B8A78] text-sm"
                  >
                    No items match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#EDE8D8] hover:bg-[#FAF8F1]"
                  >
                    <td className="px-5 py-3 text-[#2A2E22] font-medium">
                      {item.name}
                    </td>
                    <td className="px-5 py-3 text-[#5B5A4E] capitalize">
                      {item.category}
                    </td>
                    <td className="px-5 py-3 text-[#2A2E22]">
                      {formatPeso(item.price)}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          item.available
                            ? "bg-[#E6EDD9] text-[#4B5D3A]"
                            : "bg-[#F1D6CF] text-[#B3432B]"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditing(item)}
                        className="text-[#4B5D3A] text-xs font-medium hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeItem(item)}
                        className="text-[#B3432B] text-xs font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditItemModal
          item={editing}
          onCancel={() => setEditing(null)}
          onSave={saveItem}
        />
      )}
    </>
  );
}

// ─── Add/Edit modal ─────────────────────────────────────────
function EditItemModal({ item, onCancel, onSave }) {
  const [draft, setDraft] = useState({
    id: item.id ?? null,
    name: item.name ?? "",
    category: item.category ?? "burgers",
    description: item.description ?? "",
    price: item.price ?? 0,
    badge: item.badge ?? "",
    available: item.available ?? true,
  });
  const [saving, setSaving] = useState(false);
  const isNew = !item.id;

  const set = (k) => (e) => {
    const v = k === "price" ? Number(e.target.value) : e.target.value;
    setDraft((d) => ({ ...d, [k]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    if (draft.price < 0) return;
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="ff-serif text-[#2A2E22] text-xl mb-4">
          {isNew ? "Add new item" : "Edit item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={set("name")}
              placeholder="e.g. The Jeju Classic"
              className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
              Description
            </label>
            <textarea
              value={draft.description}
              onChange={set("description")}
              rows={2}
              placeholder="Short description shown on the menu"
              className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                Category
              </label>
              <select
                value={draft.category}
                onChange={set("category")}
                className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                Price (₱)
              </label>
              <input
                type="number"
                min="0"
                value={draft.price}
                onChange={set("price")}
                className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#2A2E22] text-sm font-medium mb-1.5">
              Badge <span className="text-[#8B8A78] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={draft.badge}
              onChange={set("badge")}
              placeholder="e.g. Best Seller, Spicy, Vegetarian"
              className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={draft.available}
              onChange={(e) =>
                setDraft((d) => ({ ...d, available: e.target.checked }))
              }
              className="w-4 h-4 rounded border-[#DAD5C4] accent-[#4B5D3A]"
            />
            <span className="text-sm text-[#2A2E22]">Available for ordering</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm font-medium disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="ff-btn flex-1 py-2.5 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition disabled:opacity-70"
            >
              {saving ? "Saving…" : isNew ? "Add item" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

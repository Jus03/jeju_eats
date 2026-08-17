import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/", hash: "home" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/", hash: "about" },
  { label: "Contact", to: "/", hash: "contact" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isStaffOrAdmin = role === "admin" || role === "staff";

  const handleSignOut = async () => {
    setAccountOpen(false);
    await signOut();
    navigate("/login");
  };

  // Scroll to a homepage section. If we're already on "/", just scroll;
  // otherwise navigate to "/" first, then scroll after the route renders.
  // "home" scrolls to the very top of the page.
  const goToSection = (hash) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const doScroll = () => {
      if (hash === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname === "/") {
      doScroll();
    } else {
      navigate("/");
      // Wait for HomePage to mount, then scroll.
      setTimeout(doScroll, 50);
    }
  };

  return (
    <header
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="sticky top-0 z-50 w-full bg-[#F6F2E9]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .nav-link:hover { color: #2A2E22; }
        .ff-btn:hover { background-color: #3A4A2C; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 10C5 6.8 8.1 4.5 12 4.5C15.9 4.5 19 6.8 19 10H5Z" fill="#4B5D3A" />
            <rect x="5" y="11" width="14" height="2" rx="1" fill="#4B5D3A" />
            <path
              d="M5 13.5C6 12.8 7 14.2 8 13.5C9 12.8 10 14.2 11 13.5C12 12.8 13 14.2 14 13.5C15 12.8 16 14.2 17 13.5C18 12.8 19 14.2 19 13.5"
              stroke="#4B5D3A"
              strokeWidth="1.2"
            />
            <path d="M5 15H19V17C19 18.1 18.1 19 17 19H7C5.9 19 5 18.1 5 17V15Z" fill="#4B5D3A" />
          </svg>
          <span className="ff-serif text-[#2A2E22] text-lg tracking-wide">Jeju eats</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.hash ? `/#${link.hash}` : link.to}
              onClick={link.hash ? goToSection(link.hash) : undefined}
              className="nav-link text-sm font-medium text-[#5B5A4E] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: auth area */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              {isStaffOrAdmin ? (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-[#2A2E22]"
                >
                  Dashboard
                </Link>
              ) : (
                <Link to="/cart" className="relative text-[#2A2E22]" aria-label="Cart">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 4h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 8H6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                    <circle cx="17" cy="20" r="1.4" fill="currentColor" />
                  </svg>
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm font-medium text-[#2A2E22]"
                >
                  <span className="w-8 h-8 rounded-full bg-[#4B5D3A] text-[#F6F2E9] flex items-center justify-center text-xs font-semibold">
                    {(profile?.full_name || profile?.email || "?").charAt(0).toUpperCase()}
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg py-1">
                    <Link
                      to="/profile"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-[#2A2E22] hover:bg-[#F6F2E9]"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-[#B3432B] hover:bg-[#F6F2E9]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[#2A2E22]">
                Sign in
              </Link>
              <Link
                to="/register"
                className="ff-btn px-4 py-2 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
              >
                Order now
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden text-[#2A2E22]"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden bg-[#F6F2E9] px-6 py-4">
          <nav className="flex flex-col gap-4 mb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.hash ? `/#${link.hash}` : link.to}
                onClick={
                  link.hash ? goToSection(link.hash) : () => setMenuOpen(false)
                }
                className="text-sm font-medium text-[#2A2E22]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                {isStaffOrAdmin ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2A2E22]"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#2A2E22]"
                  >
                    Cart
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-[#2A2E22]"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-left text-sm font-medium text-[#B3432B]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-[#2A2E22]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="ff-btn text-center px-4 py-2 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition"
                >
                  Order now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
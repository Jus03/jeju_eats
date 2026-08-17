import React, { useState } from "react";
import homelogo from "../assets/images/login_img.jpg";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    const { data, error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message === "Invalid login credentials"
        ? "That email or password doesn't match our records."
        : signInError.message);
      return;
    }

    // Look up the role right away so we can route immediately
    // (AuthContext also picks this up in the background).
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
      console.log("fetched profile:", profile); // ← add this line

if (profile?.role === "admin") {
  navigate("/dashboard");
} else {
  navigate("/");
}
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen w-full flex bg-[#F6F2E9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .ff-input:focus { outline: none; border-color: #4B5D3A; box-shadow: 0 0 0 3px rgba(75,93,58,0.15); }
        .ff-btn:hover { background-color: #3A4A2C; }
        .ff-link:hover { text-decoration: underline; }
      `}</style>

      {/* Left: image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={homelogo}
          alt="Ferns in a misty forest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(20,26,14,0.15) 0%, rgba(20,26,14,0.65) 100%)" }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 10C5 6.8 8.1 4.5 12 4.5C15.9 4.5 19 6.8 19 10H5Z" fill="#F6F2E9" />
              <rect x="5" y="11" width="14" height="2" rx="1" fill="#F6F2E9" />
              <path
                d="M5 13.5C6 12.8 7 14.2 8 13.5C9 12.8 10 14.2 11 13.5C12 12.8 13 14.2 14 13.5C15 12.8 16 14.2 17 13.5C18 12.8 19 14.2 19 13.5"
                stroke="#F6F2E9"
                strokeWidth="1.2"
              />
              <path d="M5 15H19V17C19 18.1 18.1 19 17 19H7C5.9 19 5 18.1 5 17V15Z" fill="#F6F2E9" />
            </svg>
            <span className="ff-serif text-[#F6F2E9] text-xl tracking-wide">Jeju eats</span>
          </div>

          <div className="max-w-sm">
            <p className="ff-serif text-[#F6F2E9] text-3xl leading-snug mb-3">
              Freshly grilled burgers made with premium ingredients.
            </p>
            <p className="text-[#EDE8D8] text-sm leading-relaxed opacity-90">
              Sign in to manage orders, track sales, and serve every customer with the taste they love.
            </p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
              <path d="M13 2C13 2 5 8 5 15a8 8 0 0016 0c0-7-8-13-8-13z" stroke="#2A2E22" strokeWidth="1.4" />
              <path d="M13 6v16" stroke="#2A2E22" strokeWidth="1.4" />
            </svg>
            <span className="ff-serif text-[#2A2E22] text-lg">Jeju eats</span>
          </div>

          <h1 className="ff-serif text-[#2A2E22] text-[2rem] leading-tight mb-2">Welcome back</h1>
          <p className="text-[#8B8A78] text-sm mb-8">Fresh burgers. Fast service. Happy customers.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="email" className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                autoComplete="email"
              />
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[#2A2E22] text-sm font-medium">
                  Password
                </label>
                <a href="#" className="ff-link text-xs text-[#4B5D3A] font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ff-input w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8A78] text-xs font-medium"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[#B3432B] text-xs mt-2 mb-1" role="alert">
                {error}
              </p>
            )}

            <label className="flex items-center gap-2 mt-5 mb-7 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-[#DAD5C4] accent-[#4B5D3A]"
              />
              <span className="text-sm text-[#5B5A4E]">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="ff-btn w-full py-2.5 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B8A78] mt-8">
            New to Jeju eats?{" "}
            <Link to="/register" className="ff-link text-[#4B5D3A] font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
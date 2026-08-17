import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import homelogo from "../assets/images/login_img.jpg";
import { useAuth } from "../lib/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Fill in every field to create your account.");
      return;
    }
    if (password.length < 6) {
      setError("Password needs to be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await signUp(email, password);
    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "An account with that email already exists."
          : signUpError.message
      );
      return;
    }

    // Email confirmation is currently off in Supabase, so signUp()
    // returns an active session immediately — go straight in.
    navigate("/login");
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
              Join the crew behind every fresh, made-to-order burger.
            </p>
            <p className="text-[#EDE8D8] text-sm leading-relaxed opacity-90">
              Create an account to place orders, save your favorites, and track what's cooking.
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

          <h1 className="ff-serif text-[#2A2E22] text-[2rem] leading-tight mb-2">Create your account</h1>
          <p className="text-[#8B8A78] text-sm mb-8">It only takes a minute to get started.</p>

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

            <div className="mb-5">
              <label htmlFor="password" className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="ff-input w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                  autoComplete="new-password"
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

            <div className="mb-2">
              <label htmlFor="confirmPassword" className="block text-[#2A2E22] text-sm font-medium mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="ff-input w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DAD5C4] text-[#2A2E22] text-sm placeholder-[#B3B0A0] transition"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-[#B3432B] text-xs mt-2 mb-1" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ff-btn w-full py-2.5 rounded-lg bg-[#4B5D3A] text-[#F6F2E9] text-sm font-medium transition disabled:opacity-70 mt-5"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B8A78] mt-8">
            Already have an account?{" "}
            <Link to="/login" className="ff-link text-[#4B5D3A] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
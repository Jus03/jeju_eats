import React from "react";
import img from "../assets/images/i2.jpg";
const CONTACT_LINKS = [
      {
    label: "Facebook",
    href: "https://www.facebook.com/jeju.est2020",
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 8.5h2V5h-2c-2.2 0-4 1.8-4 4v2H9v3.5h2V19h3.5v-4.5H17l.5-3.5h-3V9c0-.6.4-1 1-1z"
          stroke="#2A2E22"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "/jejueats",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="#2A2E22" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="#2A2E22" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="#2A2E22" />
      </svg>
    ),
    value: "@jeju_eats_",
  },
  {
    label: "Email",
    href: "mailto:jejuest.2020@gmail.com",
    external: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 6l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
          stroke="#2A2E22"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "jejuest.2020@gmail.com",
  },
  {
    label: "Phone",
    href: "tel:+63 995 954 0799",
    external: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.4-1.4a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.8 2.2z"
          stroke="#2A2E22"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "+63 995 954 0799",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="relative w-full min-h-[560px] flex items-center overflow-hidden scroll-mt-16"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ff-serif { font-family: 'Fraunces', serif; }
        .contact-card {
          backdrop-filter: blur(6px);
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .contact-card:hover {
          transform: translateY(-3px);
          background-color: #FFFFFF;
        }
      `}</style>

      {/* Background image */}
      <img
        src={img}
        alt="Jeju Eats restaurant interior"
        className="absolute inset-0 w-full h-full object-bottom object-fill"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,26,14,0.35) 0%, rgba(20,26,14,0.75) 100%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center w-full">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#EDE8D8] mb-4">
          Get in touch
        </span>
        <h2 className="ff-serif text-[#F6F2E9] text-3xl sm:text-5xl leading-tight mb-4">
          Let's talk burgers.
        </h2>
        <p className="text-[#EDE8D8] text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-12 opacity-90">
          Questions, delivery inquiries, or just want to say hi — reach us wherever's easiest for you.
        </p>

        {/* Contact links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {CONTACT_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="contact-card flex items-center gap-3 bg-white/90 rounded-2xl px-6 py-4 w-full sm:w-auto"
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-left">
                <span className="block text-[#8B8A78] text-xs">{item.label}</span>
                <span className="block text-[#2A2E22] text-sm font-medium">{item.value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
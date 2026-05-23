"use client";

import { useTheme } from "@/components/ThemeContext";

export default function ThemeToggle() {
  const { mood, toggle } = useTheme();
  const isNight = mood > 0.5;

  return (
    <button
      onClick={toggle}
      className="
        relative w-16 h-9 rounded-full
        bg-white/10 backdrop-blur-md
        flex items-center px-1
        transition-colors duration-300
      "
    >
      {/* 🌟 background glow */}
      <div
        className={`
          absolute inset-0 rounded-full transition-opacity duration-300
          ${isNight ? "bg-blue-400/30 opacity-40" : "bg-yellow-300/30 opacity-30"}
        `}
      />

      {/* ☀️ SUN ICON (always visible) */}
      <div
        className="
          absolute left-2 z-20 text-lg transition-opacity duration-300
        "
        style={{
          color: "#fde047",
          opacity: isNight ? 0.35 : 1,
          filter: isNight ? "drop-shadow(0 0 6px rgba(147,197,253,0.6))" : "none",
        }}
      >
        🌞
      </div>

      {/* 🌙 MOON ICON (always visible) */}
      <div
        className="
          absolute right-2 z-20 text-lg transition-opacity duration-300
        "
        style={{
          color: "#93c5fd",
          opacity: isNight ? 1 : 0.35,
        }}
      >
        🌛
      </div>

      {/* 🔘 slider */}
      <div
        className="
          relative z-30 w-7 h-7 rounded-full
          bg-white shadow-md
          transition-transform duration-300 ease-in-out
        "
        style={{
          transform: isNight ? "translateX(28px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}
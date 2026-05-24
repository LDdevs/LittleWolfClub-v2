"use client";

import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-30 flex justify-between items-center px-6 py-4">

      <div className="font-bold tracking-wide">
        🐺 Little Wolf Pack
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button className="
          px-4 py-2 rounded-full
          bg-green-400 text-black font-semibold
          hover:shadow-[0_0_25px_rgba(255,255,160,0.6)]
          transition
        ">
          Join Pack
        </button>
      </div>

    </header>
  );
}
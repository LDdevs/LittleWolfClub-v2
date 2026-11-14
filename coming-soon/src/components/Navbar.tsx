"use client";

import Link from "next/link";
import { useState } from "react";
import { useBasket } from "@/components/BasketContext";
import { useTheme } from "@/components/ThemeContext";

export default function Navbar() {
  const { basketCount } = useBasket();
  const { effectsEnabled, toggleEffects } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const shopLink = `
        rounded-full border border-white/10 bg-white/5
        px-4 py-2 text-sm font-semibold text-white
        backdrop-blur-md transition-all duration-300
        hover:border-green-400/40 hover:bg-green-400/10
        hover:text-green-300
    `;

  const effectsLabel = effectsEnabled
    ? "Turn off animations and ambience"
    : "Turn on animations and ambience";

  return (
    <header className="
            fixed top-0 left-0 w-full z-30
            border-b border-white/10
            bg-neutral-950/85 backdrop-blur-xl
            px-4 py-3 sm:px-6 sm:py-4
        ">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-bold tracking-wide text-base sm:text-lg whitespace-nowrap"
        >
          🐺 Little Wolf Pack
        </Link>

        <nav className="hidden sm:flex items-center gap-3">
          <Link href="/scouts-corner" className={shopLink}>
            🌲 Scout&apos;s Corner
          </Link>
          <Link href="/shop" className={shopLink}>
            Shop
          </Link>
          <Link href="/basket" className={shopLink}>
            Basket ({basketCount})
          </Link>

          <button
            type="button"
            onClick={toggleEffects}
            aria-label={effectsLabel}
            aria-pressed={effectsEnabled}
            title={effectsLabel}
            className={`${shopLink} ${effectsEnabled ? "text-amber-200" : "text-neutral-300"}`}
          >
            {effectsEnabled ? "✨ Effects on" : "🌙 Effects off"}
          </button>

          <button
            type="button"
            onClick={() => { window.location.href = "/?join=1"; }}
            className="
              px-4 py-2 rounded-full
              bg-green-400 text-black text-sm font-semibold
              hover:shadow-[0_0_25px_rgba(255,255,160,0.4)]
              transition
            "
          >
            Join Pack
          </button>
        </nav>

        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleEffects}
            aria-label={effectsLabel}
            aria-pressed={effectsEnabled}
            title={effectsLabel}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            {effectsEnabled ? "✨" : "🌙"}
          </button>

          <Link
            href="/basket"
            aria-label={`Basket with ${basketCount} items`}
            className="
              rounded-full border border-white/10
              bg-white/5 px-3 py-2
              text-sm font-semibold text-white
            "
          >
            🛒 {basketCount}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="
              rounded-full border border-green-400/30
              bg-green-400/10 px-4 py-2
              text-sm font-semibold text-green-300
            "
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="
          sm:hidden mt-4 pt-3
          border-t border-white/10
          flex flex-col gap-2
        ">
          <Link href="/scouts-corner" onClick={closeMenu} className={shopLink}>
            🌲 Scout&apos;s Corner
          </Link>
          <Link
            href="/shop"
            onClick={closeMenu}
            className="rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white"
          >
            🛍️ Shop
          </Link>
          <Link
            href="/basket"
            onClick={closeMenu}
            className="rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white"
          >
            🛒 Basket ({basketCount})
          </Link>
          <button
            type="button"
            onClick={() => { window.location.href = "/?join=1"; }}
            className="rounded-xl bg-green-400 px-4 py-3 text-left text-sm font-bold text-black"
          >
            🌿 Join Pack
          </button>
        </nav>
      )}
    </header>
  );
}

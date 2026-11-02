
"use client";

import Link from "next/link";
// import ThemeToggle from "@/components/ThemeToggle";

import { useBasket } from "@/components/BasketContext";


export default function Navbar() {
  const { basketCount } = useBasket();

  return (

    <header className="fixed top-0 left-0 w-full z-30 flex justify-between items-center gap-2 px-3 py-3 sm:px-6 sm:py-4">

      <Link href="/" className="font-bold tracking-wide" >
        🐺 Little Wolf Pack
      </Link>



      <div className="flex items-center gap-3">
        <Link
          href="/shop"
          className="
            rounded-full
            border border-white/10
            bg-white/5
            px-4 py-2
            text-sm font-semibold
            text-white
            backdrop-blur-md
            transition-all duration-300
            hover:border-green-400/40
            hover:bg-green-400/10
            hover:text-green-300
            hover:shadow-[0_0_25px_rgba(74,222,128,0.15)]
          "
        >
          Shop
        </Link>

        <Link
          href="/basket"
          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:border-green-400/40 hover:bg-green-400/10 relative z-50 hover:text-green-300"
        >
          Basket ({basketCount})
        </Link>

        {/* <ThemeToggle /> */}

        <button
          type="button"
          onClick={() => {
            window.location.href = "/?join=1";
          }}
          className="
            px-4 py-2 rounded-full
            bg-green-400 text-black font-semibold
            hover:shadow-[0_0_25px_rgba(255,255,160,0.6)]
            transition
          "
        >
          Join Pack
        </button>
      </div>

    </header>
  );
}

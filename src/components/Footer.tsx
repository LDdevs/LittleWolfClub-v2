"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="
  relative z-30 w-full mt-32 px-6 py-12
  border-t border-white/10
  bg-gradient-to-t from-black/40 to-transparent
">

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* 🌿 Brand */}
                <div className="text-sm text-neutral-400">
                    © {new Date().getFullYear()} Little Wolf Pack
                </div>

                {/* 🧭 Links */}
                <div className="flex items-center gap-6 text-sm text-neutral-400">

                    <Link
                        href="/admin"
                        className="hover:text-white transition-colors opacity-40 hover:opacity-100"
                    >
                        Admin
                    </Link>

                    <Link
                        href="/privacy"
                        className="hover:text-white transition-colors opacity-70 hover:opacity-100"
                    >
                        Privacy
                    </Link>

                    <Link
                        href="/contact"
                        className="hover:text-white transition-colors opacity-70 hover:opacity-100"
                    >
                        Contact
                    </Link>

                </div>

            </div>
        </footer>
    );
}
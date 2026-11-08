
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Hero", href: "/admin/hero", icon: "✨" },
    { name: "Scout", href: "/admin/scout", icon: "🐺" },
    { name: "Box", href: "/admin/box", icon: "📦" },
    { name: "Theme", href: "/admin/theme", icon: "🌙" },
    { name: "Shop", href: "/admin/shop", icon: "🛍️" },
    { name: "Announcement", href: "/admin/announcement", icon: "📢" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const renderLinks = () => (
        links.map((link) => {
            const active = pathname === link.href;

            return (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                        flex items-center gap-3 rounded-2xl px-4 py-3 sm:py-4
                        transition-all duration-300 border
                        ${active
                            ? "bg-green-400 text-black border-green-300 shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                            : "border-transparent bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06] hover:border-white/10"
                        }
                    `}
                >
                    <span className="text-lg">{link.icon}</span>
                    <span className="font-medium">{link.name}</span>
                </Link>
            );
        })
    );

    const handleLogout = async () => {
        await fetch("/api/admin/logout", {
            method: "POST",
        });

        window.location.href = "/admin/login";
    };

    return (
        <div className="min-h-screen pt-[120px] bg-neutral-950 text-white flex flex-col md:flex-row">

            {/* MOBILE HEADER */}
            <div className="md:hidden border-b border-white/10 bg-black/60 backdrop-blur-xl p-4 flex items-center justify-between">

                <div>
                    <h1 className="text-xl font-black">
                        Little Wolf CMS
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1">
                        Creative Control Center
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
                >
                    {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
                </button>

            </div>

            {/* MOBILE NAVIGATION */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-white/10 bg-neutral-950 p-4 space-y-2">
                    {renderLinks()}

                    <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-neutral-400 hover:text-white"
                        >
                            ← Back to Website
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* DESKTOP SIDEBAR */}
            <aside className="
                hidden md:flex
                w-72 shrink-0
                border-r border-white/10
                bg-black/40
                backdrop-blur-2xl
                p-6
                flex-col
                relative
            ">
                <div className="absolute top-0 left-0 w-full h-40 bg-green-400/5 blur-3xl pointer-events-none" />

                <div className="relative z-10 mb-10">

                    <h1 className="text-3xl font-black tracking-tight">
                        Little Wolf CMS
                    </h1>

                    <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                        Creative Control Center
                    </p>
                </div>

                <nav className="relative z-10 space-y-2">
                    {renderLinks()}
                </nav>

                <div className="relative z-10 mt-auto pt-8 border-t border-white/10 space-y-4">

                    <Link
                        href="/"
                        className="block text-sm text-neutral-400 hover:text-white transition"
                    >
                        ← Back to Website
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-red-300 transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/20"
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
                {children}
            </main>

        </div>
    );
}

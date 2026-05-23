"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: "🏠",
    },
    {
        name: "Hero",
        href: "/admin/hero",
        icon: "✨",
    },
    {
        name: "Scout",
        href: "/admin/scout",
        icon: "🐺",
    },
    {
        name: "Box",
        href: "/admin/box",
        icon: "📦",
    },
    {
        name: "Theme",
        href: "/admin/theme",
        icon: "🌙",
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden">

            {/* SIDEBAR */}
            <aside
                className="
          w-72
          border-r
          border-white/10
          bg-black/40
          backdrop-blur-2xl
          p-6
          flex
          flex-col
          relative
        "
            >

                {/* glow */}
                <div className="absolute top-0 left-0 w-full h-40 bg-green-400/5 blur-3xl pointer-events-none" />

                {/* LOGO */}
                <div className="relative z-10 mb-10">

                    <h1 className="text-3xl font-black tracking-tight">
                        Little Wolf CMS
                    </h1>

                    <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                        Creative Control Center
                    </p>

                </div>

                {/* NAVIGATION */}
                <nav className="relative z-10 space-y-2">

                    {links.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-4
                  transition-all
                  duration-300
                  border
                  ${active
                                        ? "bg-green-400 text-black border-green-300 shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                                        : "border-transparent bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06] hover:border-white/10"
                                    }
                `}
                            >

                                <span className="text-lg">
                                    {link.icon}
                                </span>

                                <span className="font-medium">
                                    {link.name}
                                </span>

                            </Link>
                        );
                    })}

                </nav>

                {/* FOOTER */}
                <div className="relative z-10 mt-auto pt-8 border-t border-white/10 space-y-4">

                    <Link
                        href="/"
                        className="block text-sm text-neutral-400 hover:text-white transition"
                    >
                        ← Back to Website
                    </Link>

                    <button
                        onClick={async () => {
                            await fetch("/api/admin/logout", {
                                method: "POST",
                            });

                            window.location.href = "/admin/login";
                        }}
                        className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-4
              py-3
              text-left
              text-sm
              text-red-300
              transition-all
              duration-300
              hover:bg-red-500/10
              hover:border-red-500/20
            "
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-10">
                {children}
            </main>

        </div>
    );
}
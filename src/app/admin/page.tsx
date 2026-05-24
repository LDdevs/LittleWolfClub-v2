"use client";

import Link from "next/link";

const cards = [
  {
    title: "Hero Section",
    description: "Edit headline, subtitle and CTA",
    href: "/admin/hero",
    icon: "✨",
  },
  {
    title: "Scout Section",
    description: "Manage Scout storytelling content",
    href: "/admin/scout",
    icon: "🐺",
  },
  {
    title: "What's in the Box",
    description: "Edit box contents and highlights",
    href: "/admin/box",
    icon: "📦",
  },
  {
    title: "Theme Settings",
    description: "Control particles and nighttime mode",
    href: "/admin/theme",
    icon: "🌙",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>

        <p className="uppercase tracking-[0.3em] text-green-400 text-xs mb-3">
          Dashboard
        </p>

        <h1 className="text-5xl font-black tracking-tight mb-4">
          Welcome back.
        </h1>

        <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
          Manage your Little Wolf Club experience, storytelling sections,
          visuals, and future adventures from one place.
        </p>

      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid md:grid-cols-3 gap-5">

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <p className="text-neutral-500 text-sm mb-3">
            CMS Status
          </p>

          <h2 className="text-3xl font-bold text-green-400">
            Live
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <p className="text-neutral-500 text-sm mb-3">
            Sections
          </p>

          <h2 className="text-3xl font-bold">
            4 Active
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <p className="text-neutral-500 text-sm mb-3">
            Theme Mode
          </p>

          <h2 className="text-3xl font-bold">
            Night
          </h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div>

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/3
                p-6
                transition-all
                duration-300
                hover:border-green-400/20
                hover:bg-white/5
                hover:-translate-y-1
              "
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-green-400/10 to-transparent" />

              <div className="relative z-10">

                <div className="text-3xl mb-4">
                  {card.icon}
                </div>

                <h3 className="text-xl font-bold mb-2">
                  {card.title}
                </h3>

                <p className="text-neutral-400 leading-relaxed text-sm">
                  {card.description}
                </p>

              </div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  );
}
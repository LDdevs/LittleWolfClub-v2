"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function StorySections() {
  const progress = useScrollProgress();

  const p = progress;

  return (
    <div className="space-y-40 py-32 px-6">

      {/* SECTION 1 */}
      <section
        className="max-w-3xl mx-auto text-center transition-all duration-700"
        style={{
          opacity: p > 0.1 ? 1 : 0,
          transform: `translateY(${p > 0.1 ? 0 : 40}px)`,
        }}
      >
        <h2 className="text-4xl font-bold">📦 Adventure Kit</h2>
        <p className="mt-4 text-neutral-300">
          A complete outdoor experience designed for curiosity and discovery.
        </p>
      </section>

      {/* SECTION 2 */}
      <section
        className="max-w-3xl mx-auto text-center transition-all duration-700"
        style={{
          opacity: p > 0.25 ? 1 : 0,
          transform: `translateY(${p > 0.25 ? 0 : 40}px)`,
        }}
      >
        <h2 className="text-4xl font-bold">🌿 Outdoor Missions</h2>
        <p className="mt-4 text-neutral-300">
          Real-world challenges that encourage exploration and confidence.
        </p>
      </section>

      {/* SECTION 3 */}
      <section
        className="max-w-3xl mx-auto text-center transition-all duration-700"
        style={{
          opacity: p > 0.4 ? 1 : 0,
          transform: `translateY(${p > 0.4 ? 0 : 40}px)`,
        }}
      >
        <h2 className="text-4xl font-bold">🏅 Collect Badges</h2>
        <p className="mt-4 text-neutral-300">
          Kids earn achievements as they complete adventures.
        </p>
      </section>

      {/* CTA */}
      <section
        className="max-w-3xl mx-auto text-center py-20"
        style={{
          opacity: p > 0.55 ? 1 : 0,
          transform: `translateY(${p > 0.55 ? 0 : 40}px)`,
        }}
      >
        <h2 className="text-4xl font-bold">Ready to Join?</h2>

        <button className="
          mt-6 px-6 py-3 rounded-full
          bg-green-400 text-black font-semibold
          hover:shadow-[0_0_30px_rgba(255,255,160,0.6)]
        ">
          Join the Pack
        </button>
      </section>

    </div>
  );
}
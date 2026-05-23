"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScoutReveal() {
  const progress = useScrollProgress();

  const visible = progress > 0.2 && progress < 0.6;

  const offset = (progress - 0.2) * 300;

  return (
    <div
      className="fixed left-0 right-0 flex justify-center z-20 pointer-events-none"
      style={{
        top: "40%",
        opacity: visible ? 1 : 0,
        transform: `translateY(${50 - offset}px) scale(${visible ? 1 : 0.9})`,
        transition: "opacity 0.6s ease",
      }}
    >
      <div className="text-center">
        <div className="text-7xl">🐺</div>
        <h2 className="text-3xl font-bold mt-4">Meet Scout</h2>
        <p className="text-neutral-300 mt-2 max-w-md">
          Your guide into the wild world of Little Wolf Pack.
        </p>
      </div>
    </div>
  );
}
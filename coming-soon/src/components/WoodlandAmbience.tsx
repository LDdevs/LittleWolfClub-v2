"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";

type DayPhase = "night" | "dawn" | "day" | "dusk";

function getDayPhase(date: Date): DayPhase {
  const hour = date.getHours();
  if (hour < 5 || hour >= 21) return "night";
  if (hour < 9) return "dawn";
  if (hour < 17) return "day";
  return "dusk";
}

const lighting: Record<DayPhase, string> = {
  night: "radial-gradient(ellipse at 75% 0%, rgba(99,102,241,0.13), transparent 58%), linear-gradient(180deg, rgba(15,23,42,0.10), transparent 45%)",
  dawn: "radial-gradient(ellipse at 18% 0%, rgba(251,191,146,0.16), transparent 58%), linear-gradient(180deg, rgba(251,191,146,0.04), transparent 55%)",
  day: "radial-gradient(ellipse at 18% 0%, rgba(250,204,100,0.15), transparent 60%), radial-gradient(ellipse at 82% 42%, rgba(190,220,150,0.07), transparent 55%)",
  dusk: "radial-gradient(ellipse at 82% 0%, rgba(249,115,22,0.15), transparent 60%), linear-gradient(180deg, rgba(124,58,237,0.04), transparent 55%)",
};

export default function WoodlandAmbience() {
  const { activeAtmosphere, effectsEnabled, atmosphere } = useTheme();
  const [phase, setPhase] = useState<DayPhase>("day");

  useEffect(() => {
    const update = () => setPhase(getDayPhase(new Date()));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!effectsEnabled || !atmosphere.enabled) return null;

  const warmSeason = activeAtmosphere === "spring" || activeAtmosphere === "summer" || activeAtmosphere === "easter";
  const coolSeason = activeAtmosphere === "winter" || activeAtmosphere === "christmas";
  const halloween = activeAtmosphere === "halloween";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
    >
      <div className="absolute inset-0 transition-opacity duration-[2500ms]" style={{ background: lighting[phase], opacity: 0.9 }} />

      {/* Soft shafts of woodland light */}
      <div
        className="woodland-light absolute -top-1/3 left-[8%] h-[85vh] w-[28vw] rotate-[22deg] blur-3xl"
        style={{ background: warmSeason ? "rgba(253,224,150,0.055)" : coolSeason ? "rgba(186,230,253,0.045)" : halloween ? "rgba(168,85,247,0.045)" : "rgba(217,160,90,0.05)" }}
      />
      <div
        className="woodland-light woodland-light-delayed absolute -top-1/4 right-[12%] h-[75vh] w-[20vw] -rotate-[18deg] blur-3xl"
        style={{ background: warmSeason ? "rgba(190,230,160,0.045)" : "rgba(255,255,255,0.025)" }}
      />

      {/* Tiny details tucked into the edges of the woodland */}
      <div className="woodland-detail absolute bottom-[9%] left-[3%] text-xl opacity-45 sm:text-2xl">
        {activeAtmosphere === "winter" || activeAtmosphere === "christmas" ? "🌲" : halloween ? "🍄" : "🌱"}
      </div>
      <div className="woodland-detail woodland-detail-delayed absolute bottom-[16%] right-[4%] text-xl opacity-40 sm:text-2xl">
        {activeAtmosphere === "spring" || activeAtmosphere === "easter" ? "🌼" : activeAtmosphere === "autumn" ? "🍄" : "🌿"}
      </div>

      {/* Occasional woodland visitors */}
      <span className="woodland-visitor woodland-squirrel absolute bottom-[12%] left-[-2rem] text-3xl sm:text-4xl">🐿️</span>
      <span className="woodland-visitor woodland-hedgehog absolute bottom-[8%] right-[-2rem] text-3xl sm:text-4xl">🦔</span>
      <span className="woodland-visitor woodland-bird absolute right-[12%] top-[24%] text-xl">🐦</span>

      {/* Summer fireflies become more visible around dusk and at night */}
      {activeAtmosphere === "summer" && (phase === "dusk" || phase === "night") && (
        <div className="absolute inset-0">
          <i className="woodland-firefly left-[18%] top-[38%]" />
          <i className="woodland-firefly left-[72%] top-[58%] woodland-firefly-delayed" />
          <i className="woodland-firefly left-[46%] top-[76%] woodland-firefly-slow" />
        </div>
      )}

      <style>{`
        .woodland-light { animation: woodland-light-drift 24s ease-in-out infinite alternate; }
        .woodland-light-delayed { animation-delay: -11s; }
        .woodland-detail { animation: woodland-detail-sway 9s ease-in-out infinite; }
        .woodland-detail-delayed { animation-delay: -4s; }
        .woodland-visitor { opacity: 0; animation: woodland-peek 24s ease-in-out infinite; }
        .woodland-squirrel { animation-delay: 2s; }
        .woodland-hedgehog { animation-delay: 11s; }
        .woodland-bird { animation: woodland-bird-pass 30s ease-in-out infinite; animation-delay: 6s; }
        .woodland-firefly { position: absolute; width: 5px; height: 5px; border-radius: 999px; background: #fef08a; box-shadow: 0 0 9px 3px rgba(253,224,71,.45); animation: woodland-firefly-float 7s ease-in-out infinite; }
        .woodland-firefly-delayed { animation-delay: -2s; }
        .woodland-firefly-slow { animation-delay: -4s; }
        @keyframes woodland-light-drift { from { transform: translate3d(-2vw,0,0) rotate(0deg); opacity: .55; } to { transform: translate3d(3vw,2vh,0) rotate(4deg); opacity: 1; } }
        @keyframes woodland-detail-sway { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-7px) rotate(4deg); } }
        @keyframes woodland-peek { 0%,8%,100% { opacity: 0; transform: translateX(0) translateY(8px); } 12%,20% { opacity: .72; transform: translateX(3.2rem) translateY(0); } 25% { opacity: 0; transform: translateX(4rem) translateY(8px); } }
        @keyframes woodland-bird-pass { 0%,12%,100% { opacity: 0; transform: translate(0,0); } 18% { opacity: .65; } 34% { opacity: .65; transform: translate(-45vw,-12px); } 38% { opacity: 0; transform: translate(-50vw,-18px); } }
        @keyframes woodland-firefly-float { 0%,100% { opacity: .2; transform: translate(0,0); } 50% { opacity: .9; transform: translate(12px,-18px); } }
        @media (prefers-reduced-motion: reduce) { .woodland-light, .woodland-detail, .woodland-visitor, .woodland-firefly { animation: none !important; } .woodland-visitor { display: none; } }
      `}</style>
    </div>
  );
}

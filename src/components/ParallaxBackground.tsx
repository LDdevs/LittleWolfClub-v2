"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";

export default function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { mood } = useTheme();

  useEffect(() => {
    const el = ref.current!;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;

      el.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-full bg-cover bg-center scale-110 transition-all duration-700 will-change-transform"
      style={{
        backgroundImage: "url('/forest-bg.png')",

        filter: `
          brightness(${1 - mood * 0.55})
          saturate(${1 - mood * 0.25})
          hue-rotate(${mood * 18}deg)
        `,
      }}
    />
  );
}
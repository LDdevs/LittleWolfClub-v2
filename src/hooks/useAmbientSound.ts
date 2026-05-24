"use client";

import { useEffect } from "react";

export function useAmbientSound() {
  useEffect(() => {
    const audio = new Audio("/forest.mp3");
    audio.loop = true;
    audio.volume = 0.15;

    const start = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", start);
    };

    window.addEventListener("click", start);

    return () => window.removeEventListener("click", start);
  }, []);
}
"use client";

import { useEffect, useState } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const p = window.scrollY / h;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
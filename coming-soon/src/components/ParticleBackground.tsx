"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";

type Leaf = {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  seed: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mood } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // 🌿 leaves
    const leaves: Leaf[] = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 3 + Math.random() * 6,
      speed: 0.4 + Math.random() * 1,
      rotation: Math.random() * Math.PI * 2,
      seed: Math.random() * 1000,
    }));

    // 🌬️ scroll wind
    let lastScroll = window.scrollY;
    let velocity = 0;

    window.addEventListener("scroll", () => {
      const cur = window.scrollY;
      velocity = Math.abs(cur - lastScroll);
      lastScroll = cur;
    });

    const drawLeaf = (l: Leaf, i: number) => {
      ctx.save();

      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation);

      // 🌙 mood glow
      if (mood > 0.5) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(167, 243, 208, 0.4)";
      }

      const color =
        mood > 0.5
          ? ["#a7f3d0", "#86efac", "#d9f99d"][i % 3]
          : ["#22c55e", "#16a34a", "#4ade80"][i % 3];

      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(l.size, -l.size, 0, -l.size * 2);
      ctx.quadraticCurveTo(-l.size, -l.size, 0, 0);
      ctx.fill();

      ctx.restore();
    };

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      const wind = 1 + Math.min(velocity * 0.02, 3);

      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i];

        l.y += l.speed * wind;
        l.x += Math.sin(frame * 0.01 + l.seed) * 0.6;
        l.rotation += 0.01;

        if (l.y > h + 20) {
          l.y = -20;
          l.x = Math.random() * w;
        }

        drawLeaf(l, i);
      }

      frame++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [mood]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
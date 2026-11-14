"use client";

import { useEffect, useRef } from "react";
import type { AtmosphereTheme } from "@/lib/atmosphere";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  seed: number;
};

const palette: Record<AtmosphereTheme, string[]> = {
  spring: ["#f9a8d4", "#fbcfe8", "#bbf7d0", "#fde68a"],
  summer: ["#fde68a", "#fef3c7", "#d9f99d", "#ffffff"],
  autumn: ["#c08457", "#d97706", "#eab308", "#a3a34a"],
  winter: ["#e0f2fe", "#bae6fd", "#f8fafc", "#cbd5e1"],
  halloween: ["#f97316", "#a3e635", "#7c3aed", "#fbbf24"],
  christmas: ["#dcfce7", "#fca5a5", "#f8fafc", "#86efac"],
  easter: ["#f9a8d4", "#c4b5fd", "#fde68a", "#a7f3d0"],
  bonfire: ["#fb923c", "#f97316", "#facc15", "#fef3c7"],
};

type Props = {
  theme: AtmosphereTheme;
  intensity: number;
  enabled?: boolean;
  className?: string;
  respondToScroll?: boolean;
};

export default function AtmosphereParticleCanvas({
  theme,
  intensity,
  enabled = true,
  className = "",
  respondToScroll = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let particles: Particle[] = [];
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const colours = palette[theme];

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((5 + intensity * 0.42) * (width < 640 ? 0.7 : 1));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 6,
        speed: 0.2 + Math.random() * 0.65,
        rotation: Math.random() * Math.PI * 2,
        seed: Math.random() * 1000,
      }));
      drawFrame(false);
    };

    const drawParticle = (particle: Particle, index: number) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = colours[index % colours.length];
      ctx.globalAlpha = 0.2 + (intensity / 100) * 0.7;

      if (theme === "winter" || theme === "summer" || theme === "bonfire") {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * (theme === "winter" ? 0.45 : 0.35), 0, Math.PI * 2);
        ctx.fill();
        if (theme === "bonfire") {
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.fillStyle as string;
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(particle.size, -particle.size, 0, -particle.size * 2);
        ctx.quadraticCurveTo(-particle.size, -particle.size, 0, 0);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawFrame = (move: boolean) => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        if (move) {
          const wind = respondToScroll ? 1 + Math.min(velocity * 0.02, 0.6) : 1;
          particle.y += particle.speed * wind;
          particle.x += Math.sin(frame * 0.01 + particle.seed) * 0.6;
          particle.rotation += 0.008;
          if (particle.y > height + 24) {
            particle.y = -24;
            particle.x = Math.random() * width;
          }
        }
        drawParticle(particle, index);
      });
      if (move) {
        velocity *= 0.94;
        frame += 1;
      }
    };

    const animate = () => {
      drawFrame(true);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onScroll = () => {
      const current = window.scrollY;
      velocity = Math.min(Math.abs(current - lastScroll), 30);
      lastScroll = current;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();

    if (respondToScroll) window.addEventListener("scroll", onScroll, { passive: true });
    if (enabled && intensity > 0 && !motionPreference.matches) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    const onMotionChange = () => {
      window.cancelAnimationFrame(animationFrame);
      drawFrame(false);
      if (enabled && intensity > 0 && !motionPreference.matches) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };
    motionPreference.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      if (respondToScroll) window.removeEventListener("scroll", onScroll);
      motionPreference.removeEventListener("change", onMotionChange);
    };
  }, [theme, intensity, enabled, respondToScroll]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

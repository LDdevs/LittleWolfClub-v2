"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  seed: number;
};

const palette: Record<string, string[]> = {
  spring: ["#f9a8d4", "#fbcfe8", "#bbf7d0", "#fde68a"],
  summer: ["#fde68a", "#fef3c7", "#d9f99d", "#ffffff"],
  autumn: ["#c08457", "#d97706", "#eab308", "#a3a34a"],
  winter: ["#e0f2fe", "#bae6fd", "#f8fafc", "#cbd5e1"],
  halloween: ["#f97316", "#a3e635", "#7c3aed", "#fbbf24"],
  christmas: ["#dcfce7", "#fca5a5", "#f8fafc", "#86efac"],
  easter: ["#f9a8d4", "#c4b5fd", "#fde68a", "#a7f3d0"],
  bonfire: ["#fb923c", "#f97316", "#facc15", "#fef3c7"],
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mood, atmosphere, activeAtmosphere } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let animationFrame = 0;
    let frame = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => {
      const current = window.scrollY;
      velocity = Math.min(Math.abs(current - lastScroll), 30);
      lastScroll = current;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const count = Math.round((8 + atmosphere.intensity * 0.55) * (w < 640 ? 0.55 : 1));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 3 + Math.random() * 6,
      speed: 0.25 + Math.random() * 0.75,
      rotation: Math.random() * Math.PI * 2,
      seed: Math.random() * 1000,
    }));

    const colours = palette[activeAtmosphere] || palette.autumn;
    const drawParticle = (particle: Particle, index: number) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      if (mood > 0.5) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(255,255,255,0.25)";
      }

      ctx.fillStyle = colours[index % colours.length];
      ctx.globalAlpha = 0.45 + (atmosphere.intensity / 100) * 0.45;

      if (activeAtmosphere === "winter") {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeAtmosphere === "summer") {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Leaf / petal silhouettes keep the existing woodland particle style.
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(particle.size, -particle.size, 0, -particle.size * 2);
        ctx.quadraticCurveTo(-particle.size, -particle.size, 0, 0);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const wind = 1 + Math.min(velocity * 0.02, 0.6);

      particles.forEach((particle, index) => {
        particle.y += particle.speed * wind;
        particle.x += Math.sin(frame * 0.01 + particle.seed) * 0.6;
        particle.rotation += 0.008;

        if (particle.y > h + 24) {
          particle.y = -24;
          particle.x = Math.random() * w;
        }

        drawParticle(particle, index);
      });

      velocity *= 0.94;
      frame += 1;
      if (!reducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    if (!reducedMotion.matches && atmosphere.enabled && atmosphere.intensity > 0) {
      animate();
    }

    const onMotionPreferenceChange = () => {
      window.cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, w, h);
      if (!reducedMotion.matches && atmosphere.enabled && atmosphere.intensity > 0) {
        animate();
      }
    };

    reducedMotion.addEventListener("change", onMotionPreferenceChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", onMotionPreferenceChange);
    };
  }, [mood, atmosphere.enabled, atmosphere.intensity, activeAtmosphere]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

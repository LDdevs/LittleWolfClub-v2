"use client";

import { useEffect, useRef } from "react";
import type { AtmosphereTheme } from "@/lib/atmosphere";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  rotation: number;
  spin: number;
  seed: number;
  colour: string;
};

const palette: Record<AtmosphereTheme, string[]> = {
  spring: ["#f9a8d4", "#fbcfe8", "#bbf7d0", "#fde68a"],
  summer: ["#fde68a", "#fef3c7", "#d9f99d", "#ffffff"],
  autumn: ["#c08457", "#d97706", "#eab308", "#a3a34a"],
  winter: ["#e0f2fe", "#bae6fd", "#f8fafc", "#cbd5e1"],
  halloween: ["#f97316", "#a3e635", "#c084fc", "#fbbf24"],
  christmas: ["#dcfce7", "#fca5a5", "#f8fafc", "#86efac", "#fcd34d"],
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
    const isUpward = theme === "summer" || theme === "bonfire";
    const baseCount = theme === "winter" || theme === "christmas" ? 34 : 24;

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((baseCount * (0.35 + intensity / 100)) * (width < 640 ? 0.7 : 1));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2.5 + Math.random() * (theme === "winter" ? 5 : 7),
        speed: 0.25 + Math.random() * 0.75,
        drift: (Math.random() - 0.5) * (theme === "autumn" ? 1.2 : 0.55),
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.025,
        seed: Math.random() * 1000,
        colour: colours[Math.floor(Math.random() * colours.length)],
      }));
      drawFrame(false);
    };

    const drawLeaf = (p: Particle) => {
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 1.25, -p.size * 0.45, p.size * 0.9, p.size * 0.65, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.65, -p.size * 1.25, -p.size * 0.45, 0, -p.size);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.75);
      ctx.lineTo(0, p.size * 0.75);
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    };

    const drawPetal = (p: Particle) => {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.48, p.size * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSnowflake = (p: Particle) => {
      ctx.strokeStyle = p.colour;
      ctx.lineWidth = Math.max(0.8, p.size * 0.16);
      ctx.lineCap = "round";
      for (let arm = 0; arm < 6; arm += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * arm);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, p.size * 1.15);
        ctx.moveTo(0, p.size * 0.65);
        ctx.lineTo(-p.size * 0.25, p.size * 0.42);
        ctx.moveTo(0, p.size * 0.65);
        ctx.lineTo(p.size * 0.25, p.size * 0.42);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawStar = (p: Particle) => {
      ctx.beginPath();
      for (let point = 0; point < 8; point += 1) {
        const radius = point % 2 === 0 ? p.size : p.size * 0.22;
        const angle = (Math.PI / 4) * point - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawEgg = (p: Particle) => {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.68, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = Math.max(0.8, p.size * 0.12);
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.48, -p.size * 0.12);
      ctx.quadraticCurveTo(0, p.size * 0.18, p.size * 0.48, -p.size * 0.12);
      ctx.stroke();
    };

    const drawBat = (p: Particle) => {
      const flap = Math.sin(frame * 0.16 + p.seed) * p.size * 0.28;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-p.size * 0.4, -p.size * 0.8 - flap, -p.size * 1.35, -p.size * 0.35);
      ctx.lineTo(-p.size * 0.95, p.size * 0.55);
      ctx.lineTo(-p.size * 0.35, p.size * 0.2);
      ctx.lineTo(0, p.size * 0.55);
      ctx.lineTo(p.size * 0.35, p.size * 0.2);
      ctx.lineTo(p.size * 0.95, p.size * 0.55);
      ctx.lineTo(p.size * 1.35, -p.size * 0.35);
      ctx.quadraticCurveTo(p.size * 0.4, -p.size * 0.8 + flap, 0, 0);
      ctx.fill();
    };

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.colour;
      ctx.globalAlpha = theme === "winter" ? 0.42 + intensity / 180 : 0.28 + intensity / 145;

      if (theme === "spring") {
        drawPetal(p);
      } else if (theme === "summer") {
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.colour;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha *= 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 1.15, 0, Math.PI * 2);
        ctx.fill();
      } else if (theme === "autumn") {
        drawLeaf(p);
      } else if (theme === "winter") {
        if (p.size > 5) drawSnowflake(p);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.38, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === "halloween") {
        if (p.size > 6) drawBat(p);
        else {
          ctx.shadowBlur = 9;
          ctx.shadowColor = p.colour;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === "christmas") {
        if (p.size > 6) drawStar(p);
        else {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.colour;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === "easter") {
        drawEgg(p);
      } else {
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.colour;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha *= 0.45;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.95, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawAmbient = () => {
      if (theme === "summer" || theme === "spring" || theme === "easter") {
        const glow = ctx.createRadialGradient(width * 0.5, 0, 0, width * 0.5, 0, height * 0.95);
        glow.addColorStop(0, theme === "summer" ? "rgba(250,204,21,0.10)" : "rgba(253,186,214,0.08)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
      if (theme === "halloween") {
        const mist = ctx.createLinearGradient(0, height * 0.68, 0, height);
        mist.addColorStop(0, "rgba(124,58,237,0)");
        mist.addColorStop(1, "rgba(124,58,237,0.09)");
        ctx.fillStyle = mist;
        ctx.fillRect(0, height * 0.65, width, height * 0.35);
      }
      if (theme === "winter" || theme === "christmas") {
        const frost = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, Math.max(width, height) * 0.75);
        frost.addColorStop(0, "rgba(186,230,253,0)");
        frost.addColorStop(1, "rgba(186,230,253,0.09)");
        ctx.fillStyle = frost;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const drawFrame = (move: boolean) => {
      ctx.clearRect(0, 0, width, height);
      drawAmbient();
      particles.forEach((particle) => {
        if (move) {
          const wind = respondToScroll ? 1 + Math.min(velocity * 0.02, 0.6) : 1;
          const sway = Math.sin(frame * (theme === "autumn" ? 0.035 : 0.018) + particle.seed);
          particle.y += (isUpward ? -particle.speed : particle.speed) * wind;
          particle.x += particle.drift + sway * (theme === "autumn" ? 0.9 : 0.35);
          particle.rotation += particle.spin * (theme === "autumn" ? 1.8 : 1);
          if (particle.y > height + 30) {
            particle.y = -30;
            particle.x = Math.random() * width;
          } else if (particle.y < -30) {
            particle.y = height + 30;
            particle.x = Math.random() * width;
          }
          if (particle.x < -30) particle.x = width + 30;
          if (particle.x > width + 30) particle.x = -30;
        }
        drawParticle(particle);
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

    if (enabled && intensity > 0 && !motionPreference.matches) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    if (respondToScroll) window.addEventListener("scroll", onScroll, { passive: true });
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

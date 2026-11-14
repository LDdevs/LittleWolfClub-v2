"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";
import type { AtmosphereTheme } from "@/lib/atmosphere";

type TrailParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  spin: number;
  colour: string;
};

const trailPalettes: Record<AtmosphereTheme, string[]> = {
  spring: ["#f9a8d4", "#fbcfe8", "#bbf7d0"],
  summer: ["#fde68a", "#fef3c7", "#d9f99d"],
  autumn: ["#c08457", "#d97706", "#eab308"],
  winter: ["#e0f2fe", "#bae6fd", "#f8fafc"],
  halloween: ["#f97316", "#c084fc", "#a3e635"],
  christmas: ["#f8fafc", "#fcd34d", "#86efac", "#fca5a5"],
  easter: ["#f9a8d4", "#c4b5fd", "#fde68a", "#a7f3d0"],
  bonfire: ["#fb923c", "#f97316", "#facc15"],
};

export default function FireflyCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { atmosphere, activeAtmosphere } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!atmosphere.enabled || atmosphere.intensity <= 0 || !finePointer.matches || motionPreference.matches) {
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "block";

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = 0;
    let frame = 0;
    let lastX = -100;
    let lastY = -100;
    let particles: TrailParticle[] = [];
    const colours = trailPalettes[activeAtmosphere];
    const intensity = Math.max(0, Math.min(100, atmosphere.intensity)) / 100;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addParticle = (x: number, y: number, burst = false) => {
      const count = burst ? 10 : 2 + Math.round(intensity * 2);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 0.7 + Math.random() * 2 : 0.15 + Math.random() * 0.65;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (burst ? 0 : (Math.random() - 0.5) * 0.45),
          vy: Math.sin(angle) * speed + (burst ? 0 : (Math.random() - 0.5) * 0.45),
          life: burst ? 45 + Math.random() * 20 : 28 + Math.random() * 18,
          maxLife: burst ? 65 : 46,
          size: 1.8 + Math.random() * (2.8 + intensity * 1.5),
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.12,
          colour: colours[Math.floor(Math.random() * colours.length)],
        });
      }
      if (particles.length > 180) particles.splice(0, particles.length - 180);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (dx * dx + dy * dy > 9) {
        addParticle(event.clientX, event.clientY);
        lastX = event.clientX;
        lastY = event.clientY;
      }
    };

    const onClick = (event: MouseEvent) => addParticle(event.clientX, event.clientY, true);

    const drawShape = (particle: TrailParticle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.colour;
      ctx.strokeStyle = particle.colour;
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife) * 0.85;

      if (activeAtmosphere === "spring" || activeAtmosphere === "easter") {
        ctx.beginPath();
        ctx.ellipse(0, 0, particle.size * 0.55, particle.size * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeAtmosphere === "autumn") {
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.quadraticCurveTo(particle.size, 0, 0, particle.size);
        ctx.quadraticCurveTo(-particle.size, 0, 0, -particle.size);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -particle.size * 0.7);
        ctx.lineTo(0, particle.size * 0.7);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else if (activeAtmosphere === "winter") {
        ctx.lineWidth = Math.max(0.7, particle.size * 0.18);
        ctx.lineCap = "round";
        for (let arm = 0; arm < 3; arm += 1) {
          ctx.save();
          ctx.rotate((Math.PI / 3) * arm);
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(0, particle.size);
          ctx.stroke();
          ctx.restore();
        }
      } else if (activeAtmosphere === "halloween") {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha *= 0.35;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 1.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeAtmosphere === "christmas") {
        ctx.beginPath();
        for (let point = 0; point < 8; point += 1) {
          const radius = point % 2 === 0 ? particle.size : particle.size * 0.25;
          const angle = (Math.PI / 4) * point - Math.PI / 2;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (point === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha *= 0.35;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((particle) => particle.life > 0);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy + (activeAtmosphere === "bonfire" || activeAtmosphere === "summer" ? -0.12 : 0.025);
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.rotation += particle.spin;
        particle.life -= 1;
        drawShape(particle);
      });
      frame += 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("click", onClick);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
    };
  }, [atmosphere.enabled, atmosphere.intensity, activeAtmosphere]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}

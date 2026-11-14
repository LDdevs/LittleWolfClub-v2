"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";

export default function FireflyCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { effectsEnabled } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!effectsEnabled || motionPreference.matches) {
            canvas.style.display = "none";
            return;
        }
        canvas.style.display = "block";

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let x = mouseX;
        let y = mouseY;
        let frame = 0;
        let animationFrame = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            x += (mouseX - x) * 0.15;
            y += (mouseY - y) * 0.15;

            const flicker = 0.8 + Math.sin(frame * 0.2) * 0.2;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
            glow.addColorStop(0, `rgba(255, 255, 180, ${0.9 * flicker})`);
            glow.addColorStop(0.3, `rgba(255, 255, 120, ${0.5 * flicker})`);
            glow.addColorStop(1, "rgba(255, 255, 100, 0)");

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 180, ${flicker})`;
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            frame++;
            animationFrame = window.requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        animationFrame = window.requestAnimationFrame(draw);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [effectsEnabled]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 z-40 pointer-events-none"
        />
    );
}

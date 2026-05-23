"use client";

import { useEffect, useRef } from "react";

export default function FireflyCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let x = mouseX;
        let y = mouseY;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        type Burst = {
            x: number;
            y: number;
            life: number;
        };

        const bursts: Burst[] = [];

        window.addEventListener("click", (e) => {
            bursts.push({
                x: e.clientX,
                y: e.clientY,
                life: 60,
            });
        });

        window.addEventListener("mousemove", handleMouseMove);

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);

        let frame = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 🧠 smooth follow (lerp)
            x += (mouseX - x) * 0.15;
            y += (mouseY - y) * 0.15;

            // ✨ flicker
            const flicker = 0.8 + Math.sin(frame * 0.2) * 0.2;

            // 🌟 glow gradient
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
            glow.addColorStop(0, `rgba(255, 255, 180, ${0.9 * flicker})`);
            glow.addColorStop(0.3, `rgba(255, 255, 120, ${0.5 * flicker})`);
            glow.addColorStop(1, "rgba(255, 255, 100, 0)");

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // 🟡 core
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 180, ${flicker})`;
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            frame++;
            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-40 pointer-events-none"
        />
    );
}
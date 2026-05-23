"use client";

import { useEffect, useRef } from "react";

export default function MeetScout() {
    const ref = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // 🌿 fade-in on scroll
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("opacity-100", "translate-y-0");
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // 🐺 subtle parallax on image only
    useEffect(() => {
        const img = imageRef.current;
        if (!img) return;

        const move = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;

            img.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
        };

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <section className="min-h-screen flex items-center px-6 py-20">

            <div
                ref={ref}
                className="
          max-w-6xl mx-auto
          grid md:grid-cols-2 gap-12 items-center
          opacity-0 translate-y-10
          transition-all duration-700
        "
            >

                {/* 🧠 TEXT SIDE */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Meet Scout 🐺
                    </h2>

                    <p className="mt-6 text-neutral-300 leading-relaxed">
                        Scout is your child’s guide into the wild world of the Little Wolf Pack.
                        He’s curious, brave, and always ready to help young explorers discover nature’s secrets.
                    </p>

                    <p className="mt-4 text-neutral-400">
                        Every adventure begins with a message from Scout — encouraging kids to explore, observe, and imagine.
                    </p>

                    <div className="mt-8 flex gap-3">
                        <span className="px-3 py-1 text-sm rounded-full bg-white/10">
                            🌿 Explorer
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-white/10">
                            🧭 Guide
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-white/10">
                            🐺 Friend
                        </span>
                    </div>
                </div>

                {/* 🖼️ IMAGE SIDE */}
                <div className="relative flex justify-center">

                    {/* glow behind Scout */}
                    <div className="absolute w-72 h-72 bg-green-400/20 blur-3xl rounded-full" />

                    <img
                        ref={imageRef}
                        src="/Scout-Hero.svg"
                        alt="Scout the Wolf Guide"
                        className=" relative z-10 w-72 md:w-96 drop-shadow-[0_0_25px_rgba(134,239,172,0.25)] transition-transform duration-200m will-change-transform"
                    />
                </div>

            </div>
        </section>
    );
}
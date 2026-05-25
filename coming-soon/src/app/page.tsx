"use client";

import { useEffect, useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import ParallaxBackground from "@/components/ParallaxBackground";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

type Content = {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  scout: {
    title?: string;
    text: string;
    image?: string;
  };
  box: {
    title?: string;
    items: string[];
  };
};

export default function HomePage() {
  const [content, setContent] = useState<Content | null>(null);

  // 🧠 CMS CONTENT LOADER
  const loadContent = async () => {
    try {
      const res = await fetch("/api/content", {
        cache: "no-store",
      });

      const data = await res.json();

      setContent(data);
    } catch (err) {
      console.error("Failed to load CMS content:", err);
    }
  };

  useEffect(() => {
    let alive = true;

    const init = async () => {
      if (!alive) return;
      await loadContent();
    };

    init();

    // ⚡ live CMS updates
    const channel = new BroadcastChannel("cms-updates");

    channel.onmessage = (event) => {
      if (event.data === "update") {
        loadContent();
      }
    };

    return () => {
      alive = false;
      channel.close();
    };
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden">

      {/* 🌄 PARALLAX BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <ParallaxBackground />
      </div>

      {/* 🍃 PARTICLES */}
      <div className="fixed inset-0 z-10">
        <ParticleBackground />
      </div>

      {/* 🌫️ OVERLAY */}
      <div className="fixed inset-0 z-20 bg-black/40 pointer-events-none" />

      {/* 🧠 CONTENT */}
      <div className="relative z-30">

        {/* ========================================= */}
        {/* NAVBAR */}
        {/* ========================================= */}
        <header className="w-full px-6 py-5 flex justify-between items-center">

          <Logo />

          <div className="flex items-center gap-4">

            <span className="hidden sm:block text-sm text-neutral-400">
              Coming Very Soon
            </span>

            <button
              className="
                group
                relative
                overflow-hidden
                rounded-full
                border
                border-white/10
                bg-white/5
                backdrop-blur-md
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                duration-300
                hover:border-green-400/40
                hover:bg-green-400/10
                hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]
              "
            >
              <span className="relative z-10">
                Join Waitlist
              </span>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-green-400/20 to-transparent" />
            </button>

          </div>
        </header>

        {/* ========================================= */}
        {/* HERO */}
        {/* ========================================= */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">

          <div className="mb-6">
            <span className="uppercase tracking-[0.35em] text-green-400 text-xs sm:text-sm">
              Adventure Awaits
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8">

            <span className="bg-linear-to-b from-white to-neutral-500 bg-clip-text text-transparent">
              {content.hero.title}
            </span>

          </h1>

          <p className="text-neutral-300 text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            {content.hero.subtitle}
          </p>

          <button
            className="
              group
              relative
              overflow-hidden
              rounded-full
              px-8
              py-4
              bg-green-400
              text-black
              font-semibold
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-[0_0_50px_rgba(74,222,128,0.35)]
            "
          >

            <span className="relative z-10">
              {content.hero.cta}
            </span>

            {/* 🌟 glow layer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />

          </button>

          {/* ✨ floating glow */}
          <div className="absolute blur-3xl opacity-20 bg-green-400/20 w-125 h-125 rounded-full -z-10" />

        </section>

        {/* divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent max-w-5xl mx-auto" />

        {/* ========================================= */}
        {/* MEET SCOUT */}
        {/* ========================================= */}
        <section className="min-h-screen px-6 py-32 flex flex-col md:flex-row items-center gap-20 max-w-6xl mx-auto">

          {/* IMAGE */}
          <div className="flex-1">

            <div
              className="
                relative
                aspect-square
                overflow-hidden
                rounded-4xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-sm
                shadow-[0_0_80px_rgba(255,255,255,0.04)]
              "
            >

              <img
                src={content.scout.image || "/Scout-New.svg"}
                alt="Scout"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            </div>

          </div>

          {/* TEXT */}
          <div className="flex-1">

            <p className="uppercase tracking-[0.35em] text-green-400 text-xs sm:text-sm mb-5">
              Meet Your Guide
            </p>

            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">

              <span className="bg-linear-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                {content.scout.title || "Meet Scout 🐺"}
              </span>

            </h2>

            <p className="text-neutral-300 text-lg leading-relaxed">
              {content.scout.text}
            </p>

          </div>

        </section>

        {/* divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent max-w-5xl mx-auto" />

        {/* ========================================= */}
        {/* WHAT'S IN THE BOX */}
        {/* ========================================= */}
        <section className="px-6 py-32 max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[0.35em] text-green-400 text-xs sm:text-sm mb-4">
              Explore The Adventure
            </p>

            <h2 className="text-5xl md:text-6xl font-bold">

              <span className="bg-linear-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                {content.box.title || "What’s in the Box 📦"}
              </span>

            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {content.box.items.map((item, i) => (
              <div
                key={i}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-sm
                  p-6
                  transition-all
                  duration-300
                  hover:bg-white/10
                  hover:border-green-400/20
                  hover:-translate-y-0.5
                "
              >

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-green-400/10 to-transparent" />

                <div className="relative z-10 flex items-center gap-3">

                  <span className="text-green-400 text-lg">
                    ✦
                  </span>

                  <span className="text-neutral-200 text-lg">
                    {item}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ========================================= */}
        {/* FINAL CTA */}
        {/* ========================================= */}
        <section className="px-6 py-32 text-center max-w-4xl mx-auto">

          <p className="uppercase tracking-[0.35em] text-green-400 text-xs sm:text-sm mb-5">
            Join The Pack
          </p>

          <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">

            <span className="bg-linear-to-b from-white to-neutral-500 bg-clip-text text-transparent">
              Adventure is almost here.
            </span>

          </h2>

          <p className="text-neutral-300 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Be the first to experience magical outdoor adventures designed to spark curiosity, confidence, and connection with nature.
          </p>

          <button
            className="
              group
              relative
              overflow-hidden
              rounded-full
              px-10
              py-5
              bg-green-400
              text-black
              font-semibold
              text-lg
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-[0_0_60px_rgba(74,222,128,0.35)]
            "
          >

            <span className="relative z-10">
              Join the Waitlist
            </span>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />

          </button>

        </section>

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}
        <Footer />

      </div>
    </div>
  );
}
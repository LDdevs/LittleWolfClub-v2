"use client";

import { useEffect, useState } from "react";

type Content = {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
};

export default function HeroCMSPage() {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setContent(data));
  }, []);

  const saveChanges = async () => {
    await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    const channel = new BroadcastChannel("cms-updates");
    channel.postMessage("update");

    alert("Hero section updated!");
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">

      <div>

        <p className="uppercase tracking-[0.3em] text-green-400 text-xs mb-3">
          Hero Section
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Edit Hero
        </h1>

      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl space-y-6">

        <div>
          <label className="block text-sm text-neutral-400 mb-3">
            Hero Title
          </label>

          <input
            value={content.hero.title}
            onChange={(e) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  title: e.target.value,
                },
              })
            }
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-green-400/30"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-3">
            Subtitle
          </label>

          <textarea
            value={content.hero.subtitle}
            onChange={(e) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  subtitle: e.target.value,
                },
              })
            }
            className="w-full min-h-[160px] rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-green-400/30"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-3">
            CTA Text
          </label>

          <input
            value={content.hero.cta}
            onChange={(e) =>
              setContent({
                ...content,
                hero: {
                  ...content.hero,
                  cta: e.target.value,
                },
              })
            }
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-green-400/30"
          />
        </div>

        <button
          onClick={saveChanges}
          className="rounded-full bg-green-400 text-black px-8 py-4 font-semibold hover:scale-105 transition"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}
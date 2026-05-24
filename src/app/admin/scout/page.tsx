"use client";

import { useEffect, useState } from "react";

type Content = {
  scout: {
    title: string;
    text: string;
  };
};

export default function ScoutCMSPage() {
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

    alert("Scout section updated!");
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">

      <div>

        <p className="uppercase tracking-[0.3em] text-green-400 text-xs mb-3">
          Scout Section
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Edit Scout
        </h1>

      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl space-y-6">

        <div>
          <label className="block text-sm text-neutral-400 mb-3">
            Section Title
          </label>

          <input
            value={content.scout.title}
            onChange={(e) =>
              setContent({
                ...content,
                scout: {
                  ...content.scout,
                  title: e.target.value,
                },
              })
            }
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-green-400/30"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-3">
            Story Text
          </label>

          <textarea
            value={content.scout.text}
            onChange={(e) =>
              setContent({
                ...content,
                scout: {
                  ...content.scout,
                  text: e.target.value,
                },
              })
            }
            className="w-full min-h-[220px] rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-green-400/30"
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
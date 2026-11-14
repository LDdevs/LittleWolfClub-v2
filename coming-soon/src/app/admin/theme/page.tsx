"use client";

import { useEffect, useState } from "react";
import {
  ATMOSPHERE_THEMES,
  DEFAULT_ATMOSPHERE_SETTINGS,
  getActiveAtmosphereTheme,
  type AtmosphereSettings,
  type AtmosphereTheme,
} from "@/lib/atmosphere";

const themeDetails: Record<AtmosphereTheme, { label: string; icon: string; description: string }> = {
  spring: { label: "Spring", icon: "🌸", description: "Soft blossom petals and fresh woodland colours." },
  summer: { label: "Summer", icon: "☀️", description: "Warm golden light, sunshine and gentle drifting specks." },
  autumn: { label: "Autumn", icon: "🍂", description: "Copper, amber and golden leaves drifting through the forest." },
  winter: { label: "Winter", icon: "❄️", description: "Quiet snowfall and a cool, frosty atmosphere." },
  halloween: { label: "Halloween", icon: "🎃", description: "A playful twilight woodland with autumnal orange accents." },
  christmas: { label: "Christmas", icon: "🎄", description: "Evergreen, soft snow and festive woodland details." },
  easter: { label: "Easter", icon: "🐣", description: "Pastel blossoms and fresh spring colours." },
  bonfire: { label: "Bonfire Night", icon: "🔥", description: "Warm ember-like flecks and a cosy evening glow." },
};

export default function ThemeCMSPage() {
  const [settings, setSettings] = useState<AtmosphereSettings>(DEFAULT_ATMOSPHERE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [previewTheme, setPreviewTheme] = useState<AtmosphereTheme | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch("/api/atmosphere", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load settings");

        if (!cancelled) {
          setSettings({
            enabled: Boolean(data.enabled),
            mode: data.mode === "manual" ? "manual" : "automatic",
            manual_theme: ATMOSPHERE_THEMES.includes(data.manual_theme)
              ? data.manual_theme
              : DEFAULT_ATMOSPHERE_SETTINGS.manual_theme,
            intensity: Number.isInteger(data.intensity)
              ? Math.min(100, Math.max(0, data.intensity))
              : DEFAULT_ATMOSPHERE_SETTINGS.intensity,
          });
        }
      } catch (error) {
        if (!cancelled) setStatus(error instanceof Error ? error.message : "Could not load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSettings();
    return () => { cancelled = true; };
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin-atmosphere", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save settings");
      setStatus("Atmosphere settings saved. The live website will update shortly.");
      setPreviewTheme(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const activeTheme = previewTheme || getActiveAtmosphereTheme(settings);

  if (loading) {
    return <p className="text-neutral-400">Loading atmosphere settings...</p>;
  }

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-green-400">Website experience</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Seasonal Atmosphere</h1>
        <p className="mt-4 max-w-2xl text-neutral-400">
          Let the woodland change with the time of year. Choose automatic seasonal changes or take control yourself.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Atmosphere controls</h2>
          <p className="mt-1 text-sm text-neutral-400">These settings control the decorative particle layer across the public website.</p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div>
            <h3 className="font-semibold">Enable seasonal atmosphere</h3>
            <p className="mt-1 text-sm text-neutral-400">Switch off to remove the animated particles completely.</p>
          </div>
          <button type="button" role="switch" aria-checked={settings.enabled}
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${settings.enabled ? "bg-green-400" : "bg-neutral-700"}`}>
            <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform ${settings.enabled ? "translate-x-6" : ""}`} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setSettings({ ...settings, mode: "automatic" })}
            className={`rounded-2xl border p-5 text-left transition ${settings.mode === "automatic" ? "border-green-400/60 bg-green-400/10" : "border-white/10 bg-black/20"}`}>
            <span className="text-2xl">🗓️</span>
            <h3 className="mt-3 font-semibold">Automatic seasons</h3>
            <p className="mt-1 text-sm text-neutral-400">Spring, summer, autumn and winter change according to the calendar.</p>
          </button>
          <button type="button" onClick={() => setSettings({ ...settings, mode: "manual" })}
            className={`rounded-2xl border p-5 text-left transition ${settings.mode === "manual" ? "border-green-400/60 bg-green-400/10" : "border-white/10 bg-black/20"}`}>
            <span className="text-2xl">🎨</span>
            <h3 className="mt-3 font-semibold">Manual theme</h3>
            <p className="mt-1 text-sm text-neutral-400">Choose a season or special occasion yourself.</p>
          </button>
        </div>

        {settings.mode === "manual" && (
          <div className="space-y-3">
            <h3 className="font-semibold">Choose the active theme</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ATMOSPHERE_THEMES.map((theme) => (
                <button key={theme} type="button"
                  onClick={() => setSettings({ ...settings, manual_theme: theme })}
                  className={`rounded-2xl border p-4 text-left transition ${settings.manual_theme === theme ? "border-green-400/60 bg-green-400/10" : "border-white/10 bg-black/20 hover:bg-white/[0.05]"}`}>
                  <span className="text-2xl">{themeDetails[theme].icon}</span>
                  <span className="mt-2 block text-sm font-semibold">{themeDetails[theme].label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="intensity" className="font-semibold">Animation intensity</label>
            <span className="text-sm tabular-nums text-green-300">{settings.intensity}%</span>
          </div>
          <input id="intensity" type="range" min="0" max="100" step="5"
            value={settings.intensity}
            onChange={(event) => setSettings({ ...settings, intensity: Number(event.target.value) })}
            className="w-full accent-green-400" />
          <div className="flex justify-between text-xs text-neutral-500"><span>Subtle</span><span>Full atmosphere</span></div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold">Preview the woodland</h2>
          <p className="mt-1 text-sm text-neutral-400">Previewing a theme does not publish it. Save changes when you're happy.</p>
        </div>
        <div className="relative min-h-48 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950 via-neutral-950 to-black p-6">
          <div className="absolute inset-0 opacity-30" style={{ background: activeTheme === "winter" ? "radial-gradient(circle at 50% 0%, #bae6fd, transparent 65%)" : activeTheme === "summer" ? "radial-gradient(circle at 50% 0%, #facc15, transparent 65%)" : activeTheme === "spring" || activeTheme === "easter" ? "radial-gradient(circle at 50% 0%, #f9a8d4, transparent 65%)" : activeTheme === "halloween" || activeTheme === "bonfire" ? "radial-gradient(circle at 50% 0%, #f97316, transparent 65%)" : "radial-gradient(circle at 50% 0%, #b45309, transparent 65%)" }} />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.25em] text-green-200/70">Little Wolf woodland</p>
            <p className="mt-3 text-3xl font-black">{themeDetails[activeTheme].icon} {themeDetails[activeTheme].label}</p>
            <p className="mt-2 max-w-lg text-sm text-neutral-300">{themeDetails[activeTheme].description}</p>
            <p className="mt-5 text-xs text-neutral-400">Intensity: {settings.intensity}% · {settings.enabled ? "Atmosphere enabled" : "Atmosphere disabled"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {ATMOSPHERE_THEMES.map((theme) => (
            <button key={theme} type="button" onClick={() => setPreviewTheme(theme)}
              className={`rounded-full border px-3 py-2 text-xs transition ${previewTheme === theme ? "border-green-400 bg-green-400/10 text-green-200" : "border-white/10 text-neutral-300 hover:bg-white/5"}`}>
              {themeDetails[theme].icon} {themeDetails[theme].label}
            </button>
          ))}
          <button type="button" onClick={() => setPreviewTheme(null)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-neutral-400 hover:bg-white/5">Use selected setting</button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={saveSettings} disabled={saving}
          className="rounded-full bg-green-400 px-8 py-4 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Saving..." : "Save & publish atmosphere"}
        </button>
        {status && <p role="status" className="text-sm text-neutral-300">{status}</p>}
      </div>
    </div>
  );
}

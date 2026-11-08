
"use client";

import { useEffect, useState } from "react";

type Announcement = {
    message: string;
    is_enabled: boolean;
    background_color: string;
    text_color: string;
};

const defaultBackground = "#0a0a0a";
const defaultText = "#bbf7d0";
const hexPattern = /^#[0-9A-Fa-f]{6}$/;

export default function AnnouncementCMSPage() {
    const [announcement, setAnnouncement] = useState<Announcement>({
        message: "",
        is_enabled: true,
        background_color: defaultBackground,
        text_color: defaultText,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadAnnouncement() {
            try {
                const res = await fetch("/api/announcement", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load announcement");
                }

                if (!cancelled) {
                    setAnnouncement({
                        ...data,
                        background_color: data.background_color || defaultBackground,
                        text_color: data.text_color || defaultText,
                    });
                }
            } catch (err) {
                console.error(err);

                if (!cancelled) {
                    setStatus("Could not load announcement settings.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadAnnouncement();

        return () => {
            cancelled = true;
        };
    }, []);

    const saveChanges = async () => {
        setSaving(true);
        setStatus("");

        try {
            const res = await fetch("/api/admin-announcement", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(announcement),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save announcement");
            }

            setStatus("Announcement settings saved successfully!");
        } catch (err) {
            console.error(err);

            setStatus(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while saving."
            );
        } finally {
            setSaving(false);
        }
    };

    const updateColour = (
        field: "background_color" | "text_color",
        value: string
    ) => {
        setAnnouncement({
            ...announcement,
            [field]: value,
        });
    };

    const coloursValid =
        hexPattern.test(announcement.background_color) &&
        hexPattern.test(announcement.text_color);

    if (loading) {
        return (
            <div className="text-neutral-400">
                Loading announcement settings...
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8">

            <div>
                <p className="uppercase tracking-[0.3em] text-green-400 text-xs mb-3">
                    Website Settings
                </p>

                <h1 className="text-5xl font-black tracking-tight">
                    Announcement Banner
                </h1>

                <p className="text-neutral-400 mt-4 text-lg">
                    Manage the message and appearance of your website announcement.
                </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 backdrop-blur-xl space-y-6">

                {/* MESSAGE */}
                <div>
                    <label className="block text-sm text-neutral-400 mb-3">
                        Announcement Message
                    </label>

                    <textarea
                        value={announcement.message}
                        maxLength={250}
                        onChange={(e) =>
                            setAnnouncement({
                                ...announcement,
                                message: e.target.value,
                            })
                        }
                        placeholder="Enter your announcement..."
                        className="w-full min-h-[120px] rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-green-400/30 resize-y"
                    />

                    <p className="text-xs text-neutral-500 mt-2 text-right">
                        {announcement.message.length}/250 characters
                    </p>
                </div>

                {/* COLOUR SETTINGS */}
                <div className="space-y-5">

                    <div>
                        <h2 className="font-semibold text-lg">
                            Banner Colours
                        </h2>

                        <p className="text-sm text-neutral-400 mt-1">
                            Choose colours to match your announcement or promotion.
                        </p>
                    </div>

                    {/* BACKGROUND COLOUR */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">

                        <label className="block text-sm font-semibold">
                            Background Colour
                        </label>

                        <div className="flex flex-wrap items-center gap-4">

                            <input
                                type="color"
                                value={
                                    hexPattern.test(announcement.background_color)
                                        ? announcement.background_color
                                        : defaultBackground
                                }
                                onChange={(e) =>
                                    updateColour("background_color", e.target.value)
                                }
                                aria-label="Choose banner background colour"
                                className="w-14 h-12 rounded-lg cursor-pointer bg-transparent border-0"
                            />

                            <input
                                type="text"
                                value={announcement.background_color}
                                maxLength={7}
                                onChange={(e) =>
                                    updateColour("background_color", e.target.value)
                                }
                                aria-label="Background colour HEX code"
                                placeholder="#0a0a0a"
                                className="w-32 rounded-xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm font-mono uppercase outline-none focus:border-green-400/40"
                            />

                        </div>

                        <p className="text-xs text-neutral-500">
                            Controls the background behind your announcement.
                        </p>
                    </div>

                    {/* TEXT COLOUR */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">

                        <label className="block text-sm font-semibold">
                            Text Colour
                        </label>

                        <div className="flex flex-wrap items-center gap-4">

                            <input
                                type="color"
                                value={
                                    hexPattern.test(announcement.text_color)
                                        ? announcement.text_color
                                        : defaultText
                                }
                                onChange={(e) =>
                                    updateColour("text_color", e.target.value)
                                }
                                aria-label="Choose announcement text colour"
                                className="w-14 h-12 rounded-lg cursor-pointer bg-transparent border-0"
                            />

                            <input
                                type="text"
                                value={announcement.text_color}
                                maxLength={7}
                                onChange={(e) =>
                                    updateColour("text_color", e.target.value)
                                }
                                aria-label="Text colour HEX code"
                                placeholder="#bbf7d0"
                                className="w-32 rounded-xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm font-mono uppercase outline-none focus:border-green-400/40"
                            />

                        </div>

                        <p className="text-xs text-neutral-500">
                            Controls the announcement text colour.
                        </p>
                    </div>

                    {!coloursValid && (
                        <p className="text-sm text-red-400">
                            Please enter valid six-digit HEX colours, such as #bbf7d0.
                        </p>
                    )}

                </div>

                {/* ENABLE / DISABLE */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">

                    <div>
                        <h2 className="font-semibold">
                            Show announcement banner
                        </h2>

                        <p className="text-sm text-neutral-400 mt-1">
                            Turn this off to hide the banner without deleting its message.
                        </p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={announcement.is_enabled}
                        onClick={() =>
                            setAnnouncement({
                                ...announcement,
                                is_enabled: !announcement.is_enabled,
                            })
                        }
                        className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${announcement.is_enabled
                                ? "bg-green-400"
                                : "bg-neutral-700"
                            }`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${announcement.is_enabled
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                        />
                    </button>

                </div>

                {/* LIVE PREVIEW */}
                <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-5 space-y-3">

                    <p className="text-xs uppercase tracking-widest text-green-400">
                        Live Preview
                    </p>

                    {announcement.is_enabled ? (
                        <div
                            style={{
                                backgroundColor: hexPattern.test(announcement.background_color)
                                    ? announcement.background_color
                                    : defaultBackground,
                                color: hexPattern.test(announcement.text_color)
                                    ? announcement.text_color
                                    : defaultText,
                            }}
                            className="rounded-xl border border-white/10 px-4 py-4 text-center text-sm font-medium shadow-lg"
                        >
                            🌿 {announcement.message || "Your announcement will appear here."} 🌿
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 text-center">
                            The announcement banner is currently hidden.
                        </p>
                    )}

                </div>

                {/* SAVE */}
                <button
                    type="button"
                    onClick={saveChanges}
                    disabled={
                        saving ||
                        !announcement.message.trim() ||
                        !coloursValid
                    }
                    className="rounded-full bg-green-400 text-black px-8 py-4 font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

                {status && (
                    <p className="text-sm text-neutral-300">
                        {status}
                    </p>
                )}

            </div>

        </div>
    );
}

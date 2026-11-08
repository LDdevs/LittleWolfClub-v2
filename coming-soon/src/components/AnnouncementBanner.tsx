
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Announcement = {
    message: string;
    is_enabled: boolean;
    background_color: string;
    text_color: string;
};

export default function AnnouncementBanner() {
    const pathname = usePathname();

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);


    useEffect(() => {
        let cancelled = false;

        async function loadAnnouncement() {
            try {
                const res = await fetch("/api/announcement", {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error("Failed to load announcement");
                }

                const data = await res.json();

                if (!cancelled) {
                    setAnnouncement(data);
                }
            } catch (err) {
                console.error("Announcement banner error:", err);
            }
        }

        loadAnnouncement();

        // Refresh when navigating between website pages.
        window.addEventListener("focus", loadAnnouncement);

        // Refresh when returning to the browser tab.
        document.addEventListener("visibilitychange", loadAnnouncement);

        return () => {
            cancelled = true;
            window.removeEventListener("focus", loadAnnouncement);
            document.removeEventListener("visibilitychange", loadAnnouncement);
        };
    }, [pathname]);


    // Hide the banner on the admin login screen.
    if (pathname === "/admin/login") {
        return null;
    }

    if (!announcement?.is_enabled || !announcement.message) {
        return null;
    }

    return (
        <div
            style={{
                backgroundColor: announcement.background_color || "#0a0a0a",
                color: announcement.text_color || "#bbf7d0",
            }}
            className="
                fixed
                top-[70px]
                left-0
                w-full
                z-[90]
                border-b
                border-green-400/20
                backdrop-blur-xl
                px-4
                py-2
                text-center
            "
        >
            <p className="text-xs sm:text-sm font-medium tracking-wide">
                🌿 {announcement.message} 🌿
            </p>
        </div>
    );
}

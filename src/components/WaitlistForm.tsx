"use client";

import { useState } from "react";

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error();

            setState("success");
            setEmail("");
        } catch {
            setState("error");
        }
    }

    return (
        <section className="flex flex-col items-center">
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-md gap-2 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur"
            >
                <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent px-3 py-2 outline-none text-white placeholder:text-neutral-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition"
                    disabled={state === "loading"}
                >
                    {state === "loading" ? "..." : "Join"}
                </button>
            </form>

            <div className="mt-3 text-sm text-neutral-400">
                {state === "success" && "You're on the list 🎉"}
                {state === "error" && "Something went wrong"}
            </div>
        </section>
    );
}
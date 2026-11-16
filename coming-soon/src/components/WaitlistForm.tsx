
"use client";

import { useState } from "react";

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [marketingConsent, setMarketingConsent] = useState(false);
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    marketingConsent,
                }),
            });

            if (!res.ok) throw new Error();

            setState("success");
            setEmail("");
            setMarketingConsent(false);
        } catch {
            setState("error");
        }
    }

    return (
        <section className="flex flex-col items-center w-full">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-md gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur"
            >
                <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full bg-transparent px-3 py-2 outline-none text-white placeholder:text-neutral-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="flex items-start gap-3 text-sm text-neutral-300 cursor-pointer">
                    <input
                        type="checkbox"
                        required
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-1 accent-green-500"
                    />
                    <span>
                        I agree to receive email updates from Little Wolf Pack.
                        I understand that I can withdraw my consent at any time.
                    </span>
                </label>

                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition disabled:opacity-50"
                    disabled={state === "loading"}
                >
                    {state === "loading" ? "Joining..." : "Join the Pack"}
                </button>
            </form>

            <div className="mt-3 text-sm text-neutral-400 text-center">
                {state === "success" && "You're on the list 🎉"}
                {state === "error" && "Something went wrong. Please try again."}
            </div>
        </section>
    );
}

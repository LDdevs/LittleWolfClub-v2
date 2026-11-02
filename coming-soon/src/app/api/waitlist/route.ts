import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, marketingConsent, website } = body;

        if (typeof website === "string" && website.trim() !== "") {
            return NextResponse.json(
                { success: true, message: "Welcome to the Pack!" },
                { status: 200 }
            );
        }

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof marketingConsent !== "boolean"
        ) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        if (!marketingConsent) {
            return NextResponse.json(
                { error: "Please agree to receive email updates to join the waitlist." },
                { status: 400 }
            );
        }

        const normalisedEmail = email.trim().toLowerCase();

        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            normalisedEmail
        );

        if (!emailIsValid || normalisedEmail.length > 254) {
            return NextResponse.json(
                { error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("waitlist")
            .insert({
                email: normalisedEmail,
                marketing_consent: true,
                consent_at: new Date().toISOString(),
            });

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { success: true, message: "You're already on the list!" }
                );
            }

            console.error("Waitlist signup failed:", error.message);

            return NextResponse.json(
                { error: "We couldn't add you just now. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Welcome to the Pack!" },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Invalid request. Please try again." },
            { status: 400 }
        );
    }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("site_announcement")
            .select("message, is_enabled, background_color, text_color")
            .eq("id", true)
            .single();

        if (error) {
            console.error("Announcement fetch error:", error);

            return NextResponse.json(
                { error: "Failed to load announcement" },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("Announcement API error:", err);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
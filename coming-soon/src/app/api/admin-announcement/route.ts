
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request) {
    try {
        const isAdmin = await verifyAdminSession();

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorised" },
                { status: 401 }
            );
        }

        const body = await request.json();

        if (
            typeof body.message !== "string" ||
            typeof body.is_enabled !== "boolean" ||
            typeof body.background_color !== "string" ||
            typeof body.text_color !== "string"
        ) {
            return NextResponse.json(
                { error: "Invalid announcement settings" },
                { status: 400 }
            );
        }

        if (body.message.trim().length === 0 || body.message.length > 250) {
            return NextResponse.json(
                { error: "Message must be between 1 and 250 characters" },
                { status: 400 }
            );
        }

        const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

        if (
            !hexColorPattern.test(body.background_color) ||
            !hexColorPattern.test(body.text_color)
        ) {
            return NextResponse.json(
                { error: "Invalid announcement colours" },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("site_announcement")
            .update({
                message: body.message.trim(),
                is_enabled: body.is_enabled,
                background_color: body.background_color,
                text_color: body.text_color,
                updated_at: new Date().toISOString(),
            })
            .eq("id", true);

        if (error) {
            console.error("Announcement save error:", error);

            return NextResponse.json(
                { error: "Failed to save announcement" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Admin announcement API error:", err);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

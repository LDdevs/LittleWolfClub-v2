import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  ATMOSPHERE_THEMES,
  type AtmosphereMode,
  type AtmosphereTheme,
} from "@/lib/atmosphere";

export async function PATCH(request: Request) {
  try {
    const isAdmin = await verifyAdminSession();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();

    const validMode = body.mode === "automatic" || body.mode === "manual";
    const validTheme = ATMOSPHERE_THEMES.includes(body.manual_theme);
    const validIntensity =
      Number.isInteger(body.intensity) && body.intensity >= 0 && body.intensity <= 100;

    if (
      typeof body.enabled !== "boolean" ||
      !validMode ||
      !validTheme ||
      !validIntensity
    ) {
      return NextResponse.json(
        { error: "Invalid atmosphere settings" },
        { status: 400 }
      );
    }

    const settings = {
      enabled: body.enabled,
      mode: body.mode as AtmosphereMode,
      manual_theme: body.manual_theme as AtmosphereTheme,
      intensity: body.intensity,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from("site_atmosphere")
      .update(settings)
      .eq("id", true);

    if (error) {
      console.error("Atmosphere save error:", error);
      return NextResponse.json(
        { error: "Failed to save atmosphere settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin atmosphere API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

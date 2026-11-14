import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_ATMOSPHERE_SETTINGS } from "@/lib/atmosphere";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_atmosphere")
      .select("enabled, mode, manual_theme, intensity")
      .eq("id", true)
      .single();

    if (error) {
      console.error("Atmosphere fetch error:", error);
      return NextResponse.json(DEFAULT_ATMOSPHERE_SETTINGS);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Atmosphere API error:", error);
    return NextResponse.json(DEFAULT_ATMOSPHERE_SETTINGS);
  }
}

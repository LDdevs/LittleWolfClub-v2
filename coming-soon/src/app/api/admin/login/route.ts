
import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-session";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "little-wolf-pack:admin-login",
});

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (
      typeof password !== "string" ||
      !process.env.ADMIN_PASSWORD ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    await createAdminSession();

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("Admin login failed:", err);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

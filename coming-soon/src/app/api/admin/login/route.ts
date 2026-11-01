
import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-session";

export async function POST(req: Request) {
  try {
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

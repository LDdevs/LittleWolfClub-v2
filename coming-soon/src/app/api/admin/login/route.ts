import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin-session", "authenticated", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.ADMIN_SESSION_SECRET;

async function hasValidAdminSession(token?: string) {
  if (!token || !secret) {
    return false;
  }

  try {
    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isLoginPage) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin-session")?.value;
    const isLoggedIn = await hasValidAdminSession(token);

    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

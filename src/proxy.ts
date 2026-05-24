import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const isLoggedIn =
    req.cookies.get("admin-session")?.value === "authenticated";

  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // Allow login page
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
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
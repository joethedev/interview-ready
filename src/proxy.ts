import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  console.log("🟡 Proxy middleware:", pathname, "userId:", userId ? "✅ Authenticated" : "❌ Not authenticated");

  // 1️⃣ Always allow auth routes
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    console.log("🟡 Allowing auth route:", pathname);
    return NextResponse.next();
  }

  // 2️⃣ NEVER protect API routes (including webhooks)
  if (pathname.startsWith("/api")) {
    console.log("🟡 Allowing API route:", pathname);
    return NextResponse.next();
  }

  // 3️⃣ Protect pages that need authentication
  const protectedPaths = ["/dashboard", "/questions", "/feed"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !userId) {
    console.log("🔴 Redirecting to /sign-in - protected path without auth:", pathname);
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  console.log("🟡 Allowing:", pathname);
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};

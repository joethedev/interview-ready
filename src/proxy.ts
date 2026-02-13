import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

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

  if (isProtectedPath) {
    console.log("🟡 Protected path detected:", pathname);
    const { userId } = await auth();
    
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      console.log("🔴 Redirecting to:", signInUrl.toString());
      return NextResponse.redirect(signInUrl);
    }
    
    console.log("🟢 User authenticated, allowing access to:", pathname);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // 1️⃣ Always allow auth routes
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ NEVER protect API routes here
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3️⃣ Protect only pages that need it
  if (pathname.startsWith("/questions") && !userId) {
    return NextResponse.redirect(
      new URL("/sign-in", req.url)
    );
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};

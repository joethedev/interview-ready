
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Protect everything except:
     * - /
     * - /sign-in
     * - /sign-up
     * - public files
     */
    "/((?!_next|sign-in|sign-up|favicon.ico).*)",
  ],
};

"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4">
      <Link href="/" className="font-bold text-xl">
        MyCV AI
      </Link>

      <SignedOut>
        <Link href="/sign-in">Sign in</Link>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </nav>
  );
}

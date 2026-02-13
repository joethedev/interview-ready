"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, Sparkles, Users, BookOpen, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Generate", href: "/questions", icon: Sparkles },
    { name: "Public Feed", href: "/feed", icon: Users },
    { name: "Blog", href: "/blog", icon: BookOpen },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Mobile: Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-500/10 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-emerald-400" />
                      <span className="font-medium text-white">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Left on Desktop, Center on Mobile */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="text-white font-bold text-sm">IR</span>
          </div>
          <span className="hidden md:inline font-semibold text-white">
            InterviewReady
          </span>
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons - Right */}
        <div className="flex items-center gap-2">
          <SignedOut>
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-gray-300 hover:text-white hover:bg-emerald-500/10">
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden items-center gap-1">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-300 hover:text-white hover:bg-emerald-500/10" asChild>
                <Link href="/sign-in">
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">Log in</span>
                </Link>
              </Button>
              <Button size="icon" className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" asChild>
                <Link href="/sign-up">
                  <UserPlus className="h-5 w-5" />
                  <span className="sr-only">Get started</span>
                </Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;

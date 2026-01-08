import Link from "next/link";

export function Navbar({isAuthenticated}: {isAuthenticated: boolean}) {
  return (
    <header className="flex items-center justify-between px-6 py-4">

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
        <a href="#features" className="hover:text-white">
          Features
        </a>
        <a href="#pricing" className="hover:text-white">
          Pricing
        </a>
      </nav>
      <div className="font-bold text-lg">InterviewReady</div>

      

      {/* <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500">
        Start Now
      </button> */}
      {isAuthenticated ? null : (
        <div className="flex gap-4">
        <Link href="/sign-in" className="underline">
          Sign In
        </Link>
        <Link href="/sign-up" className="underline">
          Sign Up
        </Link>
      </div>
      )}
      
    </header>
  );
}

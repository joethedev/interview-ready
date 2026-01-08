import { Navbar } from "@/components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { isAuthenticated } = await auth()
  
    if (isAuthenticated) {
      redirect("/dashboard");
    }
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />

      <main className="mx-auto max-w-5xl px-6 pt-24 text-center">
        {/* Badge */}
        <div className="mx-auto mb-6 w-fit rounded-full bg-white/10 px-4 py-1 text-sm text-white/80">
          AI-powered interview preparation
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
          Ace your next interview
          <br />
          <span className="text-purple-400">with AI</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          Paste a job description and instantly get interview questions
          and quizzes tailored to the role.
        </p>

        {/* Textarea */}
        <div className="mx-auto mt-10 max-w-3xl">
          <textarea
            placeholder="Paste the job description here..."
            className="min-h-40 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button className="mt-4 w-full rounded-xl bg-purple-600 py-3 font-semibold hover:bg-purple-500">
            Generate Questions
          </button>
        </div>
      </main>
    </>
  );
}

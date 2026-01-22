import { Navbar } from "@/components/navbar";
import QuestionList from "@/components/questions/QuestionList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { generateQuestions } from "@/lib/ai/generateQuestions";

export default async function QuestionsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const jobDescription = "La mission s’inscrit dans le cadre de la Plateforme Data...";
  const questions = await generateQuestions(jobDescription);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-24">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Generated Interview Questions
        </h1>

        <p className="mt-3 max-w-2xl text-white/70">
          Review these questions and answers to prepare for your interview.
        </p>

        <QuestionList questions={questions} />
      </main>
    </>
  );
}

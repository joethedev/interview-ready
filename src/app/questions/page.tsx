import { Navbar } from "@/components/navbar";
import QuestionList from "@/components/questions/QuestionList";
import { InterviewQuestion } from "@/lib/mockQuestions";

const jobDescription = "La mission s’inscrit dans le cadre de la Plateforme Data, qui vise à centraliser les données du SI et à fournir des API pour leur exploitation en temps réel. Le consultant interviendra sur la conception et le développement back-end (Node.js / Express / NestJS) et front-end (React / Next.js), la création et l’optimisation d’API REST/GraphQL, l’intégration continue, ainsi que l’amélioration continue du code et des performances applicatives."

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const response = await fetch(`${baseUrl}/api/questions`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ jobDescription }),
});

console.log("bonjouuuur")

const data = await response.json();
const questions: InterviewQuestion[] = data.questions;

export default function QuestionsPage() {
  return (
    <>
      <Navbar isAuthenticated={false} />

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

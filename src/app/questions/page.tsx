"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionList from "@/components/questions/QuestionList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctAnswers: number[]; 
  explanation: string;
};

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("questions");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
  }, []);

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 pt-24">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            No Questions Generated
          </h1>
          <p className="text-muted-foreground mb-8">
            Go back to the dashboard to generate interview questions
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        Your Interview Questions
      </h1>
      <p className="text-muted-foreground mb-8">
        {questions.length} questions generated
      </p>

      <QuestionList questions={questions} />
    </main>
  );
}

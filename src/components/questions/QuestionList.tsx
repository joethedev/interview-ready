import QuestionCard from "./QuestionCard";
import { InterviewQuestion } from "@/lib/mockQuestions";

type Props = {
  questions: InterviewQuestion[];
};

export default function QuestionList({ questions }: Props) {
  return (
    <div className="mt-10 space-y-6">
      {questions && questions.map((q, index) => (
        <div key={index} className="w-full">
          <QuestionCard
            question={q.question}
            options={q.options}
            correctAnswers={q.correctAnswers}
            explanation={q.explanation}
          />
        </div>
      ))}
    </div>
  );
}

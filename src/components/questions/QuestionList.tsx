import QuestionCard from "./QuestionCard";
import { InterviewQuestion } from "@/lib/mockQuestions";

type Props = {
  questions: InterviewQuestion[];
};

export default function QuestionList({ questions }: Props) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {questions && questions.map((q, index) => (
        <QuestionCard
          key={index}
          question={q.question}
          answer={q.answer}
        />
      ))}
    </div>
  );
}

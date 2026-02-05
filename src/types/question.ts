export type Question = {
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

export type QuestionSet = {
  id: string;
  userId: string;
  jobDescription: string;
  questions: Question[];
  isPublic: boolean;
  expiresAt: string | null;
  createdAt: string;
};

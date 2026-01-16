export type InterviewQuestion = {
  question: string;
  answer: string;
};

export const mockQuestions: InterviewQuestion[] = [
  {
    question: "What is React Server Components?",
    answer:
      "React Server Components allow rendering components on the server, reducing bundle size and improving performance.",
  },
  {
    question: "What is the difference between useEffect and useLayoutEffect?",
    answer:
      "useEffect runs after paint, while useLayoutEffect runs synchronously before the browser paints.",
  },
  {
    question: "Explain the concept of lifting state up.",
    answer:
      "Lifting state up means moving shared state to the closest common parent component.",
  },
];

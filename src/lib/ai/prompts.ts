export function interviewQuestionsPrompt(jobDescription: string) {
  return `
You are a senior technical interviewer.

Generate 5 interview questions based on the following job description.
Each question must include:
- question
- short expected answer

Return the result as valid JSON in this format:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Job description:
${jobDescription}
`;
}

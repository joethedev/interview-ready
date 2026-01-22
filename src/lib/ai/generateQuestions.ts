import { openai } from "@/lib/ai/client";
import { interviewQuestionsPrompt } from "@/lib/ai/prompts";

export async function generateQuestions(jobDescription: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional technical interviewer." },
      { role: "user", content: interviewQuestionsPrompt(jobDescription) },
    ],
  });

  let raw = completion.choices[0].message.content ?? "[]";
  raw = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(raw);
}

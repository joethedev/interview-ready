import { NextResponse } from "next/server";
import { openai } from "@/lib/ai/client";
import { interviewQuestionsPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { jobDescription } = await req.json();

  if (!jobDescription || jobDescription.length < 30) {
    return NextResponse.json(
      { error: "Job description too short" },
      { status: 400 }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional technical interviewer.",
      },
      {
        role: "user",
        content: interviewQuestionsPrompt(jobDescription),
      },
    ],
  });

  let raw = completion.choices[0].message.content;

  // Remove Markdown code block markers if present
  if (raw) {
    raw = raw.replace(/```json|```/g, "").trim();
  }

  console.log("raw", raw);

  return NextResponse.json({
    questions: JSON.parse(raw ?? "[]"),
  });
}

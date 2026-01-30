import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { jobDescription } = await req.json();

  if (!jobDescription || jobDescription.length < 30) {
    return NextResponse.json(
      { error: "Invalid job description" },
      { status: 400 }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3, // important for consistency
    messages: [
      {
        role: "system",
        content:
          "You are a senior technical interviewer. You ONLY return valid JSON.",
      },
      {
        role: "user",
        content: `
Generate exactly 5 interview questions based on the skills in the job description below.

Each question MUST be multiple-choice.

STRICT RULES:
- You ONLY generate questions for IT / software engineering roles.
If the role is not IT-related, return:
{ "error": "NOT_IT_ROLE" }
- NEVER ask questions about the job description itself.
- Return VALID JSON ONLY
- No markdown
- No extra text
- 4 options per question
- correctAnswers must be an array of indexes (0-based)

JSON format:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswers": [number],
    "explanation": "string"
  }
]

Job description:
${jobDescription}
        `,
      },
    ],
  });

  let raw = completion.choices[0].message.content ?? "[]";

  // Safety cleanup
  raw = raw.replace(/```json|```/g, "").trim();

  let questions;
  try {
    questions = JSON.parse(raw);
  } catch (error) {
    return NextResponse.json(
      { error: "AI response parsing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ questions });
}

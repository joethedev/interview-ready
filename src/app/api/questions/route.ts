import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { saveQuestionSet } from "@/lib/supabase/server";

import {
  GenerateQuestionsSchema,
  QuestionsArraySchema,
} from "@/dto/question-set.schema";

import type {
  GenerateQuestionsDTO,
  GenerateQuestionsResponseDTO,
} from "@/dto/question-set.dto";
import z from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // 1️⃣ Auth
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Validate request body
  let body: GenerateQuestionsDTO & { saveQuestions?: boolean };
  try {
    body = GenerateQuestionsSchema.extend({
      saveQuestions: z.boolean().optional(),
    }).parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const { jobDescription, saveQuestions } = body;

  // 3️⃣ Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a senior technical interviewer. You ONLY return valid JSON.",
      },
      {
        role: "user",
        content: `
Generate exactly 10 interview questions based on the skills in the job description below.

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

  let raw = completion.choices[0].message.content ?? "";

  raw = raw.replace(/```json|```/g, "").trim();

  // 4️⃣ Handle NOT_IT_ROLE explicitly
  if (raw.includes("NOT_IT_ROLE")) {
    return NextResponse.json(
      { error: "NOT_IT_ROLE" },
      { status: 400 }
    );
  }

  // 5️⃣ Parse AI JSON
  let questions;
  try {
    questions = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "AI response parsing failed" },
      { status: 500 }
    );
  }

  // 6️⃣ Validate AI output with Zod
  const validation = QuestionsArraySchema.safeParse(questions);

  if (!validation.success) {
    console.error(validation.error);
    return NextResponse.json(
      { error: "AI returned invalid structure" },
      { status: 500 }
    );
  }

  // 7️⃣ Save to database if requested
  let saved = false;
  let questionSetId: string | undefined;

  if (saveQuestions) {
    try {
      const result = await saveQuestionSet(userId, jobDescription, validation.data, false);
      saved = true;
      questionSetId = result.id;
    } catch (error) {
      console.error("Failed to save questions:", error);
      // Continue even if save fails - user still gets the questions
    }
  }

  // 8️⃣ Final typed response
  const response: GenerateQuestionsResponseDTO = {
    questions: validation.data,
    saved,
    questionSetId,
  };

  return NextResponse.json(response);
}

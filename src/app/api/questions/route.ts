import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

// Increase timeout for AI generation
export const maxDuration = 30; // seconds

import {
  GenerateQuestionsSchema,
  AIResponseSchema,
} from "@/dto/question-set.schema";
import { isLikelyIT } from "@/lib/isITJobDescription";

import type {
  GenerateQuestionsDTO,
  GenerateQuestionsResponseDTO,
} from "@/dto/question-set.dto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function extractLikelyJson(content: string): string {
  const cleaned = content.replace(/```json|```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function normalizeAIResponse(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const input = payload as {
    jobTitle?: unknown;
    summarizedJobDescription?: unknown;
    questions?: unknown;
  };

  const rawQuestions = Array.isArray(input.questions) ? input.questions : [];

  const normalizedQuestions = rawQuestions.slice(0, 10).map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

    const rawOptions = Array.isArray(source.options)
      ? source.options.filter((option) => typeof option === "string")
      : [];

    const options = [...rawOptions]
      .slice(0, 4)
      .map((option) => (option as string).trim())
      .filter(Boolean);

    while (options.length < 4) {
      options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }

    const rawCorrectAnswers = Array.isArray(source.correctAnswers)
      ? source.correctAnswers
      : typeof source.correctAnswers === "number"
        ? [source.correctAnswers]
        : [];

    const correctAnswers = rawCorrectAnswers
      .filter((answer) => typeof answer === "number" && Number.isInteger(answer))
      .map((answer) => answer as number)
      .filter((answer) => answer >= 0 && answer < options.length);

    return {
      question:
        typeof source.question === "string" && source.question.trim().length > 0
          ? source.question.trim()
          : `Question ${index + 1}`,
      options,
      correctAnswers,
      explanation:
        typeof source.explanation === "string" && source.explanation.trim().length > 0
          ? source.explanation.trim()
          : "No explanation provided.",
    };
  });

  return {
    jobTitle:
      typeof input.jobTitle === "string" && input.jobTitle.trim().length > 0
        ? input.jobTitle.trim()
        : "Software Engineer",
    summarizedJobDescription:
      typeof input.summarizedJobDescription === "string" && input.summarizedJobDescription.trim().length > 0
        ? input.summarizedJobDescription.trim()
        : "",
    questions: normalizedQuestions,
  };
}

export async function POST(req: Request) {
  // 1️⃣ Auth
  const { userId } = await auth();

  console.log("userId*******************:", userId)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Validate request body
  let body: GenerateQuestionsDTO;
  try {
    body = GenerateQuestionsSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const { jobDescription } = body;

  if (!isLikelyIT(jobDescription)) {
    return NextResponse.json({ error: "NOT_IT_ROLE" }, { status: 400 });
  }

  const stylePool = [
    "scenario-based",
    "debugging",
    "architecture",
    "code-reading",
    "trade-off analysis",
    "performance",
  ];

  const shuffledStyles = [...stylePool].sort(() => Math.random() - 0.5);
  const styleMix = shuffledStyles.slice(0, 3).join(", ");
  const variationTag = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  // 3️⃣ Run question generation and summarization in parallel
  let lastError = "AI generation failed";

  for (let attempt = 1; attempt <= 2; attempt++) {
    const isRetry = attempt > 1;

    let raw = "";
    let summarizedJobDescription = "";

    try {
      // Run both calls simultaneously — questions get their full token budget,
      // summarization runs in a dedicated low-token call.
      const [completion, summaryCompletion] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: isRetry ? 0.5 : 0.9,
          top_p: isRetry ? 0.9 : 0.95,
          frequency_penalty: isRetry ? 0.3 : 0.6,
          presence_penalty: isRetry ? 0.3 : 0.5,
          max_tokens: 2000,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a senior technical interviewer. You ONLY return valid JSON.",
            },
            {
              role: "user",
              content: `
                  Variation tag: ${variationTag}
                  Style mix to emphasize: ${styleMix}

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
                  - Use varied wording and avoid repeating common question templates
                  - Ensure question stems are distinct from one another

                  JSON format:
                  {
                    "jobTitle": "Suggested Job Title Based on Description",
                    "questions": [
                      {
                        "question": "string",
                        "options": ["string", "string", "string", "string"],
                        "correctAnswers": [number],
                        "explanation": "string"
                      }
                    ]
                  }
                  Job description:
                  ${jobDescription}
        `,
            },
          ],
        }),
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content:
                "You are a data sanitization assistant. Extract only the technical skills, tools, technologies, and responsibilities from job descriptions. Remove ALL company names, contact details (emails, phone numbers, URLs, addresses), recruiter names, salary info, and any personally identifiable information. Return only plain text — no JSON, no markdown.",
            },
            {
              role: "user",
              content: `Summarize the following job description into a concise, keyword-rich paragraph containing only technical requirements and responsibilities:\n\n${jobDescription}`,
            },
          ],
        }),
      ]);

      raw = extractLikelyJson(completion.choices[0].message.content ?? "");
      summarizedJobDescription = (summaryCompletion.choices[0].message.content ?? "").trim();
    } catch (error) {
      console.error("OpenAI generation failed:", error);
      lastError = "AI generation failed";
      continue;
    }

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
      console.error("Failed AI raw payload:", raw);
      lastError = "AI response parsing failed";
      continue;
    }

    // Attach the summarized description to the parsed payload so normalizeAIResponse can handle it
    questions.summarizedJobDescription = summarizedJobDescription || jobDescription;

    // 6️⃣ Validate AI output with Zod
    const validation = AIResponseSchema.safeParse(questions);

    if (!validation.success) {
      const normalizedValidation = AIResponseSchema.safeParse(
        normalizeAIResponse(questions)
      );

      if (normalizedValidation.success) {
        const response: GenerateQuestionsResponseDTO = {
          jobTitle: normalizedValidation.data.jobTitle,
          summarizedJobDescription: normalizedValidation.data.summarizedJobDescription,
          questions: normalizedValidation.data.questions,
        };

        return NextResponse.json(response);
      }

      console.error(validation.error);
      lastError = "AI returned invalid structure";
      continue;
    }

    // 7️⃣ Return questions, job title, and summarized job description
    const response: GenerateQuestionsResponseDTO = {
      jobTitle: validation.data.jobTitle,
      summarizedJobDescription: validation.data.summarizedJobDescription,
      questions: validation.data.questions,
    };

    return NextResponse.json(response);
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}

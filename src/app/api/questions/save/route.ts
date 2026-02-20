import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { saveQuestionSet } from "@/lib/supabase/server";
import { QuestionsArraySchema } from "@/dto/question-set.schema";
import z from "zod";

const SaveQuestionsSchema = z.object({
  jobTitle: z.string().min(1),
  summarizedJobDescription: z.string().min(1),
  questions: QuestionsArraySchema,
  isPublic: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  // 1️⃣ Auth
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Validate request body
  let body: z.infer<typeof SaveQuestionsSchema>;
  try {
    body = SaveQuestionsSchema.parse(await req.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const { jobTitle, summarizedJobDescription, questions, isPublic } = body;

  // 3️⃣ Save to database
  try {
    const result = await saveQuestionSet(
      userId,
      jobTitle,
      summarizedJobDescription,
      questions,
      isPublic
    );

    return NextResponse.json({
      success: true,
      questionSetId: result.id,
      createdAt: result.createdAt,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Failed to save questions:", error);
    return NextResponse.json(
      { error: "Failed to save questions" },
      { status: 500 }
    );
  }
}

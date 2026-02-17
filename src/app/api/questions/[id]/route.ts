import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/server";
import z from "zod";

const UpdateQuestionSetSchema = z.object({
  isPublic: z.boolean(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1️⃣ Auth
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Await params
  const { id } = await params;
  const questionSetId = id;

  // 3️⃣ Validate request body
  let body: z.infer<typeof UpdateQuestionSetSchema>;
  try {
    body = UpdateQuestionSetSchema.parse(await req.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const { isPublic } = body;

  // 3️⃣ Update in database (ensure user owns this question set)
  try {
    const { data, error } = await supabase
      .from("question_sets")
      .update({ is_public: isPublic })
      .eq("id", questionSetId)
      .eq("user_id", userId)
      .select("id, is_public")
      .single();

    if (error) {
      console.error("Error updating question set:", error);
      return NextResponse.json(
        { error: "Failed to update question set" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Question set not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      questionSetId: data.id,
      isPublic: data.is_public,
    });
  } catch (error) {
    console.error("Failed to update question set:", error);
    return NextResponse.json(
      { error: "Failed to update question set" },
      { status: 500 }
    );
  }
}

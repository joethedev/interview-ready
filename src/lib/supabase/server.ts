import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ server only
);

export async function saveQuestionSet(
  userId: string,
  jobDescription: string,
  questions: any[],
  isPublic: boolean = false
) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      user_id: userId,
      job_description: jobDescription,
      questions,
      is_public: isPublic,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving question set:", error);
    throw error;
  }

  return data;
}

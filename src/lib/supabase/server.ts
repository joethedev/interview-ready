import { createClient } from "@supabase/supabase-js";
import type { Question } from "@/types/question";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ server only
);

export async function saveQuestionSet(
  userId: string,
  jobTitle: string,
  summarizedJobDescription: string,
  questions: Question[],
  isPublic: boolean = false
): Promise<{ id: string; createdAt: string; expiresAt: string }> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  // Direct insert using Supabase client
  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      user_id: userId,
      job_title: jobTitle,
      job_description: summarizedJobDescription,
      questions: questions,
      is_public: isPublic,
      expires_at: expiresAt.toISOString(),
    })
    .select("id, created_at, expires_at")
    .single();

  if (error) {
    console.error("Error saving question set:", error);
    throw error;
  }

  return {
    id: data.id,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
  };
}

export async function getQuestionSetsByUserId(userId: string) {
  const { data, error } = await supabase
    .from("question_sets")
    .select(
      "id, job_description, questions, is_public, expires_at, created_at"
    )
    .eq("user_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching question sets:", error);
    throw error;
  }

  return data?.map((row) => ({
    id: row.id,
    jobDescription: row.job_description,
    questions: row.questions,
    isPublic: row.is_public,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  })) ?? [];
}

export async function getQuestionSetById(id: string, userId: string) {
  const { data, error } = await supabase
    .from("question_sets")
    .select(
      "id, job_description, questions, is_public, expires_at, created_at"
    )
    .eq("id", id)
    .or(`user_id.eq.${userId},is_public.eq.true`)
    .single();

  if (error) {
    console.error("Error fetching question set:", error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    jobDescription: data.job_description,
    questions: data.questions,
    isPublic: data.is_public,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
  };
}

export async function getPublicQuestionSets() {
  const { data, error } = await supabase
    .from("question_sets")
    .select("id, job_description, job_title, questions, created_at")
    .eq("is_public", true)
    // Filter out expired ones
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching public feeds:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    jobDescription: row.job_description,
    jobTitle: row.job_title,
    questions: row.questions,
    createdAt: row.created_at,
  }));
}

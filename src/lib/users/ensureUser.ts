import { supabase } from "@/lib/supabase/server";

export async function ensureUser(clerkUserId: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (user) return user;

  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      clerk_user_id: clerkUserId,
      plan: "FREE",
    })
    .select()
    .single();

  if (error) throw error;

  return newUser;
}

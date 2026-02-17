import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get count of all question sets for user
    const { count: totalCount, error: totalError } = await supabase
      .from("question_sets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (totalError) {
      console.error("Error fetching total count:", totalError);
      return NextResponse.json(
        { error: "Failed to fetch statistics" },
        { status: 500 }
      );
    }

    // Get count of saved (non-expired) question sets
    const { count: savedCount, error: savedError } = await supabase
      .from("question_sets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (savedError) {
      console.error("Error fetching saved count:", savedError);
      return NextResponse.json(
        { error: "Failed to fetch statistics" },
        { status: 500 }
      );
    }

    // Get count of public question sets
    const { count: publicCount, error: publicError } = await supabase
      .from("question_sets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_public", true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (publicError) {
      console.error("Error fetching public count:", publicError);
      return NextResponse.json(
        { error: "Failed to fetch statistics" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      questionsGenerated: totalCount || 0,
      questionsSaved: savedCount || 0,
      publicQuestions: publicCount || 0,
    });
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

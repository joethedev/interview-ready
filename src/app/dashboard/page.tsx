import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PlanCard from "@/components/dashboard/PlanCard";
import ActionsCard from "@/components/dashboard/ActionsCard";
import { ensureUser } from "@/lib/users/ensureUser";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await ensureUser(userId);
  const isPremium = dbUser.plan === "PREMIUM";

  // ✅ Simulated plan (later from DB)
  const userPlan: "FREE" | "PREMIUM" = isPremium ? "PREMIUM" : "FREE";

  return (
    <main className="mx-auto max-w-6xl px-6 pt-24">
      {isPremium && (
        <div className="mb-6 rounded-lg bg-green-600/10 p-4 text-center text-sm text-green-300">
          🎉 You are a Premium user! Enjoy your benefits.
        </div>
      )}
      <DashboardHeader />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <PlanCard plan={userPlan} />
        <ActionsCard plan={userPlan} />
      </div>
    </main>
  );
}

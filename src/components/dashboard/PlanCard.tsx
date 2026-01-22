export default function PlanCard({
  plan,
}: {
  plan: "FREE" | "PREMIUM";
}) {
  const isPremium = plan === "PREMIUM";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">
        Your Plan
      </h2>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold">
          {isPremium ? "Premium 🚀" : "Free"}
        </span>

        {!isPremium && (
          <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-400">
            Upgrade available
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-white/70">
        <li>✓ Access public questions</li>
        <li className={!isPremium ? "opacity-40" : ""}>
          ✓ Generate interview questions
        </li>
        <li className={!isPremium ? "opacity-40" : ""}>
          ✓ Save questions for 30 days
        </li>
      </ul>
    </div>
  );
}

import Link from "next/link";

export default function ActionsCard({
  plan,
}: {
  plan: "FREE" | "PREMIUM";
}) {
  const isPremium = plan === "PREMIUM";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">
        Actions
      </h2>

      <div className="mt-6 space-y-3">
        {isPremium ? (
          <Link
            href="/questions"
            className="block rounded-xl bg-purple-600 py-3 text-center font-semibold hover:bg-purple-500"
          >
            Generate Interview Questions
          </Link>
        ) : (
          <button
            disabled
            className="w-full rounded-xl bg-purple-600/30 py-3 font-semibold opacity-60"
          >
            Premium required
          </button>
        )}

        <Link
          href="/questions/public"
          className="block text-center text-sm text-purple-400 hover:underline"
        >
          Browse public questions
        </Link>
      </div>
    </div>
  );
}

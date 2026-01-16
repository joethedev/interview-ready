import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0€",
    description: "Try the basics",
    features: [
      "Limited question generation",
      "1 quiz per day",
      "Basic difficulty",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19€ / month",
    description: "Serious interview preparation",
    features: [
      "Unlimited question generation",
      "Unlimited quizzes",
      "Difficulty levels",
      "Priority AI model",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-secondary">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when you’re ready.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.highlighted
                  ? "bg-card shadow-glow border-primary"
                  : "bg-card"
              }`}
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6 text-4xl font-bold">
                {plan.price}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-semibold ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground"
                    : "border"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

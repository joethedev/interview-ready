import { Brain, FileText, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-generated interview questions",
    description:
      "Paste a job description and instantly get realistic interview questions tailored to the role.",
  },
  {
    icon: FileText,
    title: "Knowledge quizzes by domain",
    description:
      "Test yourself with AI-generated quizzes in frontend, backend, DevOps, or any field.",
  },
  {
    icon: Target,
    title: "Focus on what matters",
    description:
      "Questions are ranked by importance so you don’t waste time on irrelevant topics.",
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Everything you need to prepare smarter
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Stop guessing what to study. Let AI guide your preparation.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-8 shadow-card"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

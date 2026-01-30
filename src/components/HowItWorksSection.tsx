import { FileText, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "Paste the job description",
    description: "Copy and paste the job posting you're applying for.",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "AI generates questions",
    description: "Get role-specific interview questions in seconds.",
  },
  {
    icon: CheckCircle,
    step: "3",
    title: "Practice with answers",
    description: "Review suggested answers tailored to the role.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-surface-elevated">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three simple steps to interview confidence
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative p-6 rounded-xl bg-card border border-border shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-sm font-medium text-tertiary">Step {step.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

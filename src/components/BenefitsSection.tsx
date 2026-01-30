import { Clock, Target, Brain } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save hours of prep time",
    description: "No more guessing what they'll ask. Get focused questions based on the actual job.",
  },
  {
    icon: Target,
    title: "Role-specific preparation",
    description: "Questions tailored to the exact position, skills, and company context.",
  },
  {
    icon: Brain,
    title: "Learn how to answer well",
    description: "Suggested answers help you structure your thoughts and speak confidently.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-surface-elevated">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Why use InterviewPrep
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-5">
                <benefit.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

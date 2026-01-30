import { ArrowRight } from "lucide-react";

const ExampleSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From job description to interview-ready in seconds
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Input: Job Description */}
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden animate-fade-in">
              <div className="px-5 py-4 border-b border-border bg-surface-elevated">
                <span className="text-sm font-medium text-foreground">Job Description</span>
              </div>
              <div className="p-5">
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p><strong className="text-foreground">Senior Product Manager</strong></p>
                  <p>We're looking for a PM to lead our growth team. You'll work with engineering and design to define roadmaps, run experiments, and ship features that improve retention.</p>
                  <p className="text-tertiary">Requirements: 4+ years in product, experience with A/B testing, strong analytical skills...</p>
                </div>
              </div>
            </div>

            {/* Output: Generated Questions */}
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <div className="px-5 py-4 border-b border-border bg-surface-elevated">
                <span className="text-sm font-medium text-foreground">Generated Questions</span>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    1. Describe an A/B test that didn't go as expected. What did you learn?
                  </p>
                  <p className="text-sm text-muted-foreground bg-accent/50 rounded-lg p-3">
                    <span className="text-xs font-medium text-accent-foreground block mb-1">Suggested answer:</span>
                    "At my previous role, we tested a simplified onboarding flow expecting higher completion rates..."
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    2. How do you prioritize features when you have limited engineering resources?
                  </p>
                  <p className="text-sm text-muted-foreground bg-accent/50 rounded-lg p-3">
                    <span className="text-xs font-medium text-accent-foreground block mb-1">Suggested answer:</span>
                    "I use a combination of impact vs. effort scoring and work closely with stakeholders to..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleSection;

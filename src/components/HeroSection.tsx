import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6 animate-fade-in">
            Prepare for interviews{" "}
            <span className="gradient-text">in minutes, not hours</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Paste a job description. Get tailored interview questions and strong answers — powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero">
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="hero-outline">
              See how it works
            </Button>
          </div>
          <p className="text-sm text-tertiary mt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

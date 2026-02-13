import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm animate-fade-in">
            <span className="text-sm text-emerald-400 font-medium">✨ AI-Powered Interview Prep</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 animate-fade-in">
            Prepare for interviews{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent animate-gradient">in minutes, not hours</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Paste a job description. Get tailored interview questions and strong answers — powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300">
              Create free account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm">
              See how it works
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

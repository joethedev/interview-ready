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
    <section className="py-20 relative">
      <div className="container relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Three simple steps to interview confidence
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-emerald-500/20 backdrop-blur-xl shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/5 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">Step {step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Step number background */}
              <div className="absolute -right-4 -bottom-4 text-8xl font-bold text-emerald-500/5 select-none">
                {step.step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

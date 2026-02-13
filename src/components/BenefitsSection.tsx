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
    <section className="py-20 relative">
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why use InterviewPrep
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group text-center p-8 rounded-2xl bg-gradient-to-b from-gray-900/40 to-gray-800/40 border border-gray-700/30 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-gradient-to-b hover:from-emerald-950/30 hover:to-gray-900/40 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300">
                <benefit.icon className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
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

import { ArrowRight } from "lucide-react";

const ExampleSection = () => {
  return (
    <section className="py-20 relative">
      {/* Decorative background element */}
      <div className="absolute left-0 top-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See it in action
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From job description to interview-ready in seconds
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Input: Job Description */}
            <div className="group rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in hover:border-emerald-500/30 transition-all duration-300">
              <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Job Description
                </span>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-300 leading-relaxed space-y-3">
                  <p><strong className="text-white text-base">Senior Product Manager</strong></p>
                  <p>We're looking for a PM to lead our growth team. You'll work with engineering and design to define roadmaps, run experiments, and ship features that improve retention.</p>
                  <p className="text-gray-500">Requirements: 4+ years in product, experience with A/B testing, strong analytical skills...</p>
                </div>
              </div>
            </div>

            {/* Output: Generated Questions */}
            <div className="group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 to-gray-900/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 overflow-hidden animate-fade-in hover:shadow-emerald-500/20 transition-all duration-300" style={{ animationDelay: "0.15s" }}>
              <div className="px-6 py-4 border-b border-emerald-500/30 bg-gradient-to-r from-emerald-900/30 to-gray-900/50">
                <span className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  Generated Questions
                </span>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white">
                    1. Describe an A/B test that didn't go as expected. What did you learn?
                  </p>
                  <div className="text-sm text-gray-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <span className="text-xs font-semibold text-emerald-400 block mb-2">💡 Suggested answer:</span>
                    <p className="text-gray-300">"At my previous role, we tested a simplified onboarding flow expecting higher completion rates..."</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white">
                    2. How do you prioritize features when you have limited engineering resources?
                  </p>
                  <div className="text-sm text-gray-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <span className="text-xs font-semibold text-emerald-400 block mb-2">💡 Suggested answer:</span>
                    <p className="text-gray-300">"I use a combination of impact vs. effort scoring and work closely with stakeholders to..."</p>
                  </div>
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

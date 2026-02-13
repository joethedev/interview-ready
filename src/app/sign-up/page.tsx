import { SignUp } from "@clerk/nextjs";
import { Sparkles, Target, Clock, Brain, CheckCircle, Zap, Globe } from "lucide-react";

export default function Page() {
  const benefits = [
    {
      icon: Sparkles,
      title: "AI-Powered Questions",
      description: "Get tailored interview questions generated specifically for your target role using advanced AI technology."
    },
    {
      icon: Target,
      title: "Role-Specific Preparation",
      description: "Questions are customized based on the actual job description, ensuring you're prepared for what matters."
    },
    {
      icon: Clock,
      title: "Save Hours of Prep Time",
      description: "No more guessing what they'll ask. Focus your preparation on the most relevant questions."
    },
    {
      icon: Brain,
      title: "Learn Best Answers",
      description: "Each question comes with suggested answers to help you structure your thoughts and respond confidently."
    },
    {
      icon: Zap,
      title: "Quick & Easy Setup",
      description: "Get started in minutes. Just paste a job description and receive custom questions instantly."
    },
    {
      icon: Globe,
      title: "Community Access",
      description: "Share your questions and practice with questions from other candidates preparing for similar roles."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Benefits */}
            <div className="hidden lg:block space-y-8">
              {/* Logo and Title */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <span className="text-white font-bold text-lg">IR</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white">InterviewReady</h1>
                </div>
                <p className="text-xl text-gray-300">
                  Start your interview preparation journey today
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div 
                      key={benefit.title}
                      className="flex gap-4 p-5 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-gray-900 flex items-center justify-center text-white font-semibold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    Join 1,000+ job seekers preparing smarter
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Clerk Sign Up */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                {/* Mobile Logo */}
                <div className="lg:hidden mb-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <span className="text-white font-bold text-lg">IR</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">InterviewReady</h1>
                  </div>
                  <p className="text-gray-300">Create your account to get started</p>
                </div>

                <SignUp 
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 rounded-2xl",
                      headerTitle: "text-white",
                      headerSubtitle: "text-gray-400",
                      socialButtonsBlockButton: "border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-white hover:border-emerald-500/50 transition-all",
                      formFieldLabel: "text-gray-300",
                      formFieldInput: "bg-gray-950/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500",
                      formButtonPrimary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all",
                      footerActionLink: "text-emerald-400 hover:text-emerald-300",
                      identityPreviewText: "text-white",
                      identityPreviewEditButton: "text-emerald-400 hover:text-emerald-300",
                      formResendCodeLink: "text-emerald-400 hover:text-emerald-300",
                      otpCodeFieldInput: "bg-gray-950/50 border-gray-700 text-white focus:border-emerald-500",
                      dividerLine: "bg-gray-700",
                      dividerText: "text-gray-400",
                    }
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

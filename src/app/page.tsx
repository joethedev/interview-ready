import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ExampleSection from "@/components/ExampleSection";
import BenefitsSection from "@/components/BenefitsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";

const Index = async () => {
  const user = await currentUser()
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <main className="relative z-10">
        <HeroSection />
        <HowItWorksSection />
        <ExampleSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

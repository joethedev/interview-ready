import Header from "@/components/Header";
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
  console.log(user)
  if (user) {
    console.log("Bonjouur!!");
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
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

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { AssessmentsSection } from "@/components/AssessmentsSection";
import { TrustSection } from "@/components/TrustSection";
import { FooterSection } from "@/components/FooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <AssessmentsSection />
      <TrustSection />
      <FooterSection />
    </main>
  );
}

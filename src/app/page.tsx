import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Comparison } from "@/components/site/comparison";
import { Guides } from "@/components/site/guides";
import { Pricing } from "@/components/site/pricing";
import { Faq } from "@/components/site/faq";
import { SeoContent } from "@/components/site/seo-content";
import { CtaExplore } from "@/components/site/cta-explore";
import { Footer } from "@/components/site/footer";
import { CookieBanner, ScrollTopButton } from "@/components/site/overlays";
import { ExportWizard } from "@/components/export/wizard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Comparison />
        <Guides />
        <Pricing />
        <Faq />
        <SeoContent />
        <CtaExplore />
      </main>
      <Footer />
      <CookieBanner />
      <ScrollTopButton />
      <ExportWizard />
    </div>
  );
}

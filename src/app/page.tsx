import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { HowItWorks01 } from "@/components/site/how-it-works-01";
import { HowItWorks02 } from "@/components/site/how-it-works-02";
import { HowItWorks03 } from "@/components/site/how-it-works-03";
import { Comparison } from "@/components/site/comparison";
import { Guides } from "@/components/site/guides";
import { Pricing } from "@/components/site/pricing";
import { Faq } from "@/components/site/faq";
import { SeoContent } from "@/components/site/seo-content";
import { CtaExplore } from "@/components/site/cta-explore";
import { Footer } from "@/components/site/footer";
import { CookieBanner, ScrollTopButton } from "@/components/site/overlays";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks01 />
        <HowItWorks02 />
        <HowItWorks03 />
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
    </div>
  );
}

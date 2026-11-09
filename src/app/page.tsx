import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/FloatingButtons";
import { ThreeProvider } from "@/components/three/ThreeProvider";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TreatmentsSection } from "@/components/sections/TreatmentsSection";
import { DifferentialsSection } from "@/components/sections/DifferentialsSection";
import { ClinicGallery } from "@/components/sections/ClinicGallery";
import { PatientJourney } from "@/components/sections/PatientJourney";
import { EmergencySection } from "@/components/sections/EmergencySection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <ThreeProvider>
        <main id="conteudo">
          <HeroSection />
          <AboutSection />
          <TreatmentsSection />
          <DifferentialsSection />
          <ClinicGallery />
          <PatientJourney />
          <EmergencySection />
          <TrustSection />
          <FAQSection />
          <LocationSection />
          <FinalCTA />
        </main>
      </ThreeProvider>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

"use client";
import { useState } from "react";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import SideNavigation from "@/components/SideNavigation";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const sections = ["index", "about", "experience", "projects", "skills", "contact"];
const sectionIds = ["hero", "about", "experience", "projects", "skills", "contact"];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { currentSection, scrollToSection } = useScrollSpy(sectionIds);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <CustomCursor />
      <ScrollProgress />

      <div className="fixed top-1/2 right-6 z-50 -translate-y-1/2">
        <SideNavigation
          sections={sections}
          currentSection={currentSection}
          onSectionClick={scrollToSection}
        />
      </div>

      <main>
        <HeroSection animate={loaded} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <footer className="border-t border-line px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="mono text-[0.625rem] tracking-[0.16em] text-t3 uppercase">
            © {new Date().getFullYear()} mark encanto
          </p>
          <p className="mono text-[0.625rem] tracking-[0.16em] text-t3 uppercase">
            designed &amp; built in iloilo
          </p>
        </div>
      </footer>
    </>
  );
}

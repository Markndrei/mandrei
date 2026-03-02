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

const sections   = ["hero.", "about.", "experience.", "projects.", "skills.", "contact."];
const sectionIds = ["hero",  "about",  "experience",  "projects",  "skills",  "contact"];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { currentSection, scrollToSection } = useScrollSpy(sectionIds);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <CustomCursor />
      <ScrollProgress />

      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
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

      <footer className="w-full text-center py-6 border-t border-gray-200 dark:border-white/[0.08]">
        <p className="text-xs text-gray-400 dark:text-gray-500 tracking-widest">
          © {new Date().getFullYear()} Mark Encanto. Crafted with care.
        </p>
      </footer>
    </>
  );
}
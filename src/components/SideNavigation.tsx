"use client";
import React, { useState, useEffect } from "react";
import { Diamond, Dot } from "lucide-react";

interface SideNavigationProps {
  sections: string[];
  currentSection: number;
  onSectionClick: (index: number) => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  sections,
  currentSection,
  onSectionClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLargeMonitor, setIsLargeMonitor] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setIsTablet(w >= 640 && w < 1024);
      setIsLargeMonitor(w >= 1920);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Mobile & Tablet: hidden ───────────────────────────────────────────────
  if (isMobile || isTablet) return null;

  // ── Large monitor (≥1920px): right side, larger buttons + always-visible labels ──
  if (isLargeMonitor) {
    return (
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-end gap-2">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => onSectionClick(index)}
              aria-label={`Navigate to ${section}`}
              className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
            >
              {/* Always-visible label for large monitors */}
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300"
                style={{
                  color:
                    currentSection === index
                      ? "#E0790B"
                      : "rgba(150,150,150,0.5)",
                  opacity: currentSection === index ? 1 : 0,
                  transform: currentSection === index ? "translateX(0)" : "translateX(6px)",
                  // Reveal on hover too
                }}
              >
                {section}
              </span>
              {/* Dot / Diamond */}
              <div className="flex items-center justify-center w-10 h-10">
                {currentSection === index ? (
                  <Diamond
                    size={20}
                    className="text-[#E0790B] fill-[#E0790B] dark:text-purple-400 dark:fill-purple-400"
                  />
                ) : (
                  <Dot
                    size={38}
                    className="text-gray-300 dark:text-white/30 group-hover:text-[#E0790B] dark:group-hover:text-purple-400 transition-colors duration-200"
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Desktop / PC (default): right side, standard size ────────────────────
  return (
    <div className="fixed right-3 top-3/4 -translate-y-1/2 z-50 lg:right-4 xl:right-5">
      <div className="flex flex-col space-y-1">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(index)}
            className="group relative flex items-center justify-center w-8 h-8 transition-all duration-300 hover:scale-110"
            aria-label={`Navigate to ${section}`}
          >
            {currentSection === index ? (
              <Diamond
                size={16}
                className="text-[#E0790B] fill-[#E0790B] dark:text-purple-500 dark:fill-purple-500"
              />
            ) : (
              <Dot
                size={30}
                className="group-hover:text-[#E0790B] text-gray-400 dark:text-white/40 dark:group-hover:text-purple-400 transition-colors duration-200"
              />
            )}
            {/* Tooltip */}
            <div
              className="absolute right-full mr-3 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
              style={{
                background: "rgba(20,20,20,0.88)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              {section}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideNavigation;
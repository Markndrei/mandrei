"use client";
import React from "react";

interface SideNavigationProps {
  sections: string[];
  currentSection: number;
  onSectionClick: (index: number) => void;
}

/**
 * The film strip. One frame per section, numbered — the active frame is marked
 * in grease pencil. Replaces the previous three-breakpoint icon variant and
 * its resize listeners with a single CSS-driven implementation.
 */
const SideNavigation: React.FC<SideNavigationProps> = ({
  sections,
  currentSection,
  onSectionClick,
}) => {
  return (
    <nav
      aria-label="Section navigation"
      className="hidden flex-col items-end gap-1 lg:flex"
    >
      {sections.map((section, index) => {
        const isActive = currentSection === index;
        return (
          <button
            key={section}
            onClick={() => onSectionClick(index)}
            aria-label={`Go to ${section}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center justify-end gap-3 py-1.5"
          >
            {/* Label — present for the active frame, revealed on hover */}
            <span
              className={`mono text-[0.625rem] tracking-[0.18em] whitespace-nowrap uppercase transition-all duration-300 ${
                isActive
                  ? "translate-x-0 text-spark opacity-100"
                  : "translate-x-1 text-t3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {section}
            </span>

            {/* Frame number */}
            <span
              className={`mono text-[0.5625rem] transition-colors duration-300 ${
                isActive ? "text-t2" : "text-t3/60 group-hover:text-t3"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* The frame edge — extends and turns spark when active */}
            <span
              aria-hidden="true"
              className={`h-px transition-all duration-400 ${
                isActive
                  ? "w-8 bg-spark"
                  : "w-3.5 bg-line2 group-hover:w-6 group-hover:bg-t3"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default SideNavigation;

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/* Grouped by discipline rather than scored out of 100. A percentage next to
   "UI/UX Design" is a number nobody can check; a grouped tool list is a
   claim a reader can verify against the work below it. */
const MATRIX = [
  {
    discipline: "design",
    items: ["Figma", "Photoshop", "Illustrator", "Lightroom", "Design systems", "Type & layout"],
  },
  {
    discipline: "frontend",
    items: ["React", "Next.js", "Vue 3", "Tailwind CSS", "PrimeVue", "Pinia", "GSAP", "Framer Motion", "shadcn/ui"],
  },
  {
    discipline: "backend & data",
    items: ["Node", "PostgreSQL", "Supabase", "Prisma", "Redux", "REST APIs"],
  },
  {
    discipline: "practice",
    items: ["Clean architecture", "Vitest", "Unit testing", "Git", "Wireframing", "Art direction", "Colour grading"],
  },
];

/* Every entry here is drawn from the experience data — no invented curve. */
const RAIL = [
  { year: "2016", note: "first design work" },
  { year: "2023", note: "freelance graphic design · assistant art director" },
  { year: "2024", note: "ui/ux + frontend freelance · head of creatives" },
  { year: "2025", note: "layout artist · film society" },
  { year: "2026", note: "dost intern · frontend dev + ui/ux at apn telecom" },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railLineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(matrixRef.current?.children ?? [], { opacity: 1, y: 0 });
      gsap.set(railRef.current?.children ?? [], { opacity: 1, y: 0 });
      gsap.set(railLineRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        matrixRef.current?.children ?? [],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: matrixRef.current, start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        railLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: railRef.current, start: "top 88%", once: true },
        }
      );
      gsap.fromTo(
        railRef.current?.children ?? [],
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.35,
          scrollTrigger: { trigger: railRef.current, start: "top 88%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-28 sm:px-10 lg:px-16 xl:px-24"
    >
      <div className="key-light" aria-hidden="true" />
      <div
        className="hero-grid pointer-events-none absolute inset-0 text-t1 opacity-[0.02] dark:opacity-[0.035]"
        aria-hidden="true"
      />

      <SectionHeading
        frame="05"
        label="capability"
        title="skills"
        caption="What I reach for, grouped by the discipline it belongs to."
        className="mb-16 max-w-3xl"
      />

      {/* ── Matrix ──────────────────────────────────────────────────────── */}
      <div ref={matrixRef} className="relative border-t border-line">
        {MATRIX.map((group) => (
          <div
            key={group.discipline}
            className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-line py-7 opacity-0 md:grid-cols-[10rem_1fr] lg:grid-cols-[13rem_1fr]"
          >
            <p className="meta pt-1">{group.discipline}</p>
            <ul className="flex flex-wrap items-baseline gap-x-1 gap-y-2">
              {group.items.map((item, i) => (
                <li key={item} className="flex items-baseline">
                  <span className="cursor-default text-base font-light text-t1 transition-colors duration-200 hover:text-spark sm:text-lg">
                    {item}
                  </span>
                  {i < group.items.length - 1 && (
                    <span className="mx-3 text-t3" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Year rail — dates only, no invented values ───────────────────── */}
      <div className="mt-20">
        <p className="meta mb-8">track record</p>

        <div className="relative">
          {/* The rail itself */}
          <span
            ref={railLineRef}
            aria-hidden="true"
            className="absolute top-[5px] left-0 hidden h-px w-full origin-left bg-line2 md:block"
          />

          <div
            ref={railRef}
            className="grid grid-cols-1 gap-y-7 md:grid-cols-5 md:gap-x-5"
          >
            {RAIL.map((point, i) => (
              <div key={point.year} className="relative opacity-0 md:pt-0">
                {/* Tick — the last one is the current frame, so it gets the mark */}
                <span
                  aria-hidden="true"
                  className={`mb-4 hidden h-[11px] w-[11px] shrink-0 rounded-full md:block ${
                    i === RAIL.length - 1
                      ? "bg-spark"
                      : "border border-line2 bg-bg"
                  }`}
                  style={{ marginTop: 0 }}
                />
                <div className="flex items-baseline gap-3 md:block">
                  <p
                    className={`mono text-sm font-medium ${
                      i === RAIL.length - 1 ? "text-spark" : "text-t1"
                    }`}
                  >
                    {point.year}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed font-light text-t2">
                    {point.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
  skills: string[];
}

/* The per-item accent colours are gone. The category they encoded — Freelance,
   Leadership, Campus, Academic, Internship — is now written out, which is
   legible without a legend. */
const experiences: Experience[] = [
  {
    period: "2023 — Present",
    role: "Graphic Designer",
    company: "Freelance",
    type: "Freelance",
    description:
      "Designing and Building identity for local clients - from crafting brandings to polished and publishable pubmats. I utilize Photoshop for most of my works and can do slight 3D rendering on the side.",
    skills: ["Branding", "Typography", "Visual Identity", "Photoshop"],
  },
  {
    period: "09/2023 — Present",
    role: "Assistant Art Director",
    company: "West Esports",
    type: "Leadership",
    description:
      "Designed and delivered promotional and event visuals to support community engagement — reaching 3,300+ followers and engaging 200+ active members. Oversaw junior designers and co-developed annual branding systems, ensuring consistent visual identity and quality control across all digital publications.",
    skills: ["Art Direction", "Event Visuals", "Branding", "Team Oversight"],
  },
  {
    period: "09/2023 — Present",
    role: "Marketing Manager",
    company: "Commission on Innovation and Tech Empowerment",
    type: "Leadership",
    description:
      "Planned and executed digital marketing campaigns for recruitment and announcements — driving increased social media engagement and clearer brand visibility. Conducted audience and market research to inform content strategy and improve campaign relevance and targeted visual messaging performance.",
    skills: ["Digital Marketing", "Campaign Strategy", "Market Research", "Content Planning"],
  },
  {
    period: "10/2023 — 08/2025",
    role: "Board Member — Public Relations",
    company: "Cyb Robotics Organization",
    type: "Campus",
    description:
      "Led event documentation for two CYB events under the Public Relations Committee. Color-graded 100+ images for social media and designed branded graphics for accepted applicants and official postings — maintaining visual consistency and professionalism throughout.",
    skills: ["PR", "Event Documentation", "Color Grading", "Graphic Design"],
  },
  {
    period: "2024 — Present",
    role: "UI/UX Designer & Frontend Dev",
    company: "Freelance",
    type: "Freelance",
    description:
      "Designing and building interfaces for local businesses and startups — from discovery and wireframes to polished, deployed products. Specializing in interactive web experiences with Next.js and Tailwind.",
    skills: ["Next.js", "Figma", "Tailwind CSS", "Client Relations"],
  },
  {
    period: "08/2024 — Present",
    role: "Head for Creatives and Multimedia",
    company: "Cipher Organization",
    type: "Leadership",
    description:
      "Led and executed UI/UX and visual strategy for a web application and organizational publications — maintaining consistent brand alignment and deploying standardized design systems across all digital platforms. Managed and directed a creatives team producing high-quality marketing and publication assets.",
    skills: ["UI/UX", "Design Systems", "Team Leadership", "Brand Strategy"],
  },
  {
    period: "07/2024 — 08/2025",
    role: "Editorial Assistant",
    company: "ICON Publications",
    type: "Campus",
    description:
      "Enhanced visual storytelling through collaboration with illustrators, photographers, and writers — increasing audience engagement. Produced and curated high-quality photo and video content with consistent color grading. Wrote editorials, columns, and captions meeting editorial standards.",
    skills: ["Editorial Design", "Color Grading", "Photography", "Writing"],
  },
  {
    period: "09/2025 — Present",
    role: "Layout Artist",
    company: "WVSU Film Society",
    type: "Campus",
    description:
      "Collaborated with cross-functional teams to ensure cohesive branding and messaging across all organizational materials — maintaining visual consistency across print and digital publications.",
    skills: ["Layout Design", "Print", "Branding", "Cross-functional Collaboration"],
  },
  {
    period: "11/2025 — Present",
    role: "Assistant Public Information Officer",
    company: "University Senior Curriculum Council",
    type: "Academic",
    description:
      "Developed branding direction and digital publication assets for official council communications — achieving consistent UI hierarchy and reuse across Facebook and digital platforms. Translated institutional branding into scalable templates, including the successful rollout of the AY 2025–2026 official council uniform.",
    skills: ["Branding", "Digital Publications", "Templates", "UI Hierarchy"],
  },
  {
    period: "01/2026 — 04/2026",
    role: "Software Developer Intern",
    company: "Department of Science and Technology - Central Office",
    type: "Internship",
    description:
      "Developed project features, integrated backend and frontend, insert data into the database, general state management through redux, clean architecture for generalizability, user story understanding, unit testing, and knowledge transfers for new interns.",
    skills: ["ReactJs", "Node", "TailwindCss", "Fullstack", "PostgreSQL", "Clean Architecture", "Redux", "Git Commands", "Knowledge Transfer"],
  },
  {
    period: "2026 — Present",
    role: "Frontend Developer & UI/UX Designer",
    company: "APN Telecom",
    type: "Industry",
    description:
      "Building and designing frontend features against an established engineering standard — Vue 3 with the Composition API, Tailwind, and PrimeVue, with Pinia for state and Vitest for unit coverage. Work runs the full width of the role: discovery and wireframes through to the shipped, reviewed interface.",
    skills: ["Vue 3", "Tailwind CSS", "PrimeVue", "Pinia", "Vite", "Vitest", "Figma", "Design Systems"],
  },
];

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("lg");
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480) return setBp("xs");
      if (w < 640) return setBp("sm");
      if (w < 1024) return setBp("md");
      if (w < 1280) return setBp("lg");
      if (w < 1920) return setBp("xl");
      setBp("2xl");
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return bp;
}

function isMobileOrTablet(bp: Breakpoint) {
  return bp === "xs" || bp === "sm" || bp === "md";
}

function cardScale(bp: Breakpoint): number {
  switch (bp) {
    case "lg": return 1.0;
    case "xl": return 1.05;
    case "2xl": return 1.15;
    default: return 1.0;
  }
}

const CARD_BASE_W = 320;
const CARD_BASE_H = 380;
const SCROLL_PER_CARD = 400;
const DRAG_THRESHOLD = 6;

function getFanPos(i: number, total: number, vw: number) {
  const spread = Math.min(vw * 0.72, 860);
  const t = total > 1 ? i / (total - 1) : 0.5;
  const x = (t - 0.5) * spread;
  const arc = Math.abs(t - 0.5) * 2;
  const y = arc * 36 + 30;
  const rot = (t - 0.5) * 30;
  return { x, y, rot };
}

function getStackPos(i: number) {
  const jx = ((i * 53 + 11) % 26) - 13;
  const jy = ((i * 37 + 7) % 16) - 8;
  const rot = ((i * 17 + 3) % 12) - 6;
  return { x: jx, y: -i * 3 + jy, rot };
}

/* ── Card face — one implementation, used by the stack, the timeline and the
   modal. Every colour is a token, so the theme switch needs no JS. ───────── */
function CardBody({
  exp,
  index,
  compact = false,
}: {
  exp: Experience;
  index: number;
  compact?: boolean;
}) {
  return (
    <>
      {/* Rebate: dates left, category right */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <span className="mono text-[0.5625rem] tracking-[0.16em] text-t3 uppercase">
          {exp.period}
        </span>
        <span className="mono border border-line px-2 py-0.5 text-[0.5rem] tracking-[0.16em] text-t2 uppercase">
          {exp.type}
        </span>
      </div>

      <div className="flex-1 overflow-hidden px-5 py-4">
        <h3
          className={`font-light tracking-tight text-t1 ${compact ? "text-base" : "text-lg"} leading-snug`}
        >
          {exp.role}
        </h3>
        <p className="mono mt-1.5 text-[0.625rem] tracking-[0.1em] text-t2 uppercase">
          {exp.company}
        </p>

        <p
          className={`mt-4 leading-relaxed font-light text-t2 ${compact ? "text-xs" : "text-[0.8125rem]"}`}
        >
          {exp.description}
        </p>
      </div>

      <div className="px-5 pb-5">
        <p className="mono text-[0.5625rem] leading-relaxed tracking-[0.1em] text-t3">
          {exp.skills.join("  ·  ")}
        </p>
      </div>

      {/* Frame number — the sequence is real, so the number carries meaning */}
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute right-4 bottom-2 text-6xl text-t1 opacity-[0.055] select-none"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </>
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
function Modal({
  exp,
  onClose,
  sheet,
}: {
  exp: Experience;
  onClose: () => void;
  sheet: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const index = experiences.indexOf(exp);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
    if (sheet) {
      gsap.fromTo(panelRef.current, { y: "100%" }, { y: "0%", duration: 0.4, ease: "power3.out" });
    } else {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.94, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "power3.out" }
      );
    }
  }, [sheet]);

  const close = useCallback(() => {
    if (sheet) {
      gsap.to(panelRef.current, { y: "100%", duration: 0.3, ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.32, ease: "power2.in", onComplete: onClose });
    } else {
      gsap.to(panelRef.current, { opacity: 0, scale: 0.96, y: 12, duration: 0.2, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: "power2.in", onComplete: onClose });
    }
  }, [onClose, sheet]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${exp.role} at ${exp.company}`}
      className="fixed inset-0 z-[300] flex justify-center"
      style={{
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        alignItems: sheet ? "flex-end" : "center",
        padding: sheet ? 0 : "1.5rem",
      }}
      onClick={close}
    >
      <div
        ref={panelRef}
        className="plate relative flex w-full flex-col overflow-y-auto"
        style={{ maxWidth: sheet ? "100%" : "30rem", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {sheet && (
          <div className="flex justify-center pt-3 pb-1">
            <span className="h-0.5 w-9 bg-line2" />
          </div>
        )}

        {/* A short spark rule, not a full-width coloured bar */}
        <span className="h-px w-14 bg-spark" aria-hidden="true" />

        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center border border-line text-t3 transition-colors duration-200 hover:border-spark hover:text-spark"
          style={{ top: sheet ? "2.5rem" : "0.75rem" }}
          aria-label="Close"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <CardBody exp={exp} index={index} compact={sheet} />
      </div>
    </div>
  );
}

/* ── Mobile: vertical timeline ────────────────────────────────────────────── */
function MobileTimeline({ onCardClick }: { onCardClick: (exp: Experience) => void }) {
  return (
    <div className="relative px-6 py-24 sm:px-10">
      <SectionHeading
        frame="03"
        label="experience"
        title="experience"
        caption="Tap any frame to read the full entry."
        className="mb-12"
      />

      <div className="relative">
        {/* The strip */}
        <span className="absolute top-2 bottom-2 left-[3px] w-px bg-line" aria-hidden="true" />

        <div className="space-y-4 pl-8">
          {experiences.map((exp, i) => (
            <div key={i} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-6 -left-8 h-[7px] w-[7px] rounded-full border border-line2 bg-bg"
              />
              <button
                onClick={() => onCardClick(exp)}
                className="plate relative flex w-full flex-col text-left transition-transform duration-200 active:scale-[0.99]"
              >
                <CardBody exp={exp} index={i} compact />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Desktop: the scroll-driven stack. Logic unchanged. ──────────────────── */
function DesktopStack({
  bp,
  onCardClick,
}: {
  bp: Breakpoint;
  onCardClick: (exp: Experience) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const dragState = useRef(
    experiences.map(() => ({
      baseX: 0, baseY: 0, baseRot: 0,
      offsetX: 0, offsetY: 0,
      dragging: false, didDrag: false,
      startMX: 0, startMY: 0,
    }))
  );

  const [zOrders, setZOrders] = useState<number[]>(() => experiences.map((_, i) => i + 10));
  const [vh, setVh] = useState(0);
  const [scrollDone, setScrollDone] = useState(false);

  const sc = cardScale(bp);
  const CARD_W = Math.round(CARD_BASE_W * sc);
  const CARD_H = Math.round(CARD_BASE_H * sc);

  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!vh) return;

    /* Captured for the cleanup closure — reading .current there would see a
       different node by the time it runs. */
    const sectionEl = sectionRef.current;
    const headingEl = headingRef.current;

    gsap.fromTo(
      headingRef.current,
      { y: 32, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      }
    );

    const vw = stageRef.current?.offsetWidth ?? window.innerWidth;
    const total = experiences.length;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const { x, y, rot } = getFanPos(i, total, vw);
      gsap.set(el, { x, y, rotation: rot, scale: 0.82, zIndex: i + 1, opacity: 1 });
      dragState.current[i].baseX = x;
      dragState.current[i].baseY = y;
      dragState.current[i].baseRot = rot;
    });

    const tl = gsap.timeline({ paused: true });
    experiences.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const { x, y, rot } = getStackPos(i);
      tl.to(el, {
        x, y, rotation: rot, scale: 1, zIndex: i + 10, duration: 1, ease: "power3.inOut",
        onComplete: () => {
          dragState.current[i].baseX = x;
          dragState.current[i].baseY = y;
          dragState.current[i].baseRot = rot;
        },
      }, i);
    });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${total * SCROLL_PER_CARD}`,
      pin: stageRef.current,
      scrub: 1.2,
      animation: tl,
      onUpdate(self) {
        if (!counterRef.current) return;
        const idx = Math.min(Math.floor(self.progress * total), total - 1);
        counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${total}`;
        gsap.to(labelRef.current, { opacity: self.progress > 0.01 ? 1 : 0, duration: 0.3 });
      },
      onLeaveBack() {
        setScrollDone(false);
        if (hintRef.current) gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
      },
      onLeave() {
        setScrollDone(true);
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const matrix = new DOMMatrix(window.getComputedStyle(el).transform);
          dragState.current[i].baseX = matrix.m41;
          dragState.current[i].baseY = matrix.m42;
          dragState.current[i].baseRot = getStackPos(i).rot;
        });
        if (hintRef.current) {
          gsap.fromTo(hintRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.3 });
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionEl || t.trigger === headingEl) t.kill();
      });
    };
  }, [vh, bp]);

  const bringToFront = useCallback((idx: number) => {
    setZOrders((prev) => {
      const max = Math.max(...prev);
      const next = [...prev];
      next[idx] = max + 1;
      return next;
    });
  }, []);

  const makeHandlers = useCallback(
    (i: number) => {
      const ds = dragState.current[i];
      const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!scrollDone) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        bringToFront(i);
        ds.dragging = true;
        ds.didDrag = false;
        ds.startMX = e.clientX;
        ds.startMY = e.clientY;
        gsap.to(cardRefs.current[i], { scale: 1.05, rotation: ds.baseRot * 0.3, duration: 0.18, ease: "power2.out" });
      };
      const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!ds.dragging) return;
        const dx = e.clientX - ds.startMX;
        const dy = e.clientY - ds.startMY;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) ds.didDrag = true;
        ds.offsetX = dx;
        ds.offsetY = dy;
        gsap.set(cardRefs.current[i], { x: ds.baseX + dx, y: ds.baseY + dy });
      };
      const onPointerUp = () => {
        if (!ds.dragging) return;
        ds.dragging = false;
        ds.baseX += ds.offsetX;
        ds.baseY += ds.offsetY;
        ds.offsetX = 0;
        ds.offsetY = 0;
        gsap.to(cardRefs.current[i], { scale: 1, rotation: ds.baseRot, duration: 0.55, ease: "elastic.out(1, 0.45)" });
        if (!ds.didDrag) onCardClick(experiences[i]);
      };
      return { onPointerDown, onPointerMove, onPointerUp };
    },
    [scrollDone, bringToFront, onCardClick]
  );

  const totalH = vh > 0 ? vh + experiences.length * SCROLL_PER_CARD : "200vh";

  return (
    <div ref={sectionRef} id="experience" style={{ height: totalH }} className="relative">
      <div
        ref={stageRef}
        className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-bg"
        style={{ height: vh > 0 ? vh : "100vh" }}
      >
        <div className="key-light" aria-hidden="true" />
        <div
          className="hero-grid pointer-events-none absolute inset-0 text-t1 opacity-[0.02] dark:opacity-[0.035]"
          aria-hidden="true"
        />

        <div
          ref={headingRef}
          className="pointer-events-none absolute top-16 left-6 z-50 max-w-md opacity-0 sm:left-10 lg:left-16 xl:left-24"
        >
          <SectionHeading
            frame="03"
            label="experience"
            title="experience"
            caption="Scroll to collect the stack, then drag the frames around."
            static
          />
        </div>

        <div
          ref={labelRef}
          className="pointer-events-none absolute top-16 right-6 z-50 text-right opacity-0 sm:right-10 lg:right-16 xl:right-24"
        >
          <span ref={counterRef} className="mono text-sm font-medium text-t2">
            01 / {experiences.length}
          </span>
          <p className="meta-sm mt-1">frames</p>
        </div>

        <p
          ref={hintRef}
          className="meta-sm pointer-events-none absolute bottom-16 left-1/2 z-50 -translate-x-1/2 opacity-0"
        >
          drag to rearrange · click to expand
        </p>

        <div className="relative" style={{ width: CARD_W, height: CARD_H, marginTop: 40 }}>
          {experiences.map((exp, i) => {
            const handlers = makeHandlers(i);
            return (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  willChange: "transform",
                  zIndex: zOrders[i],
                  cursor: scrollDone ? "grab" : "default",
                  touchAction: "none",
                }}
                onPointerDown={handlers.onPointerDown}
                onPointerMove={handlers.onPointerMove}
                onPointerUp={handlers.onPointerUp}
              >
                <div
                  className="plate absolute inset-0 flex flex-col overflow-hidden"
                  style={{
                    boxShadow: "0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.18)",
                  }}
                >
                  <CardBody exp={exp} index={i} compact={sc < 0.95} />
                </div>
              </div>
            );
          })}
        </div>

        {!scrollDone && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="h-8 w-px bg-line2" aria-hidden="true" />
            <p className="meta-sm">scroll</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const [activeModal, setActiveModal] = useState<Experience | null>(null);
  const bp = useBreakpoint();
  const sheet = isMobileOrTablet(bp);

  return (
    <>
      {activeModal && (
        <Modal exp={activeModal} onClose={() => setActiveModal(null)} sheet={sheet} />
      )}

      {sheet ? (
        <section id="experience" className="bg-bg">
          <MobileTimeline onCardClick={setActiveModal} />
        </section>
      ) : (
        <DesktopStack bp={bp} onCardClick={setActiveModal} />
      )}
    </>
  );
}

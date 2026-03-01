"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Experience {
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
  skills: string[];
  accent: string;
  darkAccent: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const experiences: Experience[] = [
  {
    period: "2024 — Present",
    role: "UI/UX Designer & Frontend Dev",
    company: "Freelance",
    type: "Freelance",
    description: "Designing and building interfaces for local businesses and startups — from discovery and wireframes to polished, deployed products. Specializing in interactive web experiences with Next.js and Tailwind.",
    skills: ["Next.js", "Figma", "Tailwind CSS", "Client Relations"],
    accent: "#11BA0F",
    darkAccent: "#80CEFF",
  },
  {
    period: "2023 — 2024",
    role: "Lead Designer",
    company: "WVSU HCI Research Group",
    type: "Academic",
    description: "Led UI/UX research and design for IPSYNC — the group's flagship platform. Conducted user interviews, built prototypes in Figma, and collaborated with developers on a human-centered implementation.",
    skills: ["User Research", "Figma", "Prototyping", "Vue.js"],
    accent: "#E0790B",
    darkAccent: "#F7B2FD",
  },
  {
    period: "2022 — 2023",
    role: "Graphic Designer",
    company: "University Publications",
    type: "Campus",
    description: "Created print and digital assets for university-wide campaigns — event posters, editorial layouts, social media content, and brand materials adhering to institutional guidelines.",
    skills: ["Illustrator", "Photoshop", "Typography", "Print Design"],
    accent: "#EFE00A",
    darkAccent: "#c084fc",
  },
  {
    period: "2022",
    role: "Frontend Intern",
    company: "Local Tech Studio",
    type: "Internship",
    description: "Translated Figma mockups into responsive React components. Worked alongside senior developers on a client-facing dashboard, gaining hands-on experience in component architecture and Git workflows.",
    skills: ["React", "CSS", "Git", "Responsive Design"],
    accent: "#11BA0F",
    darkAccent: "#80CEFF",
  },
  {
    period: "2021 — 2022",
    role: "Photography Lead",
    company: "Campus Media Office",
    type: "Campus",
    description: "Shot and edited photography for university events, yearbooks, and social channels. Developed a consistent visual language for the institution and mentored junior photographers.",
    skills: ["Photography", "Lightroom", "Storytelling", "Direction"],
    accent: "#E0790B",
    darkAccent: "#F7B2FD",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W         = 320;
const CARD_H         = 380;
const SCROLL_PER_CARD = 400;
const DRAG_THRESHOLD  = 6; // px — below this movement = click

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFanPos(i: number, total: number, vw: number) {
  const spread = Math.min(vw * 0.72, 860);
  const t   = total > 1 ? i / (total - 1) : 0.5;
  const x   = (t - 0.5) * spread;
  const arc = Math.abs(t - 0.5) * 2;
  const y   = arc * 36 + 30;
  const rot = (t - 0.5) * 30;
  return { x, y, rot };
}

function getStackPos(i: number) {
  const jx  = ((i * 53 + 11) % 26) - 13;
  const jy  = ((i * 37 +  7) % 16) - 8;
  const rot = ((i * 17 +  3) % 12) - 6;
  return { x: jx, y: -i * 3 + jy, rot };
}

// ─── useIsDark — MutationObserver, reacts to theme toggle ────────────────────

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({
  exp, isDark, onClose,
}: {
  exp: Experience; isDark: boolean; onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const color      = isDark ? exp.darkAccent : exp.accent;

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
    gsap.fromTo(panelRef.current,
      { opacity: 0, scale: 0.91, y: 32 },
      { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "back.out(1.6)" }
    );
  }, []);

  const close = useCallback(() => {
    gsap.to(panelRef.current,   { opacity: 0, scale: 0.94, y: 16, duration: 0.2,  ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      onClick={close}
    >
      <div
        ref={panelRef}
        className="relative rounded-3xl overflow-hidden w-full max-w-md"
        style={{
          maxHeight: "88vh",
          overflowY: "auto",
          background: isDark ? "#161616" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: isDark
            ? "0 40px 100px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)"
            : "0 40px 100px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent strip */}
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }} />

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm"
          style={{
            background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-1">
              <p
                className="text-[9px] font-bold uppercase tracking-[0.22em]"
                style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
              >
                {exp.period}
              </p>
              <span
                className="px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wide"
                style={{ color, background: `${color}18`, border: `1px solid ${color}45` }}
              >
                {exp.type}
              </span>
            </div>
            <h2
              className="text-2xl font-black leading-tight"
              style={{ color: isDark ? "#f0f0f0" : "#1a1a1a" }}
            >
              {exp.role}
            </h2>
            <p className="text-sm font-semibold mt-1" style={{ color }}>
              {exp.company}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }} />

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: isDark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.58)" }}
          >
            {exp.description}
          </p>

          {/* Skills */}
          <div>
            <p
              className="text-[8px] font-bold uppercase tracking-[0.22em] mb-2.5"
              style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
            >
              Tools &amp; Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-[11px] font-medium rounded-full"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
                    background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Big number watermark */}
        <div
          className="absolute bottom-4 right-5 font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 80, opacity: 0.15, color }}
        >
          {String(experiences.indexOf(exp) + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const labelRef    = useRef<HTMLDivElement>(null);
  const hintRef     = useRef<HTMLParagraphElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  // Per-card drag state — stored in refs to avoid re-renders during drag
  const dragState = useRef(
    experiences.map(() => ({
      // The GSAP-animated base position (set once scroll finishes)
      baseX: 0, baseY: 0, baseRot: 0,
      // Accumulated user drag offset on top of base
      offsetX: 0, offsetY: 0,
      // Drag tracking
      dragging: false, didDrag: false,
      startMX: 0, startMY: 0,
    }))
  );

  // zIndex ordering for bring-to-front on drag/click
  const [zOrders, setZOrders] = useState<number[]>(() =>
    experiences.map((_, i) => i + 10)
  );

  const [vh, setVh] = useState(0);
  const [scrollDone, setScrollDone] = useState(false);
  const [activeModal, setActiveModal] = useState<Experience | null>(null);
  const isDark = useIsDark();

  // ── vh measurement ────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Scroll animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!vh) return;

    // Heading entrance
    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
    );

    const vw    = stageRef.current?.offsetWidth ?? window.innerWidth;
    const total = experiences.length;

    // Fan out initial positions
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const { x, y, rot } = getFanPos(i, total, vw);
      gsap.set(el, { x, y, rotation: rot, scale: 0.82, zIndex: i + 1, opacity: 1 });
      dragState.current[i].baseX   = x;
      dragState.current[i].baseY   = y;
      dragState.current[i].baseRot = rot;
    });

    // Build scrubbed timeline
    const tl = gsap.timeline({ paused: true });
    experiences.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const { x, y, rot } = getStackPos(i);
      tl.to(el, {
        x, y, rotation: rot, scale: 1,
        zIndex: i + 10,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          // Store final base pos so drag knows where GSAP left the card
          dragState.current[i].baseX   = x;
          dragState.current[i].baseY   = y;
          dragState.current[i].baseRot = rot;
        },
      }, i);
    });

    // Pin + scrub
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
        counterRef.current.textContent = `${idx + 1} / ${total}`;
        gsap.to(labelRef.current, { opacity: self.progress > 0.01 ? 1 : 0, duration: 0.3 });
      },
      onLeaveBack() {
        // scrolled back past the start — not done
        setScrollDone(false);
        if (hintRef.current) gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
      },
      onLeave() {
        // scrolled past the end — all cards stacked, enable drag + click
        setScrollDone(true);
        // Snapshot final GSAP positions into dragState
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const matrix = new DOMMatrix(window.getComputedStyle(el).transform);
          dragState.current[i].baseX = matrix.m41;
          dragState.current[i].baseY = matrix.m42;
          const { rot } = getStackPos(i);
          dragState.current[i].baseRot = rot;
        });
        // Show drag hint
        if (hintRef.current) {
          gsap.fromTo(hintRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.3 }
          );
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current || t.trigger === headingRef.current) t.kill();
      });
    };
  }, [vh]);

  // ── Bring card to front ───────────────────────────────────────────────────
  const bringToFront = useCallback((idx: number) => {
    setZOrders(prev => {
      const max  = Math.max(...prev);
      const next = [...prev];
      next[idx]  = max + 1;
      return next;
    });
  }, []);

  // ── Per-card pointer handlers (bound inline, use closure over index) ───────
  const makeHandlers = useCallback((i: number) => {
    const ds = dragState.current[i];

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!scrollDone) return; // ignore during scroll animation
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      bringToFront(i);
      ds.dragging = true;
      ds.didDrag  = false;
      ds.startMX  = e.clientX;
      ds.startMY  = e.clientY;
      // Lift card slightly
      gsap.to(cardRefs.current[i], {
        scale: 1.06,
        rotation: ds.baseRot * 0.3,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!ds.dragging) return;
      const dx = e.clientX - ds.startMX;
      const dy = e.clientY - ds.startMY;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) ds.didDrag = true;
      ds.offsetX = dx;
      ds.offsetY = dy;
      gsap.set(cardRefs.current[i], {
        x: ds.baseX + dx,
        y: ds.baseY + dy,
      });
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!ds.dragging) return;
      ds.dragging = false;

      // Update base so next drag starts from dropped position
      ds.baseX += ds.offsetX;
      ds.baseY += ds.offsetY;
      ds.offsetX = 0;
      ds.offsetY = 0;

      // Spring back to stack rotation
      gsap.to(cardRefs.current[i], {
        scale: 1,
        rotation: ds.baseRot,
        duration: 0.55,
        ease: "elastic.out(1, 0.45)",
      });

      // Click = no real drag
      if (!ds.didDrag) {
        setActiveModal(experiences[i]);
      }
    };

    return { onPointerDown, onPointerMove, onPointerUp };
  }, [scrollDone, bringToFront]);

  // ── Heights ───────────────────────────────────────────────────────────────
  const totalH = vh > 0 ? vh + experiences.length * SCROLL_PER_CARD : "200vh";

  return (
    <>
      {/* Modal */}
      {activeModal && (
        <Modal
          exp={activeModal}
          isDark={isDark}
          onClose={() => setActiveModal(null)}
        />
      )}

      <div ref={sectionRef} id="experience" style={{ height: totalH }} className="relative">
        <div
          ref={stageRef}
          className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-[#0e0e0e]"
          style={{ height: vh > 0 ? vh : "100vh" }}
        >
          {/* Grid */}
          <div className="absolute inset-0 hero-grid opacity-[0.025] dark:opacity-[0.04] pointer-events-none" />

          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="absolute w-[600px] h-[600px] rounded-full blur-[120px] dark:opacity-0 transition-opacity duration-500"
              style={{ opacity: 0.18, background: "radial-gradient(circle, #E0790B, transparent 65%)" }}
            />
            <div
              className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-0 dark:opacity-[0.13] transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, #80CEFF, transparent 65%)" }}
            />
          </div>

          {/* Heading */}
          <div ref={headingRef} className="absolute top-14 left-6 sm:left-10 lg:left-16 xl:left-24 opacity-0 z-50 pointer-events-none">
            <h2 className="text-[2.6rem] sm:text-[3.6rem] lg:text-[4.2rem] font-black bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent leading-tight">
              experience.
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 tracking-wide">
              Scroll to build the stack.
            </p>
          </div>

          {/* Counter */}
          <div ref={labelRef} className="absolute top-14 right-6 sm:right-10 lg:right-16 xl:right-24 opacity-0 z-50 text-right pointer-events-none">
            <span ref={counterRef} className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 tracking-widest">
              1 / {experiences.length}
            </span>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-[0.18em]">experience</p>
          </div>

          {/* Drag + click hint — appears after scroll completes */}
          <p
            ref={hintRef}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-0 text-[10px] tracking-[0.2em] uppercase pointer-events-none z-50 whitespace-nowrap"
            style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.28)" }}
          >
            drag to rearrange · tap to expand
          </p>

          {/* Cards */}
          <div
            className="relative"
            style={{ width: CARD_W, height: CARD_H, marginTop: 40 }}
          >
            {experiences.map((exp, i) => {
              const color    = isDark ? exp.darkAccent : exp.accent;
              const handlers = makeHandlers(i);

              return (
                <div
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    willChange: "transform",
                    zIndex: zOrders[i],
                    // Show grab cursor only after scroll finishes
                    cursor: scrollDone ? "grab" : "default",
                    touchAction: "none",
                  }}
                  onPointerDown={handlers.onPointerDown}
                  onPointerMove={handlers.onPointerMove}
                  onPointerUp={handlers.onPointerUp}
                >
                  {/* Card face */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col"
                    style={{
                      background: isDark ? "#161616" : "#ffffff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
                      boxShadow: isDark
                        ? "0 24px 64px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)"
                        : "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                      transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
                    }}
                  >
                    {/* Accent strip */}
                    <div
                      className="h-[3px] w-full flex-shrink-0"
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}55)`, transition: "background 0.4s" }}
                    />

                    {/* Header */}
                    <div
                      className="px-6 pt-5 pb-4 flex-shrink-0"
                      style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
                            {exp.period}
                          </p>
                          <h3 className="font-black text-[17px] leading-snug" style={{ color: isDark ? "#f0f0f0" : "#1a1a1a" }}>
                            {exp.role}
                          </h3>
                          <p className="text-sm font-semibold mt-0.5" style={{ color, transition: "color 0.4s" }}>
                            {exp.company}
                          </p>
                        </div>
                        <span
                          className="flex-shrink-0 mt-0.5 px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wide"
                          style={{ color, background: `${color}18`, border: `1px solid ${color}45`, transition: "color 0.4s, background 0.4s" }}
                        >
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 py-4 flex-1 overflow-hidden">
                      <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>
                        {exp.description}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="px-6 pb-5 flex-shrink-0">
                      <p className="text-[8px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                        Tools &amp; Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                            style={{
                              color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)",
                              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                              transition: "color 0.4s, background 0.4s",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Number watermark */}
                    <div
                      className="absolute bottom-3 right-4 font-black leading-none select-none pointer-events-none"
                      style={{ fontSize: 72, opacity: 0.14, color, transition: "color 0.4s" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll nudge — hidden once done */}
          {!scrollDone && (
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 pointer-events-none z-50">
              <div
                className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
                style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}` }}
              >
                <div
                  className="w-1 h-2 rounded-full animate-bounce"
                  style={{ background: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}
                />
              </div>
              <p className="text-[8px] tracking-[0.2em] uppercase" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
                scroll
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DevProject {
  title: string; subtitle: string; description: string;
  image: string; link: string; tags: string[]; accent: string;
}
interface DesignCard {
  title: string; subtitle: string; description: string;
  tags: string[]; accent: string; icon: string; image?: string;
}
interface ModalData { type: "dev" | "design"; item: DevProject | DesignCard; }

const devProjects: DevProject[] = [
  { title: "Kantonize",     subtitle: "Pancit Canton Customizer",      description: "A frontend web app letting users fully customize their Pancit Canton — ingredients, spice levels, and toppings — with a fun interactive visualizer built with React and Framer Motion.",                                                                             image: "/kantonize.png",  link: "https://kantonize.vercel.app",                                                                                             tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],  accent: "#11BA0F" },
  { title: "IPSYNC",        subtitle: "Internship & Collaboration Hub", description: "Full-stack platform bridging academia and industry — connecting students with internships, faculty with research, and industry partners with emerging talent. Features auth, database, and live API integrations.",                                                  image: "/ipsync.png",     link: "https://ipsync.vercel.app",                                                                                                tags: ["Vue.js", "Tailwind CSS", "Full-Stack", "API", "Auth"], accent: "#E0790B" },
  { title: "Jinjaroos HCI", subtitle: "Group Website",                  description: "Website for the interdisciplinary HCI team behind IPSYNC — particle animations, human-centered interactions, and a compelling team presence.",                                                                                                                       image: "/hci-group.png",  link: "https://hci-group-website.vercel.app",                                                                                      tags: ["React", "Next.js", "Particles", "Animation"],         accent: "#11BA0F" },
  { title: "Rekom",         subtitle: "Movie Recommendation System",    description: "Hybrid ML recommendation engine combining collaborative filtering, content-based filtering, and NLP for personalized movie suggestions that address the cold-start problem.",                                                                                         image: "/rekom.png",      link: "https://github.com/Markndrei/CCS-230-Final-Project",                                                                                tags: ["Python", "ML", "NLP", "Data Mining"],                 accent: "#E0790B" },
  { title: "Sentisize",     subtitle: "Emotion Group Analysis",         description: "Web app extracting emotional sentiments from text via SVM and NLP, visualizing collective mood trends across groups for academic research in data mining.",                                                                                                          image: "/sentisize.png",  link: "https://github.com/Markndrei/Data-Mining",                                                                                          tags: ["SVM", "Sentiment", "NLP", "Fullstack"],               accent: "#EFE00A" },
  { title: "WVSUTRACK",     subtitle: "Fundays Scoreboard Tracker",     description: "Real-time scoreboard tracker for WVSU Fundays events — delivering live score updates and rankings to enhance the event experience for participants and spectators.",                                                                                              image: "/wvsu-track.png", link: "https://www.figma.com/design/fVxJ9MQYoEsS6uGfAKW5tj/WVSU-FUNDAYS-REAL-TIME-SCOREBOARD?node-id=0-1",                           tags: ["Figma", "UI/UX", "Prototyping"],                      accent: "#E0790B" },
  { title: "CICT WEBSITE",     subtitle: "Official CICT Website",     description: "The official website of WVSU-CICT that contains synopsis, programs offered, and faculty directory that helps enrollees and other individuals know more about the college.",                                                                                                image: "/cict-website.png", link: "#",                           tags: ["Figma", "UI/UX", "Prototyping"],                      accent: "#11BA0F" },
  { title: "Caffeinated Spaces",     subtitle: "Iloilo City Coffee Shops Hub",     description: "Curation of different coffee shops within Iloilo, it scopes within the seven (7) region of the Iloilo City, featuring 13 coffee shops.",                                                                                                image: "/caffeinated-spaces.png", link: "https://caffeinatedspaces.vercel.app",                           tags: ["Figma", "UI/UX", "Prototyping", "Next.js", "Tailwind CSS"],                      accent: "#11BA0F" },
  { title: "WVSU RE:Claim",     subtitle: "WVSU Official Lost and Found System",     description: "This serves as the official lost and found hub for WVSU learners, allowing them to post lost or found items for claiming.",                                                                                                image: "/wvsu-track.png", link: "#",                           tags: ["Figma", "UI/UX", "Prototyping"],                      accent: "#11BA0F" },
  { title: "DOST Project Visualization",     subtitle: "Nationwide DOST Projects Visualization",     description: "This contains the projects that DOST have from 1976 to the present, providing an information dashboard for project tracking and transparency.",                                                                                                image: "/kantonize.png", link: "#",                           tags: ["React", "Tailwind", "Node", "Clean Architecture", "Redux"],                      accent: "#E0790B" },
];

const designCards: DesignCard[] = [
  { title: "Event Poster",    subtitle: "University Campaign",   description: "Bold typographic event poster for a university campaign — layered halftone textures, neon accent palette, strong visual hierarchy guiding the viewer's eye from title to details.",                                  tags: ["Poster", "Typography", "Illustrator"],     accent: "#E0790B", icon: "🎨" },
  { title: "Brand Identity",  subtitle: "Startup Branding Kit",  description: "Complete logo suite and brand guidelines for a local tech startup — primary mark, wordmark, icon variant, full color system, and type pairing for consistent communication.",                                       tags: ["Branding", "Logo", "Figma"],               accent: "#11BA0F", icon: "✦"  },
  { title: "Social Graphics", subtitle: "Content Design Series", description: "Recurring Instagram and Facebook content series with a consistent grid layout, motion-inspired static frames, and a bold editorial aesthetic built for engagement.",                                              tags: ["Social Media", "Content", "Photoshop"],    accent: "#EFE00A", icon: "◈"  },
  { title: "Infographic",     subtitle: "Data Visualization",    description: "Editorial infographic translating raw survey data into a scannable visual narrative — custom icon set, clear information hierarchy, and print-ready layout for academic publication.",                            tags: ["Infographic", "Illustration", "Data Viz"], accent: "#E0790B", icon: "◉"  },
];

// ── Breakpoint hook ────────────────────────────────────────────────────────────
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("lg");
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480)  return setBp("xs");
      if (w < 640)  return setBp("sm");
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

const DEV_BASE = { w: 240, imgH: 148, contentH: 130 };
const DES_BASE = { w: 160, imgH: 180, contentH: 90  };

function cardScale(bp: Breakpoint): number {
  switch (bp) {
    case "xs":  return 0.65;
    case "sm":  return 0.75;
    case "md":  return 0.88;
    case "lg":  return 1.00;
    case "xl":  return 1.05;
    case "2xl": return 1.15;
  }
}

function tableRowHeight(bp: Breakpoint): number {
  switch (bp) {
    case "xs":
    case "sm":  return 3.0;
    case "md":  return 2.5;
    default:    return 2.2;
  }
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({
  data,
  onClose,
  sheet,
}: {
  data: ModalData;
  onClose: () => void;
  sheet: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const closing    = useRef(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: "power2.out" }
    );
    if (sheet) {
      gsap.fromTo(panelRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.91, y: 32 },
        { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "back.out(1.6)" }
      );
    }
  }, [sheet]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (sheet) {
      gsap.to(panelRef.current,   { y: "100%", duration: 0.3,  ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.32, ease: "power2.in", onComplete: onClose });
    } else {
      gsap.to(panelRef.current,   { opacity: 0, scale: 0.94, y: 16, duration: 0.2, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: "power2.in", onComplete: onClose });
    }
  }, [onClose, sheet]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  const isDev  = data.type === "dev";
  const dev    = isDev  ? (data.item as DevProject) : null;
  const des    = !isDev ? (data.item as DesignCard)  : null;
  const accent = isDev  ? dev!.accent : des!.accent;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex"
      style={{
        background:     "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        alignItems:     sheet ? "flex-end" : "center",
        justifyContent: "center",
        padding:        sheet ? 0 : "1.5rem",
      }}
      onClick={close}
    >
      <div
        ref={panelRef}
        className="relative bg-white dark:bg-[#131313] shadow-2xl w-full"
        style={{
          maxWidth:     sheet ? "100%" : "32rem",
          maxHeight:    sheet ? "88vh" : "88vh",
          overflowY:    "auto",
          overflowX:    "hidden",
          borderRadius: sheet ? "1.5rem 1.5rem 0 0" : "1.5rem",
          border:       "1px solid rgba(128,128,128,0.12)",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {sheet && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
          </div>
        )}

        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />

        <button
          onClick={close}
          className="absolute z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm"
          style={{
            top:        sheet ? "2.75rem" : "1rem",
            right:      "1rem",
            background: "rgba(128,128,128,0.15)",
            color:      "rgba(128,128,128,0.8)",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {isDev ? (
          <div
            className="w-full relative bg-gray-100 dark:bg-white/5"
            style={{ height: sheet ? "10rem" : "13rem" }}
          >
            <Image src={dev!.image} alt={dev!.title} fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.6))" }} />
            <div className="absolute bottom-4 left-5">
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">{dev!.subtitle}</p>
              <h2
                className="text-white font-black leading-tight"
                style={{ fontSize: sheet ? "1.2rem" : "1.5rem" }}
              >
                {dev!.title}
              </h2>
            </div>
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center relative"
            style={{
              height:     sheet ? "7rem" : "9rem",
              background: `linear-gradient(135deg, ${des!.accent}22, ${des!.accent}06)`,
            }}
          >
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 60% 40%, ${des!.accent}38, transparent 65%)` }} />
            <div className="absolute top-3 right-4 w-14 h-14 rounded-full border opacity-20" style={{ borderColor: des!.accent }} />
            <span
              className="relative z-10"
              style={{ fontSize: sheet ? "3rem" : "4rem", filter: `drop-shadow(0 0 18px ${des!.accent}90)` }}
            >
              {des!.icon}
            </span>
          </div>
        )}

        <div
          className="space-y-4"
          style={{ padding: sheet ? "1rem 1.25rem 2.5rem" : "1.25rem 1.5rem" }}
        >
          {!isDev && (
            <div>
              <h2
                className="font-black text-gray-800 dark:text-gray-100"
                style={{ fontSize: sheet ? "1.1rem" : "1.25rem" }}
              >
                {des!.title}
              </h2>
              <p className="text-xs mt-0.5 font-medium" style={{ color: accent }}>{des!.subtitle}</p>
            </div>
          )}

          <p
            className="leading-relaxed text-gray-600 dark:text-gray-300"
            style={{ fontSize: sheet ? "0.8rem" : "0.875rem" }}
          >
            {isDev ? dev!.description : des!.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {(isDev ? dev!.tags : des!.tags).map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[11px] rounded-full bg-gray-100 dark:bg-white/[0.07] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
              >
                {t}
              </span>
            ))}
          </div>

          {isDev ? (
            <a
              href={dev!.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-sm text-sm font-semibold tracking-wide uppercase text-white dark:text-black transition-all duration-300 hover:brightness-110 active:scale-95"
              style={{ background: accent, boxShadow: `0 0 18px ${accent}55` }}
            >
              View Project
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              Graphic design work — files available on request.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Draggable wrapper ──────────────────────────────────────────────────────────
const DRAG_THRESHOLD = 5;

interface DraggableProps {
  children: React.ReactNode;
  initialX: number; initialY: number; initialRot: number;
  zIndex: number;
  onBringToFront: () => void;
  onClick: () => void;
}

function DraggableCard({
  children, initialX, initialY, initialRot,
  zIndex, onBringToFront, onClick,
}: DraggableProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const dragging   = useRef(false);
  const didDrag    = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: initialX, y: initialY });
  const curPos     = useRef({ x: initialX, y: initialY });

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, { x: initialX, y: initialY, rotation: initialRot });
    curPos.current   = { x: initialX, y: initialY };
    startPos.current = { x: initialX, y: initialY };
  }, [initialX, initialY, initialRot]);

  const onPtrDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    e.preventDefault();
    dragging.current   = true;
    didDrag.current    = false;
    onBringToFront();
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current   = { ...curPos.current };
    cardRef.current?.setPointerCapture(e.pointerId);
    gsap.to(cardRef.current, { scale: 1.06, rotation: initialRot * 0.25, duration: 0.18, ease: "power2.out" });
  }, [onBringToFront, initialRot]);

  const onPtrMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) didDrag.current = true;
    curPos.current = { x: startPos.current.x + dx, y: startPos.current.y + dy };
    gsap.set(cardRef.current, curPos.current);
  }, []);

  const onPtrUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    gsap.to(cardRef.current, { scale: 1, rotation: initialRot, duration: 0.55, ease: "elastic.out(1,0.45)" });
    if (!didDrag.current) onClick();
  }, [initialRot, onClick]);

  return (
    <div
      ref={cardRef}
      style={{ position: "absolute", top: 0, left: 0, zIndex, touchAction: "none", cursor: "grab", willChange: "transform" }}
      onPointerDown={onPtrDown}
      onPointerMove={onPtrMove}
      onPointerUp={onPtrUp}
    >
      {children}
    </div>
  );
}

// ── Card faces ─────────────────────────────────────────────────────────────────
function DevCardFace({ project, scale = 1 }: { project: DevProject; scale?: number }) {
  const w        = Math.round(DEV_BASE.w        * scale);
  const imgH     = Math.round(DEV_BASE.imgH     * scale);
  const contentH = Math.round(DEV_BASE.contentH * scale);
  const pad      = Math.round(12 * scale);
  const fsTit    = scale < 0.80 ? "11px" : "14px";
  const fsSub    = scale < 0.80 ? "9px"  : "10px";
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] select-none"
      style={{ width: w, boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div className="relative overflow-hidden bg-gray-100 dark:bg-white/5" style={{ height: imgH }}>
        <Image src={project.image} alt={project.title} fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.42))" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: project.accent }} />
      </div>
      <div style={{ padding: pad, height: contentH, overflow: "hidden" }}>
        <h3 className="font-black text-gray-800 dark:text-gray-100 leading-tight mb-0.5" style={{ fontSize: fsTit }}>{project.title}</h3>
        <p className="font-medium mb-2" style={{ fontSize: fsSub, color: project.accent }}>{project.subtitle}</p>
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 text-[9px] rounded-full bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-gray-400">{t}</span>
          ))}
          {project.tags.length > 3 && <span className="text-[9px] text-gray-400 dark:text-gray-500">+{project.tags.length - 3}</span>}
        </div>
        <p className="text-[8px] text-gray-300 dark:text-white/20 italic mt-2">click to expand</p>
      </div>
    </div>
  );
}

function DesignCardFace({ card, scale = 1 }: { card: DesignCard; scale?: number }) {
  const w        = Math.round(DES_BASE.w        * scale);
  const imgH     = Math.round(DES_BASE.imgH     * scale);
  const contentH = Math.round(DES_BASE.contentH * scale);
  const pad      = Math.round(10 * scale);
  const iconSize = scale < 0.80 ? "2rem"  : "2.5rem";
  const fsTit    = scale < 0.80 ? "10px"  : "12px";
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] select-none"
      style={{ width: w, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}
    >
      <div
        className="flex items-center justify-center relative overflow-hidden"
        style={{ height: imgH, background: `linear-gradient(155deg, ${card.accent}28, ${card.accent}08)` }}
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 55% 38%, ${card.accent}40, transparent 62%)` }} />
        <div className="absolute top-2 right-2 w-10 h-10 rounded-full border opacity-20" style={{ borderColor: card.accent }} />
        <div className="absolute bottom-3 left-3 w-5 h-5 rounded-full border opacity-15" style={{ borderColor: card.accent }} />
        <span className="relative z-10" style={{ fontSize: iconSize, filter: `drop-shadow(0 0 10px ${card.accent}99)` }}>{card.icon}</span>
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: card.accent }} />
      </div>
      <div style={{ padding: pad, height: contentH, overflow: "hidden" }}>
        <h3 className="font-black text-gray-800 dark:text-gray-100 leading-tight mb-1.5" style={{ fontSize: fsTit }}>{card.title}</h3>
        <div className="flex flex-wrap gap-1">
          {card.tags.slice(0, 2).map(t => (
            <span key={t} className="px-1.5 py-0.5 text-[9px] rounded-full border" style={{ borderColor: `${card.accent}55`, color: card.accent }}>{t}</span>
          ))}
        </div>
        <p className="text-[8px] text-gray-300 dark:text-white/20 italic mt-1.5">click to expand</p>
      </div>
    </div>
  );
}

// ── Scatter ────────────────────────────────────────────────────────────────────
function scatter(idx: number, total: number, W: number, H: number, cW: number, cH: number) {
  const golden = 2.399963; // golden angle in radians
  const angle  = idx * golden;
  
  // Spiral radius grows with index, scaled to fit container
  const maxR   = Math.min(W - cW, H - cH) * 0.38;
  const r      = (idx === 0 ? 0 : maxR * Math.sqrt((idx + 0.5) / total));
  
  const cx = (W - cW) / 2;
  const cy = (H - cH) / 2;
  
  // Slight deterministic jitter per card
  const jx  = ((idx * 127 + 31) % 40) - 20;
  const jy  = ((idx * 89  + 23) % 32) - 16;
  const rot = ((idx * 47  +  7) % 24) - 12;

  const x = Math.round(Math.max(8, Math.min(cx + Math.cos(angle) * r + jx, W - cW - 8)));
  const y = Math.round(Math.max(8, Math.min(cy + Math.sin(angle) * r + jy, H - cH - 8)));

  return { x, y, rot };
}

// ── Messy Table (desktop only) ─────────────────────────────────────────────────
function MessyTable<T>({
  label, items, cardW, cardH, tableH, renderFace, onCardClick,
}: {
  label: string; items: T[]; cardW: number; cardH: number;
  tableH: number; renderFace: (item: T) => React.ReactNode; onCardClick: (item: T) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableW, setTableW] = useState(0);
  const [zOrders, setZOrders] = useState<number[]>(() => items.map((_, i) => i + 1));

  useEffect(() => {
    const update = () => { if (containerRef.current) setTableW(containerRef.current.offsetWidth); };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const bringToFront = useCallback((i: number) => {
    setZOrders(prev => {
      const max  = Math.max(...prev);
      const next = [...prev];
      next[i]    = max + 1;
      return next;
    });
  }, []);

  return (
    <div className="mb-16">
      <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 font-semibold mb-3">{label}</p>
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl border border-dashed border-gray-300 dark:border-white/[0.09] bg-gray-50/70 dark:bg-white/[0.015] overflow-visible"
        style={{ height: tableH }}
      >
        <div className="absolute inset-0 hero-grid opacity-[0.025] dark:opacity-[0.045] pointer-events-none rounded-2xl" />
        <p className="absolute bottom-2.5 right-3.5 text-[9px] text-gray-300 dark:text-white/15 select-none italic pointer-events-none">
          drag · click to open
        </p>
        {tableW > 0 && items.map((item, i) => {
          const { x, y, rot } = scatter(i, items.length, tableW, tableH, cardW, cardH);
          return (
            <DraggableCard
              key={i}
              initialX={x} initialY={y} initialRot={rot}
              zIndex={zOrders[i]}
              onBringToFront={() => bringToFront(i)}
              onClick={() => onCardClick(item)}
            >
              {renderFace(item)}
            </DraggableCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Mobile/Tablet: Vertical List ───────────────────────────────────────────────
function MobileDevList({ items, onCardClick }: { items: DevProject[]; onCardClick: (item: DevProject) => void }) {
  return (
    <div className="mb-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 font-semibold mb-4">
        — Development Projects
      </p>

      {/* Timeline line */}
      <div className="relative">
        <div
          className="absolute left-[5px] top-2 bottom-2 w-px"
          style={{ background: "rgba(128,128,128,0.12)" }}
        />

        <div className="space-y-4 pl-7">
          {items.map((project, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div
                className="absolute -left-7 top-4 w-3 h-3 rounded-full border-2 z-10"
                style={{
                  borderColor: project.accent,
                  background:  "var(--dot-bg, #fff)",
                  boxShadow:   `0 0 8px ${project.accent}88`,
                }}
              />

              <button
                onClick={() => onCardClick(project)}
                className="w-full text-left rounded-2xl overflow-hidden transition-transform duration-200 active:scale-[0.98]"
                style={{
                  background:  "var(--card-bg, #ffffff)",
                  border:      "1px solid rgba(128,128,128,0.1)",
                  boxShadow:   "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* Accent bar */}
                <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${project.accent}, ${project.accent}55)` }} />

                {/* Image strip */}
                <div className="relative w-full h-28 bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45))" }} />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white/60 text-[9px] tracking-[0.18em] uppercase font-medium">{project.subtitle}</p>
                    <h3 className="text-white font-black text-base leading-tight">{project.title}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.tags.slice(0, 4).map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[9px] rounded-full bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 self-center">+{project.tags.length - 4}</span>
                    )}
                  </div>
                  <p className="text-[9px] italic text-gray-300 dark:text-white/20">tap to expand</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileDesignList({ items, onCardClick }: { items: DesignCard[]; onCardClick: (item: DesignCard) => void }) {
  return (
    <div className="mb-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 font-semibold mb-4">
        — Graphic Design Work
      </p>

      <div className="relative">
        <div
          className="absolute left-[5px] top-2 bottom-2 w-px"
          style={{ background: "rgba(128,128,128,0.12)" }}
        />

        <div className="space-y-4 pl-7">
          {items.map((card, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div
                className="absolute -left-7 top-4 w-3 h-3 rounded-full border-2 z-10"
                style={{
                  borderColor: card.accent,
                  background:  "var(--dot-bg, #fff)",
                  boxShadow:   `0 0 8px ${card.accent}88`,
                }}
              />

              <button
                onClick={() => onCardClick(card)}
                className="w-full text-left rounded-2xl overflow-hidden transition-transform duration-200 active:scale-[0.98]"
                style={{
                  background: "var(--card-bg, #ffffff)",
                  border:     "1px solid rgba(128,128,128,0.1)",
                  boxShadow:  "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* Accent bar */}
                <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${card.accent}, ${card.accent}55)` }} />

                <div className="flex items-center gap-4 p-4">
                  {/* Icon circle */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${card.accent}28, ${card.accent}08)` }}
                  >
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 55% 38%, ${card.accent}40, transparent 62%)` }} />
                    <span className="relative z-10 text-2xl" style={{ filter: `drop-shadow(0 0 8px ${card.accent}99)` }}>{card.icon}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-black text-sm text-gray-800 dark:text-gray-100 leading-snug">{card.title}</h3>
                        <p className="text-[10px] font-medium mt-0.5" style={{ color: card.accent }}>{card.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.tags.slice(0, 3).map(t => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 text-[9px] rounded-full border"
                          style={{ borderColor: `${card.accent}55`, color: card.accent }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-[9px] italic text-gray-300 dark:text-white/20 mt-1">tap to expand</p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<ModalData | null>(null);

  const bp    = useBreakpoint();
  const sheet = isMobileOrTablet(bp);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const sc   = cardScale(bp);
  const rows = tableRowHeight(bp);

  const DEV_W       = Math.round(DEV_BASE.w * sc);
  const DEV_H       = Math.round((DEV_BASE.imgH + DEV_BASE.contentH) * sc);
  const devRowCount = Math.ceil(devProjects.length / Math.ceil(Math.sqrt(devProjects.length)));
  const DEV_TABLE_H = Math.round(DEV_H * devRowCount * 1.15 + 48);

  const DES_W       = Math.round(DES_BASE.w * sc);
  const DES_H       = Math.round((DES_BASE.imgH + DES_BASE.contentH) * sc);
  const DES_TABLE_H = Math.round(DES_H * rows + 48);

  return (
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-24 px-6 sm:px-10 lg:px-16 xl:px-24">
      {modal && <Modal data={modal} onClose={() => setModal(null)} sheet={sheet} />}

      <svg className="absolute top-12 right-0 w-48 opacity-[0.055] pointer-events-none" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" className="text-[#E0790B] dark:text-[#80CEFF]" />
        <circle cx="150" cy="150" r="78"  stroke="currentColor" strokeWidth="0.5" className="text-[#EFE00A] dark:text-[#F7B2FD]" />
        <line x1="20"  y1="150" x2="280" y2="150" stroke="currentColor" strokeWidth="0.5" className="text-[#E0790B] dark:text-[#80CEFF]" />
        <line x1="150" y1="20"  x2="150" y2="280" stroke="currentColor" strokeWidth="0.5" className="text-[#E0790B] dark:text-[#80CEFF]" />
      </svg>

      <div ref={headingRef} className="max-w-2xl mb-12 opacity-0">
        <h2 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-black bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent leading-tight mb-3">
          projects.
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          {sheet
            ? "Things I've built and designed — tap any card to read the full story."
            : "A messy table of things I've built and designed — drag them around or click to read the full story."}
        </p>
      </div>

      {sheet ? (
        // ── Mobile / Tablet: vertical static lists ──
        <>
          <MobileDevList    items={devProjects}  onCardClick={(p) => setModal({ type: "dev",    item: p })} />
          <MobileDesignList items={designCards}  onCardClick={(c) => setModal({ type: "design", item: c })} />
        </>
      ) : (
        // ── Desktop: draggable messy tables ──
        <>
          <MessyTable<DevProject>
            label="— Development Projects"
            items={devProjects}
            cardW={DEV_W} cardH={DEV_H} tableH={DEV_TABLE_H}
            renderFace={(p) => <DevCardFace project={p} scale={sc} />}
            onCardClick={(p) => setModal({ type: "dev", item: p })}
          />
          <MessyTable<DesignCard>
            label="— Graphic Design Work"
            items={designCards}
            cardW={DES_W} cardH={DES_H} tableH={DES_TABLE_H}
            renderFace={(c) => <DesignCardFace card={c} scale={sc} />}
            onCardClick={(c) => setModal({ type: "design", item: c })}
          />
        </>
      )}
    </section>
  );
}
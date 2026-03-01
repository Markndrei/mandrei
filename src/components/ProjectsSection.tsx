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
  { title: "Kantonize", subtitle: "Pancit Canton Customizer", description: "A frontend web app letting users fully customize their Pancit Canton — ingredients, spice levels, and toppings — with a fun interactive visualizer built with React and Framer Motion.", image: "/kantonize.png", link: "https://kantonize.vercel.app", tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"], accent: "#11BA0F" },
  { title: "IPSYNC", subtitle: "Internship & Collaboration Hub", description: "Full-stack platform bridging academia and industry — connecting students with internships, faculty with research, and industry partners with emerging talent. Features auth, database, and live API integrations.", image: "/ipsync.png", link: "https://ipsync.vercel.app", tags: ["Vue.js", "Tailwind CSS", "Full-Stack", "API", "Auth"], accent: "#E0790B" },
  { title: "Jinjaroos HCI", subtitle: "Group Website", description: "Website for the interdisciplinary HCI team behind IPSYNC — particle animations, human-centered interactions, and a compelling team presence.", image: "/hci-group.png", link: "https://hci-group-website.vercel.app", tags: ["React", "Next.js", "Particles", "Animation"], accent: "#11BA0F" },
  { title: "Rekom", subtitle: "Movie Recommendation System", description: "Hybrid ML recommendation engine combining collaborative filtering, content-based filtering, and NLP for personalized movie suggestions that address the cold-start problem.", image: "/rekom.png", link: "https://github.com/Markndrei/CCS-230-Final-Project", tags: ["Python", "ML", "NLP", "Data Mining"], accent: "#E0790B" },
  { title: "Sentisize", subtitle: "Emotion Group Analysis", description: "Web app extracting emotional sentiments from text via SVM and NLP, visualizing collective mood trends across groups for academic research in data mining.", image: "/sentisize.png", link: "https://github.com/Markndrei/Data-Mining", tags: ["SVM", "Sentiment", "NLP", "Fullstack"], accent: "#EFE00A" },
  { title: "WVSUTRACK", subtitle: "Fundays Scoreboard Tracker", description: "Real-time scoreboard tracker for WVSU Fundays events — delivering live score updates and rankings to enhance the event experience for participants and spectators.", image: "/wvsu-track.png", link: "https://www.figma.com/design/fVxJ9MQYoEsS6uGfAKW5tj/WVSU-FUNDAYS-REAL-TIME-SCOREBOARD?node-id=0-1", tags: ["Figma", "UI/UX", "Prototyping"], accent: "#11BA0F" },
];

const designCards: DesignCard[] = [
  { title: "Event Poster", subtitle: "University Campaign", description: "Bold typographic event poster for a university campaign — layered halftone textures, neon accent palette, strong visual hierarchy guiding the viewer's eye from title to details.", tags: ["Poster", "Typography", "Illustrator"], accent: "#E0790B", icon: "🎨" },
  { title: "Brand Identity", subtitle: "Startup Branding Kit", description: "Complete logo suite and brand guidelines for a local tech startup — primary mark, wordmark, icon variant, full color system, and type pairing for consistent communication.", tags: ["Branding", "Logo", "Figma"], accent: "#11BA0F", icon: "✦" },
  { title: "Social Graphics", subtitle: "Content Design Series", description: "Recurring Instagram and Facebook content series with a consistent grid layout, motion-inspired static frames, and a bold editorial aesthetic built for engagement.", tags: ["Social Media", "Content", "Photoshop"], accent: "#EFE00A", icon: "◈" },
  { title: "Infographic", subtitle: "Data Visualization", description: "Editorial infographic translating raw survey data into a scannable visual narrative — custom icon set, clear information hierarchy, and print-ready layout for academic publication.", tags: ["Infographic", "Illustration", "Data Viz"], accent: "#E0790B", icon: "◉" },
];

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.93, y: 28 }, { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: "back.out(1.6)" });
  }, []);

  const close = useCallback(() => {
    gsap.to(panelRef.current,   { opacity: 0, scale: 0.95, y: 16, duration: 0.2, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

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
    <div ref={overlayRef} className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8" style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }} onClick={close}>
      <div ref={panelRef} className="relative bg-white dark:bg-[#131313] rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg" style={{ maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>

        {/* Accent bar */}
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />

        {/* Close */}
        <button onClick={close} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-sm" aria-label="Close">✕</button>

        {/* Hero area */}
        {isDev ? (
          <div className="w-full h-52 relative bg-gray-100 dark:bg-white/5 overflow-hidden">
            <Image src={dev!.image} alt={dev!.title} fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.6))" }} />
            <div className="absolute bottom-4 left-5">
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">{dev!.subtitle}</p>
              <h2 className="text-white text-2xl font-black leading-tight">{dev!.title}</h2>
            </div>
          </div>
        ) : (
          <div className="w-full h-36 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${des!.accent}22, ${des!.accent}06)` }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 60% 40%, ${des!.accent}38, transparent 65%)` }} />
            <div className="absolute top-3 right-4 w-14 h-14 rounded-full border opacity-20" style={{ borderColor: des!.accent }} />
            <span className="text-6xl z-10" style={{ filter: `drop-shadow(0 0 18px ${des!.accent}90)` }}>{des!.icon}</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {!isDev && (
            <div>
              <h2 className="text-xl font-black text-gray-800 dark:text-gray-100">{des!.title}</h2>
              <p className="text-xs mt-0.5 font-medium" style={{ color: accent }}>{des!.subtitle}</p>
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{isDev ? dev!.description : des!.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {(isDev ? dev!.tags : des!.tags).map((t) => (
              <span key={t} className="px-2.5 py-1 text-[11px] rounded-full bg-gray-100 dark:bg-white/[0.07] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">{t}</span>
            ))}
          </div>
          {isDev ? (
            <a href={dev!.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-sm text-sm font-semibold tracking-wide uppercase text-white dark:text-black transition-all duration-300 hover:brightness-110" style={{ background: accent, boxShadow: `0 0 18px ${accent}55` }}>
              View Project
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">Graphic design work — files available on request.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Draggable wrapper — click vs drag distinguished by movement threshold ──────
const DRAG_THRESHOLD = 5;

interface DraggableProps {
  children: React.ReactNode;
  initialX: number; initialY: number; initialRot: number;
  zIndex: number;
  onBringToFront: () => void;
  onClick: () => void;
}

function DraggableCard({ children, initialX, initialY, initialRot, zIndex, onBringToFront, onClick }: DraggableProps) {
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
    <div ref={cardRef} style={{ position: "absolute", top: 0, left: 0, zIndex, touchAction: "none", cursor: "grab", willChange: "transform" }}
      onPointerDown={onPtrDown} onPointerMove={onPtrMove} onPointerUp={onPtrUp}>
      {children}
    </div>
  );
}

// ── Dev card face — 320×380 (matches Experience card size) ────────────────────
function DevCardFace({ project }: { project: DevProject }) {
  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] select-none" style={{ width: 320, boxShadow: "0 24px 64px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)" }}>
      {/* Image — 200px tall */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-white/5" style={{ height: 200 }}>
        <Image src={project.image} alt={project.title} fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.42))" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: project.accent }} />
      </div>
      {/* Content — 180px tall to reach 380px total */}
      <div className="p-5" style={{ height: 180 }}>
        <h3 className="font-black text-base text-gray-800 dark:text-gray-100 leading-tight mb-1">{project.title}</h3>
        <p className="text-[11px] font-semibold mb-3" style={{ color: project.accent }}>{project.subtitle}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-gray-400">{t}</span>
          ))}
          {project.tags.length > 3 && <span className="text-[10px] text-gray-400 dark:text-gray-500">+{project.tags.length - 3}</span>}
        </div>
        <p className="text-[9px] text-gray-300 dark:text-white/20 italic mt-3">click to expand</p>
      </div>
    </div>
  );
}

// ── Design card face — 320×380 (matches Experience card size) ─────────────────
function DesignCardFace({ card }: { card: DesignCard }) {
  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] select-none" style={{ width: 320, boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
      {/* Visual area — 230px */}
      <div className="flex items-center justify-center relative overflow-hidden" style={{ height: 230, background: `linear-gradient(155deg, ${card.accent}28, ${card.accent}08)` }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 55% 38%, ${card.accent}40, transparent 62%)` }} />
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full border opacity-20" style={{ borderColor: card.accent }} />
        <div className="absolute bottom-5 left-5 w-8 h-8 rounded-full border opacity-15" style={{ borderColor: card.accent }} />
        <span className="text-6xl relative z-10" style={{ filter: `drop-shadow(0 0 14px ${card.accent}99)` }}>{card.icon}</span>
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: card.accent }} />
      </div>
      {/* Title + tags + hint — 150px */}
      <div className="p-5" style={{ height: 150 }}>
        <h3 className="font-black text-base text-gray-800 dark:text-gray-100 leading-tight mb-1">{card.title}</h3>
        <p className="text-[11px] font-semibold mb-3" style={{ color: card.accent }}>{card.subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded-full border" style={{ borderColor: `${card.accent}55`, color: card.accent }}>{t}</span>
          ))}
        </div>
        <p className="text-[9px] text-gray-300 dark:text-white/20 italic">click to expand</p>
      </div>
    </div>
  );
}

// ── Scatter — deterministic, no Math.random ────────────────────────────────────
function scatter(idx: number, total: number, W: number, H: number, cW: number, cH: number) {
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  const col  = idx % cols;
  const row  = Math.floor(idx / cols);
  const cellW = (W - cW) / Math.max(cols - 1, 1);
  const cellH = (H - cH) / Math.max(rows - 1, 1);
  const jx  = ((idx * 127 + 31) % 60) - 30;
  const jy  = ((idx * 89  + 23) % 44) - 22;
  const rot = ((idx * 47  + 7 ) % 20) - 10;
  const x   = Math.max(8, Math.min(col * cellW + jx, W - cW - 8));
  const y   = Math.max(8, Math.min(row * cellH + jy, H - cH - 8));
  return { x, y, rot };
}

// ── Messy Table — full width via ResizeObserver ────────────────────────────────
function MessyTable<T>({ label, items, cardW, cardH, tableH, renderFace, onCardClick }: {
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
      const max = Math.max(...prev);
      const next = [...prev];
      next[i] = max + 1;
      return next;
    });
  }, []);

  return (
    <div className="mb-16">
      <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 font-semibold mb-3">{label}</p>
      <div ref={containerRef} className="relative w-full rounded-2xl border border-dashed border-gray-300 dark:border-white/[0.09] bg-gray-50/70 dark:bg-white/[0.015] overflow-visible" style={{ height: tableH }}>
        <div className="absolute inset-0 hero-grid opacity-[0.025] dark:opacity-[0.045] pointer-events-none rounded-2xl" />
        <p className="absolute bottom-2.5 right-3.5 text-[9px] text-gray-300 dark:text-white/15 select-none italic pointer-events-none">drag · click to open</p>
        {tableW > 0 && items.map((item, i) => {
          const { x, y, rot } = scatter(i, items.length, tableW, tableH, cardW, cardH);
          return (
            <DraggableCard key={i} initialX={x} initialY={y} initialRot={rot} zIndex={zOrders[i]} onBringToFront={() => bringToFront(i)} onClick={() => onCardClick(item)}>
              {renderFace(item)}
            </DraggableCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<ModalData | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  // Dev: 320w × 380h card — table tall enough for 2 rows with breathing room
  const DEV_W = 320, DEV_H = 380, DEV_TABLE_H = 720;
  // Design: 320w × 380h card — table tall enough for 2 rows
  const DES_W = 320, DES_H = 380, DES_TABLE_H = 680;

  return (
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-24 px-6 sm:px-10 lg:px-16 xl:px-24">
      {modal && <Modal data={modal} onClose={() => setModal(null)} />}

      {/* deco */}
      <svg className="absolute top-12 right-0 w-48 opacity-[0.055] pointer-events-none" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" className="text-[#E0790B] dark:text-[#80CEFF]" />
        <circle cx="150" cy="150" r="78" stroke="currentColor" strokeWidth="0.5" className="text-[#EFE00A] dark:text-[#F7B2FD]" />
        <line x1="20" y1="150" x2="280" y2="150" stroke="currentColor" strokeWidth="0.5" className="text-[#E0790B] dark:text-[#80CEFF]" />
        <line x1="150" y1="20" x2="150" y2="280" stroke="currentColor" strokeWidth="0.5" className="text-[#E0790B] dark:text-[#80CEFF]" />
      </svg>

      <div ref={headingRef} className="max-w-2xl mb-12 opacity-0">
        <h2 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-black bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent leading-tight mb-3">
          projects.
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          A messy table of things I&apos;ve built and designed — drag them around or click to read the full story.
        </p>
      </div>

      <MessyTable<DevProject>
        label="— Development Projects"
        items={devProjects}
        cardW={DEV_W} cardH={DEV_H} tableH={DEV_TABLE_H}
        renderFace={(p) => <DevCardFace project={p} />}
        onCardClick={(p) => setModal({ type: "dev", item: p })}
      />

      <MessyTable<DesignCard>
        label="— Graphic Design Work"
        items={designCards}
        cardW={DES_W} cardH={DES_H} tableH={DES_TABLE_H}
        renderFace={(c) => <DesignCardFace card={c} />}
        onCardClick={(c) => setModal({ type: "design", item: c })}
      />
    </section>
  );
}
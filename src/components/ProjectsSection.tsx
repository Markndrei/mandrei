"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface DevProject {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}
interface DesignCard {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  /* Monochrome geometric mark — no emoji, which would drag colour back in. */
  mark: string;
  image?: string;
}
interface ModalData {
  type: "dev" | "design";
  item: DevProject | DesignCard;
}

const devProjects: DevProject[] = [
  { title: "Kantonize", subtitle: "Pancit Canton Customizer", description: "A frontend web app letting users fully customize their Pancit Canton — ingredients, spice levels, and toppings — with a fun interactive visualizer built with React and Framer Motion.", image: "/kantonize.png", link: "https://kantonize.vercel.app", tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { title: "IPSYNC", subtitle: "Internship & Collaboration Hub", description: "Full-stack platform bridging academia and industry — connecting students with internships, faculty with research, and industry partners with emerging talent. Features auth, database, and live API integrations.", image: "/ipsync.png", link: "https://ipsync.vercel.app", tags: ["Vue.js", "Tailwind CSS", "Full-Stack", "API", "Auth"] },
  { title: "Jinjaroos HCI", subtitle: "Group Website", description: "Website for the interdisciplinary HCI team behind IPSYNC — particle animations, human-centered interactions, and a compelling team presence.", image: "/hci-group.png", link: "https://hci-group-website.vercel.app", tags: ["React", "Next.js", "Particles", "Animation"] },
  { title: "Rekom", subtitle: "Movie Recommendation System", description: "Hybrid ML recommendation engine combining collaborative filtering, content-based filtering, and NLP for personalized movie suggestions that address the cold-start problem.", image: "/rekom.png", link: "https://github.com/Markndrei/CCS-230-Final-Project", tags: ["Python", "ML", "NLP", "Data Mining"] },
  { title: "Sentisize", subtitle: "Emotion Group Analysis", description: "Web app extracting emotional sentiments from text via SVM and NLP, visualizing collective mood trends across groups for academic research in data mining.", image: "/sentisize.png", link: "https://github.com/Markndrei/Data-Mining", tags: ["SVM", "Sentiment", "NLP", "Fullstack"] },
  { title: "WVSUTRACK", subtitle: "Fundays Scoreboard Tracker", description: "Real-time scoreboard tracker for WVSU Fundays events — delivering live score updates and rankings to enhance the event experience for participants and spectators.", image: "/wvsu-track.png", link: "https://www.figma.com/design/fVxJ9MQYoEsS6uGfAKW5tj/WVSU-FUNDAYS-REAL-TIME-SCOREBOARD?node-id=0-1", tags: ["Figma", "UI/UX", "Prototyping"] },
  { title: "CICT Website", subtitle: "Official CICT Website", description: "The official website of WVSU-CICT that contains synopsis, programs offered, and faculty directory that helps enrollees and other individuals know more about the college.", image: "/cict-website.png", link: "#", tags: ["Figma", "UI/UX", "Prototyping"] },
  { title: "Caffeinated Spaces", subtitle: "Iloilo City Coffee Shops Hub", description: "Curation of different coffee shops within Iloilo, it scopes within the seven (7) region of the Iloilo City, featuring 13 coffee shops.", image: "/caffeinated-spaces.png", link: "https://caffeinatedspaces.vercel.app", tags: ["Figma", "UI/UX", "Prototyping", "Next.js", "Tailwind CSS"] },
  { title: "WVSU RE:Claim", subtitle: "WVSU Official Lost and Found System", description: "This serves as the official lost and found hub for WVSU learners, allowing them to post lost or found items for claiming.", image: "/wvsu-track.png", link: "#", tags: ["Figma", "UI/UX", "Prototyping"] },
  { title: "DOST Project Visualization", subtitle: "Nationwide DOST Projects Visualization", description: "This contains the projects that DOST have from 1976 to the present, providing an information dashboard for project tracking and transparency.", image: "/kantonize.png", link: "#", tags: ["React", "Tailwind", "Node", "Clean Architecture", "Redux"] },
];

const designCards: DesignCard[] = [
  { title: "Event Poster", subtitle: "University Campaign", description: "Bold typographic event poster for a university campaign — layered halftone textures, neon accent palette, strong visual hierarchy guiding the viewer's eye from title to details.", tags: ["Poster", "Typography", "Illustrator"], mark: "◇" },
  { title: "Brand Identity", subtitle: "Startup Branding Kit", description: "Complete logo suite and brand guidelines for a local tech startup — primary mark, wordmark, icon variant, full color system, and type pairing for consistent communication.", tags: ["Branding", "Logo", "Figma"], mark: "✦" },
  { title: "Social Graphics", subtitle: "Content Design Series", description: "Recurring Instagram and Facebook content series with a consistent grid layout, motion-inspired static frames, and a bold editorial aesthetic built for engagement.", tags: ["Social Media", "Content", "Photoshop"], mark: "◈" },
  { title: "Infographic", subtitle: "Data Visualization", description: "Editorial infographic translating raw survey data into a scannable visual narrative — custom icon set, clear information hierarchy, and print-ready layout for academic publication.", tags: ["Infographic", "Illustration", "Data Viz"], mark: "◉" },
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

const DEV_BASE = { w: 240, imgH: 148, contentH: 118 };
const DES_BASE = { w: 168, imgH: 168, contentH: 92 };

function cardScale(bp: Breakpoint): number {
  switch (bp) {
    case "xs": return 0.65;
    case "sm": return 0.75;
    case "md": return 0.88;
    case "lg": return 1.0;
    case "xl": return 1.05;
    case "2xl": return 1.15;
  }
}

function tableRowHeight(bp: Breakpoint): number {
  switch (bp) {
    case "xs":
    case "sm": return 3.0;
    case "md": return 2.5;
    default: return 2.2;
  }
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
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
  const panelRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
    if (closing.current) return;
    closing.current = true;
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

  const isDev = data.type === "dev";
  const dev = isDev ? (data.item as DevProject) : null;
  const des = !isDev ? (data.item as DesignCard) : null;
  const item = data.item;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[200] flex justify-center"
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
        className="plate relative w-full overflow-x-hidden overflow-y-auto"
        style={{ maxWidth: sheet ? "100%" : "32rem", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {sheet && (
          <div className="flex justify-center pt-3 pb-1">
            <span className="h-0.5 w-9 bg-line2" />
          </div>
        )}

        <span className="block h-px w-14 bg-spark" aria-hidden="true" />

        <button
          onClick={close}
          className="absolute right-3 z-10 flex h-8 w-8 items-center justify-center border border-line bg-s1 text-t3 transition-colors duration-200 hover:border-spark hover:text-spark"
          style={{ top: sheet ? "2.5rem" : "0.75rem" }}
          aria-label="Close"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* The print */}
        {isDev ? (
          <div className="relative w-full bg-s2" style={{ height: sheet ? "11rem" : "14rem" }}>
            <Image src={dev!.image} alt={`Screenshot of ${dev!.title}`} fill className="object-cover" />
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center bg-s2"
            style={{ height: sheet ? "8rem" : "10rem" }}
          >
            <span className="text-5xl text-t3" aria-hidden="true">
              {des!.mark}
            </span>
          </div>
        )}

        <div className="space-y-5 p-6 sm:p-7">
          <div>
            <p className="meta-sm mb-2">{item.subtitle}</p>
            <h3 className="display text-3xl text-t1">{item.title}</h3>
          </div>

          <p className="text-sm leading-relaxed font-light text-t2">
            {item.description}
          </p>

          <div>
            <p className="meta-sm mb-2">built with</p>
            <p className="mono text-[0.6875rem] leading-relaxed tracking-[0.1em] text-t2">
              {item.tags.join("  ·  ")}
            </p>
          </div>

          {isDev && dev!.link !== "#" ? (
            <a
              href={dev!.link}
              target="_blank"
              rel="noopener noreferrer"
              className="spark-glow mono group inline-flex items-center gap-3 bg-spark px-6 py-3 text-[0.6875rem] font-medium tracking-[0.16em] uppercase on-spark"
            >
              view project
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8m9 0v9" />
              </svg>
            </a>
          ) : (
            <p className="meta-sm">
              {isDev ? "private build — walkthrough on request" : "print work — files on request"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Draggable wrapper — logic unchanged ─────────────────────────────────── */
const DRAG_THRESHOLD = 5;

interface DraggableProps {
  children: React.ReactNode;
  initialX: number;
  initialY: number;
  initialRot: number;
  zIndex: number;
  onBringToFront: () => void;
  onClick: () => void;
}

function DraggableCard({
  children,
  initialX,
  initialY,
  initialRot,
  zIndex,
  onBringToFront,
  onClick,
}: DraggableProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: initialX, y: initialY });
  const curPos = useRef({ x: initialX, y: initialY });

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, { x: initialX, y: initialY, rotation: initialRot });
    curPos.current = { x: initialX, y: initialY };
    startPos.current = { x: initialX, y: initialY };
  }, [initialX, initialY, initialRot]);

  const onPtrDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      e.preventDefault();
      dragging.current = true;
      didDrag.current = false;
      onBringToFront();
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...curPos.current };
      cardRef.current?.setPointerCapture(e.pointerId);
      gsap.to(cardRef.current, { scale: 1.05, rotation: initialRot * 0.25, duration: 0.18, ease: "power2.out" });
    },
    [onBringToFront, initialRot]
  );

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
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex,
        touchAction: "none",
        cursor: "grab",
        willChange: "transform",
      }}
      onPointerDown={onPtrDown}
      onPointerMove={onPtrMove}
      onPointerUp={onPtrUp}
    >
      {children}
    </div>
  );
}

/* ── Card faces: a print in a mount, with the caption in the rebate ─────── */
function DevCardFace({
  project,
  index,
  scale = 1,
}: {
  project: DevProject;
  index: number;
  scale?: number;
}) {
  const w = Math.round(DEV_BASE.w * scale);
  const imgH = Math.round(DEV_BASE.imgH * scale);
  const contentH = Math.round(DEV_BASE.contentH * scale);

  return (
    <div className="group relative select-none" style={{ width: w }}>
      {/* Grease-pencil select mark */}
      <span className="grease" aria-hidden="true" />

      <div
        className="plate p-2"
        style={{ boxShadow: "0 14px 44px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)" }}
      >
        <div className="relative overflow-hidden bg-s2" style={{ height: imgH }}>
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover"
            sizes="280px"
          />
        </div>

        <div
          className="flex flex-col justify-between pt-2.5"
          style={{ height: contentH, overflow: "hidden" }}
        >
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="mono text-[0.5rem] tracking-[0.16em] text-t3">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mono text-[0.5rem] tracking-[0.14em] text-t3 uppercase">
                {project.tags[0]}
              </span>
            </div>
            <h3 className="text-sm leading-tight font-light tracking-tight text-t1">
              {project.title}
            </h3>
            <p className="mono mt-1 text-[0.5rem] tracking-[0.1em] text-t3 uppercase">
              {project.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignCardFace({
  card,
  index,
  scale = 1,
}: {
  card: DesignCard;
  index: number;
  scale?: number;
}) {
  const w = Math.round(DES_BASE.w * scale);
  const imgH = Math.round(DES_BASE.imgH * scale);
  const contentH = Math.round(DES_BASE.contentH * scale);

  return (
    <div className="group relative select-none" style={{ width: w }}>
      <span className="grease" aria-hidden="true" />

      <div
        className="plate p-2"
        style={{ boxShadow: "0 14px 44px rgba(0,0,0,0.22)" }}
      >
        <div className="flex items-center justify-center bg-s2" style={{ height: imgH }}>
          <span
            className="text-t3 transition-colors duration-300 group-hover:text-t2"
            style={{ fontSize: `${Math.round(34 * scale)}px` }}
            aria-hidden="true"
          >
            {card.mark}
          </span>
        </div>

        <div className="pt-2.5" style={{ height: contentH, overflow: "hidden" }}>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <span className="mono text-[0.5rem] tracking-[0.16em] text-t3">
              D{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-xs leading-tight font-light tracking-tight text-t1">
            {card.title}
          </h3>
          <p className="mono mt-1 text-[0.5rem] tracking-[0.1em] text-t3 uppercase">
            {card.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Scatter — unchanged golden-angle spiral ─────────────────────────────── */
function scatter(idx: number, total: number, W: number, H: number, cW: number, cH: number) {
  const golden = 2.399963;
  const angle = idx * golden;

  const maxR = Math.min(W - cW, H - cH) * 0.38;
  const r = idx === 0 ? 0 : maxR * Math.sqrt((idx + 0.5) / total);

  const cx = (W - cW) / 2;
  const cy = (H - cH) / 2;

  const jx = ((idx * 127 + 31) % 40) - 20;
  const jy = ((idx * 89 + 23) % 32) - 16;
  const rot = ((idx * 47 + 7) % 24) - 12;

  const x = Math.round(Math.max(8, Math.min(cx + Math.cos(angle) * r + jx, W - cW - 8)));
  const y = Math.round(Math.max(8, Math.min(cy + Math.sin(angle) * r + jy, H - cH - 8)));

  return { x, y, rot };
}

/* ── The light table ────────────────────────────────────────────────────── */
function LightTable<T>({
  label,
  count,
  items,
  cardW,
  cardH,
  tableH,
  renderFace,
  onCardClick,
}: {
  label: string;
  count: string;
  items: T[];
  cardW: number;
  cardH: number;
  tableH: number;
  renderFace: (item: T, index: number) => React.ReactNode;
  onCardClick: (item: T) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tableW, setTableW] = useState(0);
  const [zOrders, setZOrders] = useState<number[]>(() => items.map((_, i) => i + 1));

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setTableW(containerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const bringToFront = useCallback((i: number) => {
    setZOrders((prev) => {
      const max = Math.max(...prev);
      const next = [...prev];
      next[i] = max + 1;
      return next;
    });
  }, []);

  return (
    <div className="mb-20">
      <div className="mb-4 flex items-center gap-4">
        <p className="meta whitespace-nowrap">{label}</p>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <p className="meta whitespace-nowrap">{count}</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-visible border border-line bg-s2/40"
        style={{ height: tableH }}
      >
        <div
          className="hero-grid pointer-events-none absolute inset-0 text-t1 opacity-[0.02] dark:opacity-[0.03]"
          aria-hidden="true"
        />
        <p className="meta-sm pointer-events-none absolute right-3 bottom-3 select-none">
          drag · click to open
        </p>

        {tableW > 0 &&
          items.map((item, i) => {
            const { x, y, rot } = scatter(i, items.length, tableW, tableH, cardW, cardH);
            return (
              <DraggableCard
                key={i}
                initialX={x}
                initialY={y}
                initialRot={rot}
                zIndex={zOrders[i]}
                onBringToFront={() => bringToFront(i)}
                onClick={() => onCardClick(item)}
              >
                {renderFace(item, i)}
              </DraggableCard>
            );
          })}
      </div>
    </div>
  );
}

/* ── Mobile: a real contact sheet — two-up grid of frames ────────────────── */
function ContactSheet({
  label,
  count,
  children,
}: {
  label: string;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-14">
      <div className="mb-4 flex items-center gap-4">
        <p className="meta whitespace-nowrap">{label}</p>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <p className="meta whitespace-nowrap">{count}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">{children}</div>
    </div>
  );
}

function MobileDevFrame({
  project,
  index,
  onClick,
}: {
  project: DevProject;
  index: number;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="plate group relative p-2 text-left">
      <div className="relative aspect-[4/3] overflow-hidden bg-s2">
        <Image
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      </div>
      <div className="pt-2">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="mono text-[0.5rem] tracking-[0.16em] text-t3">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mono text-[0.5rem] tracking-[0.14em] text-t3 uppercase">
            {project.tags[0]}
          </span>
        </div>
        <h3 className="text-xs leading-tight font-light text-t1">{project.title}</h3>
        <p className="mono mt-0.5 text-[0.5rem] tracking-[0.1em] text-t3 uppercase">
          {project.subtitle}
        </p>
      </div>
    </button>
  );
}

function MobileDesignFrame({
  card,
  index,
  onClick,
}: {
  card: DesignCard;
  index: number;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="plate group relative p-2 text-left">
      <div className="flex aspect-[4/3] items-center justify-center bg-s2">
        <span className="text-3xl text-t3" aria-hidden="true">
          {card.mark}
        </span>
      </div>
      <div className="pt-2">
        <span className="mono mb-1 block text-[0.5rem] tracking-[0.16em] text-t3">
          D{String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-xs leading-tight font-light text-t1">{card.title}</h3>
        <p className="mono mt-0.5 text-[0.5rem] tracking-[0.1em] text-t3 uppercase">
          {card.subtitle}
        </p>
      </div>
    </button>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalData | null>(null);

  const bp = useBreakpoint();
  const sheet = isMobileOrTablet(bp);

  const sc = cardScale(bp);
  const rows = tableRowHeight(bp);

  const DEV_W = Math.round(DEV_BASE.w * sc);
  const DEV_H = Math.round((DEV_BASE.imgH + DEV_BASE.contentH) * sc);
  const devRowCount = Math.ceil(devProjects.length / Math.ceil(Math.sqrt(devProjects.length)));
  const DEV_TABLE_H = Math.round(DEV_H * devRowCount * 1.15 + 48);

  const DES_W = Math.round(DES_BASE.w * sc);
  const DES_H = Math.round((DES_BASE.imgH + DES_BASE.contentH) * sc);
  const DES_TABLE_H = Math.round(DES_H * rows + 48);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen px-6 py-28 sm:px-10 lg:px-16 xl:px-24"
    >
      <div className="key-light" aria-hidden="true" />

      {modal && <Modal data={modal} onClose={() => setModal(null)} sheet={sheet} />}

      <SectionHeading
        frame="04"
        label="selected work"
        title="projects"
        caption={
          sheet
            ? "A contact sheet of what I've built and designed. Tap any frame for the full entry."
            : "Prints laid out on the light table. Drag them around, or click one to read the full entry."
        }
        className="mb-16 max-w-2xl"
      />

      {sheet ? (
        <>
          <ContactSheet label="development" count={`${devProjects.length} frames`}>
            {devProjects.map((p, i) => (
              <MobileDevFrame
                key={i}
                project={p}
                index={i}
                onClick={() => setModal({ type: "dev", item: p })}
              />
            ))}
          </ContactSheet>

          <ContactSheet label="graphic design" count={`${designCards.length} frames`}>
            {designCards.map((c, i) => (
              <MobileDesignFrame
                key={i}
                card={c}
                index={i}
                onClick={() => setModal({ type: "design", item: c })}
              />
            ))}
          </ContactSheet>
        </>
      ) : (
        <>
          <LightTable<DevProject>
            label="development"
            count={`${devProjects.length} frames`}
            items={devProjects}
            cardW={DEV_W}
            cardH={DEV_H}
            tableH={DEV_TABLE_H}
            renderFace={(p, i) => <DevCardFace project={p} index={i} scale={sc} />}
            onCardClick={(p) => setModal({ type: "dev", item: p })}
          />
          <LightTable<DesignCard>
            label="graphic design"
            count={`${designCards.length} frames`}
            items={designCards}
            cardW={DES_W}
            cardH={DES_H}
            tableH={DES_TABLE_H}
            renderFace={(c, i) => <DesignCardFace card={c} index={i} scale={sc} />}
            onCardClick={(c) => setModal({ type: "design", item: c })}
          />
        </>
      )}
    </section>
  );
}

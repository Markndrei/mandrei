"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "UI/UX Design",    value: 90, lightColor: "#E0790B", darkColor: "#80CEFF" },
  { name: "Frontend Dev",    value: 82, lightColor: "#11BA0F", darkColor: "#F7B2FD" },
  { name: "React / Next.js", value: 78, lightColor: "#E0790B", darkColor: "#80CEFF" },
  { name: "Tailwind CSS",    value: 88, lightColor: "#EFE00A", darkColor: "#c084fc" },
  { name: "Graphic Design",  value: 85, lightColor: "#11BA0F", darkColor: "#F7B2FD" },
  { name: "Photography",     value: 72, lightColor: "#E0790B", darkColor: "#80CEFF" },
];

const circleSkills = [
  { name: "Figma",       value: 90, lightColor: "#E0790B", darkColor: "#80CEFF" },
  { name: "Vue.js",      value: 70, lightColor: "#11BA0F", darkColor: "#F7B2FD" },
  { name: "Python / ML", value: 60, lightColor: "#EFE00A", darkColor: "#c084fc" },
];

/** Watch document.documentElement for class changes and return isDark */
function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Set initial value after mount
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for future changes (theme toggle adds/removes "dark")
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function CircleStat({ name, value, lightColor, darkColor }: {
  name: string; value: number; lightColor: string; darkColor: string;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);
  const r           = 40;
  const circumference = 2 * Math.PI * r;
  const isDark      = useIsDark();
  const color       = isDark ? darkColor : lightColor;

  // Scroll-triggered animation (runs once)
  useEffect(() => {
    const dashOffset = circumference * (1 - value / 100);
    const counter = { val: 0 };
    gsap.fromTo(circleRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: dashOffset, duration: 1.5, ease: "power3.out",
        scrollTrigger: { trigger: circleRef.current, start: "top 85%", once: true } }
    );
    gsap.to(counter, {
      val: value, duration: 1.5, ease: "power3.out",
      onUpdate: () => { if (numRef.current) numRef.current.textContent = Math.round(counter.val) + "%"; },
      scrollTrigger: { trigger: circleRef.current, start: "top 85%", once: true },
    });
  }, [circumference, value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-white/10" />
          <circle
            ref={circleRef}
            cx="50" cy="50" r={r} fill="none"
            stroke={color}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke 0.4s ease, filter 0.4s ease" }}
          />
        </svg>
        <span ref={numRef} className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
          0%
        </span>
      </div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">{name}</p>
    </div>
  );
}

function SkillBar({ name, value, lightColor, darkColor, delay }: {
  name: string; value: number; lightColor: string; darkColor: string; delay: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const isDark  = useIsDark();
  const color   = isDark ? darkColor : lightColor;

  // Scroll-triggered animation (runs once)
  useEffect(() => {
    const counter = { val: 0 };
    gsap.fromTo(barRef.current, { scaleX: 0 }, {
      scaleX: value / 100, duration: 1.2, ease: "power3.out", delay,
      scrollTrigger: { trigger: barRef.current, start: "top 88%", once: true },
    });
    gsap.to(counter, {
      val: value, duration: 1.2, ease: "power3.out", delay,
      onUpdate: () => { if (numRef.current) numRef.current.textContent = Math.round(counter.val) + "%"; },
      scrollTrigger: { trigger: barRef.current, start: "top 88%", once: true },
    });
  }, [value, delay]);

  return (
    <div className="group space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
        <span ref={numRef} className="text-xs font-mono" style={{ color, transition: "color 0.4s ease" }}>0%</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full origin-left rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function GrowthLine() {
  const pathRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const isDark  = useIsDark();

  const lightStart = "#E0790B"; const lightEnd = "#11BA0F";
  const darkStart  = "#80CEFF"; const darkEnd  = "#F7B2FD";
  const dotColor   = isDark ? darkStart : lightStart;

  const years  = [2016, 2018, 2020, 2022, 2024];
  const values = [10, 30, 55, 75, 90];
  const w = 280; const h = 80;

  const points = years.map((_, i) => ({
    x: (i / (years.length - 1)) * w,
    y: h - (values[i] / 100) * h,
  }));

  const d = points.reduce((acc, p, i) =>
    i === 0 ? `M ${p.x} ${p.y}`
    : `${acc} C ${points[i-1].x+30} ${points[i-1].y}, ${p.x-30} ${p.y}, ${p.x} ${p.y}`,
  "");

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, duration: 2, ease: "power3.inOut",
      scrollTrigger: { trigger: path, start: "top 85%", once: true },
    });
    gsap.fromTo(dotsRef.current?.querySelectorAll("circle") ?? [],
      { scale: 0, transformOrigin: "center" },
      { scale: 1, duration: 0.4, stagger: 0.15, ease: "back.out(2)", delay: 1.2,
        scrollTrigger: { trigger: path, start: "top 85%", once: true } }
    );
  }, []);

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full overflow-visible">
      {[0, 25, 50, 75, 100].map((v) => (
        <line key={v} x1={0} y1={h-(v/100)*h} x2={w} y2={h-(v/100)*h}
          stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.15" strokeDasharray="4 4" />
      ))}
      <path ref={pathRef} d={d} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={isDark ? darkStart : lightStart} style={{ transition: "stop-color 0.4s" }} />
          <stop offset="100%" stopColor={isDark ? darkEnd   : lightEnd}   style={{ transition: "stop-color 0.4s" }} />
        </linearGradient>
      </defs>
      <g ref={dotsRef}>
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4}  fill={dotColor} style={{ transition: "fill 0.4s" }} />
            <circle cx={p.x} cy={p.y} r={8}  fill={dotColor} fillOpacity="0.15" style={{ transition: "fill 0.4s" }} />
            <text x={p.x} y={h+16} textAnchor="middle" fontSize="9" fill="currentColor" opacity={0.4}>
              {years[i]}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 px-6 sm:px-10 lg:px-16 xl:px-24 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none hero-grid" />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-[#E0790B]/[0.08] dark:bg-[#80CEFF]/10" />

      <div ref={headingRef} className="mb-16 opacity-0">
        <h2 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-black bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent leading-tight mb-3">
          skills.
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Tools I wield. Disciplines I practice.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl">
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-8">Proficiency</h3>
          {skills.map((skill, i) => (
            <SkillBar key={skill.name} {...skill} delay={i * 0.08} />
          ))}
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-8">Focus Areas</h3>
          <div className="grid grid-cols-3 gap-6">
            {circleSkills.map((s) => <CircleStat key={s.name} {...s} />)}
          </div>
          <div className="mt-12">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-6">Growth Timeline</h3>
            <GrowthLine />
          </div>
        </div>
      </div>
    </section>
  );
}
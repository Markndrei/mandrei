"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroSectionProps {
  animate: boolean;
}

const ROLES = [
  "front-end developer",
  "ui/ux designer",
  "graphic artist",
  "photographer",
];

export default function HeroSection({ animate }: HeroSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const rebateRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const rolesRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => setIsMounted(true), []);

  /* Mouse-follow key light — the studio lamp. A white wash now, not a
     coloured blob, so it reads as light falling on the set. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !washRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      gsap.to(washRef.current, {
        x: e.clientX - rect.left - 260,
        y: e.clientY - rect.top - 260,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(washRef.current, { opacity: 0, duration: 0.6 });

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* Magnetic primary action — kept from the original build */
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect();
      gsap.to(cta, {
        x: (e.clientX - (rect.left + rect.width / 2)) * 0.3,
        y: (e.clientY - (rect.top + rect.height / 2)) * 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(cta, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });

    cta.addEventListener("mousemove", onMove as EventListener);
    cta.addEventListener("mouseleave", onLeave);
    return () => {
      cta.removeEventListener("mousemove", onMove as EventListener);
      cta.removeEventListener("mouseleave", onLeave);
    };
  }, [isMounted]);

  /* Entrance: the plate is loaded, then the title is set, then the frame
     is marked. One orchestrated sequence rather than scattered fades. */
  useEffect(() => {
    if (!animate) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [
      rebateRef.current,
      line1Ref.current,
      line2Ref.current,
      rolesRef.current,
      actionsRef.current,
      plateRef.current,
    ];

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(rebateRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          [line1Ref.current, line2Ref.current],
          { opacity: 0, yPercent: 105 },
          { opacity: 1, yPercent: 0, duration: 1.05, stagger: 0.09 },
          "-=0.3"
        )
        .fromTo(
          rolesRef.current?.children ?? [],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          "-=0.55"
        )
        .fromTo(actionsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.35")
        .fromTo(
          plateRef.current,
          { opacity: 0, scale: 0.96, filter: "blur(6px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1 },
          "-=1.1"
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [animate]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center gap-14 overflow-hidden px-6 pt-28 pb-20 sm:px-10 md:flex-row md:gap-16 md:pt-20 lg:gap-24 lg:px-16 xl:px-24"
    >
      {/* Static key light */}
      <div className="key-light" aria-hidden="true" />

      {/* Measuring grid */}
      <div
        className="hero-grid pointer-events-none absolute inset-0 text-t1 opacity-[0.025] dark:opacity-[0.04]"
        aria-hidden="true"
      />

      {/* Mouse-follow studio lamp */}
      <div
        ref={washRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[520px] w-[520px] rounded-full opacity-0 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--light-wash) 0%, transparent 70%)",
        }}
      />

      {/* ── Title block ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Rebate */}
        <div ref={rebateRef} className="mb-7 flex items-center gap-4 opacity-0">
          <span className="meta whitespace-nowrap">frame 01</span>
          <span className="h-px flex-1 bg-line2" aria-hidden="true" />
          <span className="meta whitespace-nowrap">iloilo · ph</span>
        </div>

        {/* The name. Two lines, weight 200, set tight. */}
        <h1
          className="display-tight mb-8 text-t1"
          style={{ fontSize: "clamp(3.4rem, 13vw, 8.5rem)" }}
        >
          <span className="block overflow-hidden">
            <span ref={line1Ref} className="block opacity-0">
              mark
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line2Ref} className="block opacity-0">
              encanto<span className="text-spark">.</span>
            </span>
          </span>
        </h1>

        {/* Roles, as a mono index rather than a sentence */}
        <ul ref={rolesRef} className="mb-10 flex flex-col gap-1.5">
          {ROLES.map((role) => (
            <li key={role} className="meta flex items-center gap-3 opacity-0">
              <span className="h-px w-5 bg-line2" aria-hidden="true" />
              {role}
            </li>
          ))}
        </ul>

        {/* Actions + status */}
        <div ref={actionsRef} className="flex flex-wrap items-center gap-x-7 gap-y-4 opacity-0">
          <a
            ref={ctaRef}
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Mark Encanto's resume as a PDF"
            className="spark-glow mono group inline-flex items-center gap-3 bg-spark px-7 py-3.5 text-xs font-medium tracking-[0.16em] uppercase on-spark"
          >
            view resume
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8m9 0v9" />
            </svg>
          </a>

          <a
            href="#projects"
            className="rule-grow mono text-xs font-medium tracking-[0.16em] text-t2 uppercase transition-colors duration-300 hover:text-t1"
          >
            selected work
          </a>

          <span className="meta flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-spark opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-spark" />
            </span>
            open to work
          </span>
        </div>
      </div>

      {/* ── The plate ───────────────────────────────────────────────────── */}
      <div ref={plateRef} className="relative z-10 w-full max-w-sm shrink-0 opacity-0 md:max-w-xs lg:max-w-sm">
        <div className="crop-marks plate relative p-3">
          <div className="relative bg-s2">
            <Image
              src="/hero-light.svg"
              width={450}
              height={450}
              className="plate-image w-full dark:hidden"
              alt="Mark Encanto at his desk, holding a camera"
              priority
            />
            <Image
              src="/hero.svg"
              width={450}
              height={450}
              className="plate-image hidden w-full dark:block"
              alt="Mark Encanto at his desk, holding a camera"
              priority
            />
          </div>

          {/* Rebate caption, printed under the frame like a contact sheet */}
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <span className="meta-sm">plate 01 — workstation</span>
            <span className="meta-sm">2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroSectionProps {
  animate: boolean;
}

export default function HeroSection({ animate }: HeroSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => setIsMounted(true), []);

  // Mouse blob follow
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !blobRef.current) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      gsap.to(blobRef.current, {
        x: e.clientX - rect.left - 200,
        y: e.clientY - rect.top - 200,
        duration: 1.2,
        ease: "power3.out",
      });
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  // Magnetic CTA
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect();
      gsap.to(cta, {
        x: (e.clientX - (rect.left + rect.width / 2)) * 0.35,
        y: (e.clientY - (rect.top + rect.height / 2)) * 0.35,
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

  // Entrance animation
  useEffect(() => {
    if (!animate) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(taglineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .fromTo(h1Ref.current, { opacity: 0, y: 50, skewY: 4 }, { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: "power4.out" }, "-=0.3")
        .fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(ctaRef.current, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)" }, "-=0.4")
        .fromTo(imageRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, "-=0.8");
    }, sectionRef);
    return () => ctx.revert();
  }, [animate]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex flex-col-reverse items-center justify-center min-h-screen gap-8 px-6 sm:px-10 md:flex-row md:gap-16 lg:gap-24 overflow-hidden"
    >
      {/*
        Blob: light = green/yellow, dark = blue/pink
        Using two overlapping divs toggled by CSS — no JS theme check = no hydration mismatch
      */}
      <div ref={blobRef} className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]">
        {/* Light mode blob */}
        <div className="absolute inset-0 rounded-full dark:opacity-0 transition-opacity duration-500" style={{ background: "radial-gradient(circle, #11BA0F 0%, #EFE00A 100%)" }} />
        {/* Dark mode blob */}
        <div className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle, #80CEFF 0%, #F7B2FD 100%)" }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none hero-grid" />

      {/* Text Content */}
      <div className="relative z-10 space-y-5 max-w-xl w-full text-center md:text-left">
        <p ref={taglineRef} className="text-xs sm:text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 opacity-0">
          i am
        </p>

        <h1
          ref={h1Ref}
          className="text-[3.2rem] sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-black leading-[1.0] opacity-0 bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent"
        >
          mark encanto.
        </h1>

        <h3 ref={subtitleRef} className="text-base sm:text-lg lg:text-xl font-light text-gray-600 dark:text-gray-300 leading-relaxed opacity-0">
          an aspiring{" "}
          <span className="font-semibold text-[#E0790B] dark:text-[#80CEFF]">Front-end Developer</span>
          ,{" "}
          <span className="font-semibold text-[#E0790B] dark:text-[#F7B2FD]">UI/UX Designer</span>
          , Graphic Artist, and Photographer.
        </h3>

        <a
          ref={ctaRef}
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Mark Encanto's Resume"
          className="inline-flex items-center gap-3 opacity-0 mt-2 px-8 py-3 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-sm font-semibold text-sm tracking-widest uppercase bg-[#11BA0F] text-white dark:bg-[#EEB3FD] dark:text-black hover:bg-[#0fa00e] dark:hover:bg-[#e89ef9] hover:shadow-[0_0_30px_rgba(17,186,15,0.45)] dark:hover:shadow-[0_0_30px_rgba(238,179,253,0.45)] transition-all duration-300"
        >
          View Resume
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* Hero Image — always renders same markup, theme handled by next-themes body class */}
      <div ref={imageRef} className="relative z-10 opacity-0 flex-shrink-0">
        <div className="relative">
          {/* Glow ring — CSS only, no JS theme check */}
          <div className="absolute inset-[-10px] rounded-full opacity-5 blur-2xl animate-pulse dark:opacity-0 transition-opacity duration-500" style={{ background: "radial-gradient(circle, #11BA0F, #EFE00A)" }} />
          <div className="absolute inset-[-1px] rounded-full opacity-0 blur-2xl animate-pulse dark:opacity-5 transition-opacity duration-500" style={{ background: "radial-gradient(circle, #80CEFF, #F7B2FD)" }} />

          {/* Show both images, CSS controls visibility — avoids isMounted flicker */}
          <Image
            src="/hero-light.svg"
            width={450}
            height={450}
            className="w-[240px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[450px] relative z-10 dark:hidden"
            alt="Developer illustration"
            priority
          />
          <Image
            src="/hero.svg"
            width={450}
            height={450}
            className="w-[240px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[450px] relative z-10 hidden dark:block"
            alt="Developer illustration"
            priority
          />
        </div>
      </div>
    </section>
  );
}
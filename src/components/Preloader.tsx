"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Counter animation
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.val)
              .toString()
              .padStart(3, "0");
          }
        },
      });

      // Line expand
      tl.to(
        lineRef.current,
        { scaleX: 1, duration: 1.6, ease: "power3.inOut" },
        0
      );

      // Name reveal
      tl.fromTo(
        nameRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.2
      );

      // Exit: slide up
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          delay: 0.3,
        },
        "+=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0e0e0e] overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(128,206,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(128,206,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div ref={nameRef} className="text-center opacity-0">
        <p className="text-xs tracking-[0.5em] text-[#80CEFF]/60 uppercase mb-3 font-light">
          loading portfolio
        </p>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#FFFFF4]">
          mark<span className="text-[#80CEFF]">ndrei</span>
          <span className="text-[#F7B2FD]">.</span>
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mt-12 w-48 sm:w-64 h-[1px] bg-white/10 relative overflow-hidden">
        <div
          ref={lineRef}
          className="absolute inset-0 bg-gradient-to-r from-[#80CEFF] to-[#F7B2FD] origin-left scale-x-0"
        />
      </div>

      {/* Counter */}
      <div className="mt-4 font-mono text-sm text-white/30 tracking-widest">
        <span ref={counterRef}>000</span>
        <span className="ml-1">%</span>
      </div>
    </div>
  );
}
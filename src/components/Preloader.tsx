"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * Slimmed from ~2.4s to ~0.9s, and the fake 000→100 counter is gone — it was
 * measuring nothing. What's left is a shutter: the name is set, a rule sweeps,
 * the curtain lifts.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete })
        .fromTo(
          nameRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        )
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: "power3.inOut" },
          0.1
        )
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
        });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-bg"
    >
      <div ref={nameRef} className="text-center opacity-0">
        <p className="meta-sm mb-4">loading</p>
        <p className="display text-4xl text-t1 sm:text-6xl">
          markndrei<span className="text-spark">.</span>
        </p>
      </div>

      <div className="mt-10 h-px w-40 bg-line sm:w-56">
        <div ref={ruleRef} className="h-full origin-left scale-x-0 bg-spark" />
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Scoped to a body class rather than `* { cursor: none !important }`, so
       text fields keep their I-beam and the rule can be lifted on unmount. */
    document.body.classList.add("cursor-hidden");

    const moveCursor = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.to(dotRef.current, { x: e.clientX, y: e.clientY, duration: 0.05, ease: "none" });
      gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: 0.2, ease: "power2.out" });
    };

    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";

    /* Delegated, so elements mounted later — cards, modals, the whole
       projects table — get the hover state too. The previous version queried
       once on mount and silently missed everything rendered after. */
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.(INTERACTIVE)) return;
      gsap.to(ringRef.current, { scale: 2.2, opacity: 0.5, borderColor: "var(--spark)", duration: 0.3 });
      gsap.to(dotRef.current, { scale: 0, duration: 0.3 });
    };

    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.(INTERACTIVE)) return;
      gsap.to(ringRef.current, { scale: 1, opacity: 1, borderColor: "var(--line-2)", duration: 0.3 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
    };

    window.addEventListener("pointermove", moveCursor);
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      document.body.classList.remove("cursor-hidden");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-spark md:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9997] hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border md:block"
        style={{ borderColor: "var(--line-2)" }}
      />
    </>
  );
}

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: "none",
      });
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const onEnterInteractive = () => {
      gsap.to(followerRef.current, { scale: 2.5, opacity: 0.4, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0, duration: 0.3 });
    };

    const onLeaveInteractive = () => {
      gsap.to(followerRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", moveCursor);

    const interactiveEls = document.querySelectorAll(
      "a, button, [data-cursor-hover]"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = "";
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#80CEFF] z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
      />
      {/* Ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#F7B2FD]/60 z-[9997] pointer-events-none -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
    </>
  );
}
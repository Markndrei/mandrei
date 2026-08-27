"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  /** Frame number on the strip — film frames are a real sequence, so the number means something. */
  frame: string;
  /** Rebate label, mono caps. */
  label: string;
  /** The display word. The trailing period is drawn in the spark. */
  title: string;
  caption?: string;
  align?: "left" | "center" | "right";
  /** Skip the scroll reveal — for headings that live inside an already-animated container. */
  static?: boolean;
  className?: string;
}

export default function SectionHeading({
  frame,
  label,
  title,
  caption,
  align = "left",
  static: isStatic = false,
  className = "",
}: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isStatic) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([rootRef.current], { opacity: 1 });
      gsap.set(ruleRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
      });
      tl.to(rootRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
          0
        )
        .fromTo(
          wordRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
          0.12
        );
    }, rootRef);
    return () => ctx.revert();
  }, [isStatic]);

  const alignMap = {
    left: "items-start text-left",
    center: "items-center text-center mx-auto",
    right: "items-end text-right ml-auto",
  } as const;

  return (
    <div
      ref={rootRef}
      className={`flex flex-col gap-5 ${alignMap[align]} ${
        isStatic ? "" : "opacity-0"
      } ${className}`}
    >
      {/* Film rebate: frame number, hairline, label */}
      <div className="flex w-full items-center gap-4">
        <span className="meta whitespace-nowrap">frame {frame}</span>
        <span
          ref={ruleRef}
          className="h-px flex-1 origin-left bg-line2"
          aria-hidden="true"
        />
        <span className="meta whitespace-nowrap">{label}</span>
      </div>

      <h2
        ref={wordRef}
        className={`display text-t1 ${isStatic ? "" : "opacity-0"}`}
        style={{ fontSize: "clamp(2.75rem, 9vw, 6rem)" }}
      >
        {title}
        <span className="text-spark">.</span>
      </h2>

      {caption && (
        <p className="max-w-lg text-sm leading-relaxed font-light text-t2 sm:text-base">
          {caption}
        </p>
      )}
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const LEDGER = [
  { label: "years designing", value: "6+", note: "since 2016" },
  { label: "projects built", value: "15+", note: "shipped & shelved" },
  { label: "design tools", value: "10+", note: "figma to photoshop" },
  { label: "coffee cups", value: "∞", note: "no comment" },
];

const TOOLKIT = [
  "React",
  "Next.js",
  "Vue 3",
  "PrimeVue",
  "Pinia",
  "Tailwind",
  "GSAP",
  "Framer Motion",
  "Figma",
  "Node",
  "PostgreSQL",
  "Supabase",
  "Prisma",
  "shadcn/ui",
  "Photoshop",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([plateRef.current, bodyRef.current], { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        plateRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );
      gsap.fromTo(
        bodyRef.current?.children ?? [],
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-28 sm:px-10 lg:px-16 xl:px-24"
    >
      <div className="key-light" aria-hidden="true" />

      <SectionHeading
        frame="02"
        label="about"
        title="about"
        className="mb-16 max-w-3xl"
      />

      <div className="flex flex-col items-start gap-14 lg:flex-row lg:gap-20 xl:gap-28">
        {/* Plate */}
        <div ref={plateRef} className="w-full max-w-sm shrink-0 opacity-0 lg:max-w-xs xl:max-w-sm">
          <div className="plate relative p-3">
            <div className="bg-s2">
              <Image
                src="/about-light.svg"
                width={440}
                height={440}
                className="plate-image w-full dark:hidden"
                alt="Mark Encanto seated at his desk"
              />
              <Image
                src="/about-dark.svg"
                width={440}
                height={440}
                className="plate-image hidden w-full dark:block"
                alt="Mark Encanto seated at his desk"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="meta-sm">plate 02 — the desk</span>
              <span className="meta-sm">iloilo</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="max-w-xl space-y-9">
          <p className="text-xl leading-relaxed font-light text-t1 opacity-0 sm:text-2xl">
            I&apos;m a designer slash developer based in{" "}
            <span className="font-normal">Iloilo, Philippines</span>.
          </p>

          <p className="text-base leading-relaxed font-light text-t2 opacity-0">
            Fell for intuitive design in 2016. I work the whole way across —
            wireframes, type, and the CSS that ships it. When I&apos;m not
            tweaking REMs, I&apos;m probably chasing wins on League.
          </p>

          {/* Ledger — mono labels, numbers set large, hairlines between */}
          <dl className="border-t border-line opacity-0">
            {LEDGER.map((row) => (
              <div
                key={row.label}
                className="group flex items-baseline justify-between gap-6 border-b border-line py-4 transition-colors duration-300"
              >
                <div className="min-w-0">
                  <dt className="meta transition-colors duration-300 group-hover:text-t2">
                    {row.label}
                  </dt>
                  <p className="mono mt-1 text-[0.625rem] tracking-wide text-t3">
                    {row.note}
                  </p>
                </div>
                <dd className="display shrink-0 text-3xl text-t1 transition-colors duration-300 group-hover:text-spark sm:text-4xl">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Toolkit — one wrapped mono line, not thirteen pills */}
          <div className="opacity-0">
            <p className="meta mb-3">toolkit</p>
            <p className="mono text-xs leading-loose text-t2">
              {TOOLKIT.map((tool, i) => (
                <span key={tool}>
                  <span className="transition-colors duration-200 hover:text-spark">
                    {tool}
                  </span>
                  {i < TOOLKIT.length - 1 && (
                    <span className="mx-2 text-t3" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

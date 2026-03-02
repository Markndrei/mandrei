"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current, { x: -60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      gsap.fromTo(textRef.current, { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center min-h-screen gap-12 px-6 sm:px-10 md:flex-row md:gap-16 lg:gap-24 xl:gap-32 py-24"
    >
      {/*
        Decorative background accent — pure CSS classes only, no JS style prop.
        Light: green glow. Dark: blue glow.
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none about-glow" />

      <div ref={imgRef} className="opacity-0 flex-shrink-0">
        {/* Both images rendered; CSS controls which is visible */}
        <Image
          src="/about-light.svg"
          width={440}
          height={440}
          className="w-[220px] sm:w-[300px] md:w-[360px] lg:w-[400px] xl:w-[440px] dark:hidden"
          alt="About illustration"
        />
        <Image
          src="/about-dark.svg"
          width={440}
          height={440}
          className="w-[220px] sm:w-[300px] md:w-[360px] lg:w-[400px] xl:w-[440px] hidden dark:block"
          alt="About illustration"
        />
      </div>

      <div ref={textRef} className="opacity-0 max-w-xl text-left space-y-6">
        <h2 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-black bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent leading-tight">
          about.
        </h2>

        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-light tracking-wide">
          I am a designer slash developer based in{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">Iloilo, Philippines.</span>
        </p>

        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Fell for intuitive design in 2016. When I&apos;m not tweaking REMs,
          I&apos;m probably chasing wins on League.
        </p>

        {/* Stat cards — light: orange accent, dark: blue accent */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[
            { label: "Years Designing", value: "6+" },
            { label: "Projects Built", value: "15+" },
            { label: "Design Tools", value: "10+" },
            { label: "Coffee Cups", value: "∞" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm group hover:border-[#E0790B]/40 dark:hover:border-[#80CEFF]/40 transition-all duration-300 cursor-default">
              <p className="text-2xl font-black text-[#E0790B] dark:text-[#80CEFF] group-hover:scale-110 inline-block transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {["React", "Next.js", "Tailwind", "Figma", "Vue", "GSAP", "Motion Framer", "Node", "PostgreSQL", "Supabase", "Prisma ORM", "ShadCN", "Photoshop"].map((tech) => (
            <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#E0790B]/50 hover:text-[#E0790B] dark:hover:border-[#80CEFF]/50 dark:hover:text-[#80CEFF] transition-all duration-200 cursor-default">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
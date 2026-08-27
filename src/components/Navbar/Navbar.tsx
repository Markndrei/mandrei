"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      /* Active section: the last one whose top has passed the middle of the
         viewport. The navbar had no active state at all before. */
      const mid = window.scrollY + window.innerHeight / 2;
      let current: string | null = null;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= mid) current = link.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 px-6 transition-all duration-500 sm:px-10 lg:px-16 xl:px-24 ${
        scrolled
          ? "border-b border-line bg-bg/75 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        <Link
          href="/"
          className="mono text-sm font-medium tracking-[0.14em] text-t1 lowercase"
        >
          markndrei<span className="text-spark">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              data-active={active === link.id}
              className={`rule-grow mono text-[0.6875rem] tracking-[0.16em] uppercase transition-colors duration-300 ${
                active === link.id ? "text-t1" : "text-t3 hover:text-t2"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center border border-line text-t2 transition-colors duration-300 hover:border-line2 hover:text-t1 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "max-h-72 pt-6 pb-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col border-t border-line">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-baseline gap-4 border-b border-line py-3.5 transition-colors duration-200"
            >
              <span className="meta-sm w-5">
                {String(i + 2).padStart(2, "0")}
              </span>
              <span
                className={`mono text-xs tracking-[0.16em] uppercase ${
                  active === link.id ? "text-spark" : "text-t2"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

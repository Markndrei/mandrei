"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "about." },
    { href: "#projects", label: "projects." },
    { href: "#skills", label: "skills." },
    { href: "#contact", label: "contact." },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 px-6 sm:px-10 lg:px-20
        ${scrolled
          ? "py-3 backdrop-blur-2xl bg-white/70 dark:bg-[#0e0e0e]/80 shadow-sm border-b border-gray-200/50 dark:border-white/5"
          : "py-5 bg-transparent"
        }`}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-lg font-black tracking-widest text-gray-800 dark:text-[#FFFFF4]">
          mark<span className="text-[#80CEFF]">ndrei</span>
          <span className="text-[#F7B2FD]">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10 text-sm font-light">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative group text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#80CEFF] to-[#F7B2FD] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "max-h-60 opacity-100 pt-4 pb-2" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-4 px-2 text-sm font-light">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-[#80CEFF] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
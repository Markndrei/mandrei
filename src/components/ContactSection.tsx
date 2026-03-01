"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLinkedin, FaGithub, FaBehance, FaFacebook, FaInstagram } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: "LinkedIn", icon: <FaLinkedin />, url: "https://www.linkedin.com/in/mark-andrei-encanto-962179351/" },
  { name: "GitHub", icon: <FaGithub />, url: "https://github.com/Markndrei" },
  { name: "Behance", icon: <FaBehance />, url: "https://www.behance.net/markanencanto" },
  { name: "Facebook", icon: <FaFacebook />, url: "https://web.facebook.com/markndrei/" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/markndrei/" },
];

function FloatingInput({ label, name, type = "text", textarea = false }: {
  label: string; name: string; type?: string; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;

  const borderClass = focused
    ? "border-[#E0790B] shadow-[0_0_16px_rgba(224,121,11,0.25)] dark:border-[#80CEFF] dark:shadow-[0_0_16px_rgba(128,206,255,0.2)]"
    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20";

  const base = `w-full bg-transparent border rounded-xl px-4 text-sm text-gray-800 dark:text-gray-100 outline-none transition-all duration-300 ${borderClass}`;

  return (
    <div className="relative">
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-300 ${isActive ? "text-[10px] top-2 text-[#E0790B] dark:text-[#80CEFF]" : "text-sm text-gray-400 dark:text-gray-500 top-1/2 -translate-y-1/2"}`}
        style={textarea && !isActive ? { top: "1rem", transform: "none" } : {}}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          required
          className={`${base} pt-6 pb-3 resize-none`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); }}
          onChange={(e) => setHasValue(!!e.target.value)}
        />
      ) : (
        <input
          type={type}
          name={name}
          required
          className={`${base} h-14 pt-4`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); }}
          onChange={(e) => setHasValue(!!e.target.value)}
        />
      )}
    </div>
  );
}

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { x: -50, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      gsap.fromTo(formWrapRef.current, { x: 50, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    if (planeRef.current) {
      gsap.to(planeRef.current, { x: 100, y: -60, opacity: 0, scale: 0.5, duration: 0.7, ease: "power3.in" });
    }
    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStatus("success");
      formRef.current.reset();
    } catch {
      setStatus("error");
      if (planeRef.current) {
        gsap.to(planeRef.current, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.5 });
      }
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 px-6 sm:px-10 lg:px-16 xl:px-24 overflow-hidden">
      {/* Background blobs — pure CSS, no JS theme check, no hydration mismatch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl animate-pulse dark:opacity-0 transition-opacity duration-500" style={{ background: "#E0790B" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse dark:opacity-0 transition-opacity duration-500" style={{ background: "#EFE00A", animationDelay: "1.5s" }} />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-0 blur-3xl animate-pulse dark:opacity-15 transition-opacity duration-500" style={{ background: "#80CEFF" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-0 blur-3xl animate-pulse dark:opacity-15 transition-opacity duration-500" style={{ background: "#F7B2FD", animationDelay: "1.5s" }} />
      </div>

      <div className="flex flex-col xl:flex-row gap-16 xl:gap-24">
        <div ref={leftRef} className="opacity-0 xl:w-[400px] flex-shrink-0 space-y-10">
          <div>
            <h2 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] font-black leading-tight mb-4 bg-gradient-to-r from-[#404040] to-[#606060] dark:from-[#80CEFF] dark:to-[#F7B2FD] bg-clip-text text-transparent">
              contact.
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Have a project in mind or just want to say hi? I&apos;m always open to new opportunities.
            </p>
          </div>

          <ul className="space-y-3">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-[#E0790B] dark:hover:text-[#80CEFF] transition-colors duration-200 group">
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-gray-400 group-hover:bg-[#E0790B]/10 group-hover:text-[#E0790B] dark:group-hover:bg-[#80CEFF]/10 dark:group-hover:text-[#80CEFF] transition-all duration-200">
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden xl:block">
            <Image src="/hero-light.svg" width={220} height={220} alt="Developer illustration" className="opacity-80 dark:hidden" />
            <Image src="/hero.svg" width={220} height={220} alt="Developer illustration" className="opacity-80 hidden dark:block" />
          </div>
        </div>

        <div ref={formWrapRef} className="opacity-0 flex-1 max-w-2xl">
          <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E0790B] dark:bg-[#80CEFF] inline-block" />
              send me an email.
            </h3>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#11BA0F]/10 dark:bg-[#11BA0F]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#11BA0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Message sent!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">I&apos;ll get back to you as soon as possible.</p>
                <button onClick={() => setStatus("idle")} className="mt-2 text-xs text-[#E0790B] dark:text-[#80CEFF] hover:underline">
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FloatingInput label="Your name" name="user_name" />
                  <FloatingInput label="Email address" name="user_email" type="email" />
                </div>
                <FloatingInput label="Message..." name="message" textarea />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="relative flex items-center gap-3 overflow-hidden px-8 py-3 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-sm text-sm font-semibold tracking-widest uppercase bg-[#11BA0F] text-white dark:bg-[#EEB3FD] dark:text-black hover:bg-[#0fa00e] dark:hover:bg-[#e89ef9] hover:shadow-[0_0_24px_rgba(17,186,15,0.4)] dark:hover:shadow-[0_0_24px_rgba(238,179,253,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span ref={planeRef}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                          </svg>
                        </span>
                        Send Email
                      </>
                    )}
                  </button>
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-500 text-right">Failed to send. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
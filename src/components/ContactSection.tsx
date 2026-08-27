"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLinkedin, FaGithub, FaBehance, FaFacebook, FaInstagram } from "react-icons/fa";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: "LinkedIn", handle: "mark-andrei-encanto", icon: <FaLinkedin />, url: "https://www.linkedin.com/in/mark-andrei-encanto-962179351/" },
  { name: "GitHub", handle: "Markndrei", icon: <FaGithub />, url: "https://github.com/Markndrei" },
  { name: "Behance", handle: "markanencanto", icon: <FaBehance />, url: "https://www.behance.net/markanencanto" },
  { name: "Facebook", handle: "markndrei", icon: <FaFacebook />, url: "https://web.facebook.com/markndrei/" },
  { name: "Instagram", handle: "markndrei", icon: <FaInstagram />, url: "https://www.instagram.com/markndrei/" },
];

/** Underline field — a rule that turns spark on focus, no rounded box. */
function Field({
  label,
  name,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = focused || hasValue;
  const id = `field-${name}`;

  const shared =
    "w-full bg-transparent text-sm font-light text-t1 outline-none placeholder:text-transparent";

  return (
    <div className="relative pt-6">
      <label
        htmlFor={id}
        className={`mono pointer-events-none absolute left-0 tracking-[0.16em] uppercase transition-all duration-300 ${
          isActive
            ? `top-0 text-[0.5625rem] ${focused ? "text-spark" : "text-t3"}`
            : "top-6 text-[0.6875rem] text-t3"
        }`}
      >
        {label}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required
          className={`${shared} resize-none pb-3`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(!!e.target.value);
          }}
          onChange={(e) => setHasValue(!!e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          required
          className={`${shared} h-9`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(!!e.target.value);
          }}
          onChange={(e) => setHasValue(!!e.target.value)}
        />
      )}

      {/* The rule */}
      <span className="absolute bottom-0 left-0 h-px w-full bg-line" aria-hidden="true" />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-px w-full origin-left bg-spark transition-transform duration-300 ${
          focused ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </div>
  );
}

/* EmailJS config. These are NEXT_PUBLIC by design — EmailJS public keys are
   meant to be used from the browser; the protection is the domain allow-list
   and rate limit in the EmailJS dashboard, not secrecy of this value. */
const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

const isEmailConfigured = Boolean(
  EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey
);

export default function ContactSection() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "unconfigured"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([leftRef.current, formWrapRef.current], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftRef.current, formWrapRef.current],
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    /* Without this guard a missing env var reaches sendForm as undefined and
       surfaces as a generic network failure, which is impossible to debug. */
    if (!isEmailConfigured) {
      console.error(
        "[contact] EmailJS is not configured. Missing:",
        [
          !EMAILJS.serviceId && "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
          !EMAILJS.templateId && "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
          !EMAILJS.publicKey && "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
        ]
          .filter(Boolean)
          .join(", ")
      );
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS.serviceId!,
        EMAILJS.templateId!,
        formRef.current,
        EMAILJS.publicKey!
      );
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("[contact] EmailJS send failed:", err);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-28 sm:px-10 lg:px-16 xl:px-24"
    >
      <div className="key-light" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left: heading + channels */}
        <div ref={leftRef} className="opacity-0">
          <SectionHeading
            frame="06"
            label="contact"
            title="contact"
            caption="Have something you want built, designed, or shot? Send it over."
            className="mb-12"
          />

          <p className="meta mb-4">elsewhere</p>
          <ul className="border-t border-line">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border-b border-line py-3.5"
                >
                  <span className="text-sm text-t3 transition-colors duration-300 group-hover:text-spark">
                    {link.icon}
                  </span>
                  <span className="mono text-xs tracking-[0.14em] text-t1 uppercase">
                    {link.name}
                  </span>
                  <span className="mono ml-auto text-[0.625rem] text-t3 transition-colors duration-300 group-hover:text-t2">
                    {link.handle}
                  </span>
                  <svg
                    className="h-3 w-3 text-t3 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-spark"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8m9 0v9" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: the form, on a plate */}
        <div ref={formWrapRef} className="opacity-0">
          <div className="plate p-7 sm:p-9">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="meta">send a message</p>
              <p className="meta-sm">reply within 2 days</p>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-start gap-4 py-10">
                <span className="flex h-10 w-10 items-center justify-center border border-spark">
                  <svg className="h-4 w-4 text-spark" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="display text-3xl text-t1">Message sent.</p>
                <p className="text-sm font-light text-t2">
                  It landed in my inbox. I&apos;ll reply within a couple of days.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="rule-grow mono mt-2 text-[0.6875rem] tracking-[0.16em] text-t2 uppercase transition-colors duration-300 hover:text-t1"
                >
                  Write another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={sendEmail} className="space-y-7">
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                  <Field label="your name" name="user_name" />
                  <Field label="email address" name="user_email" type="email" />
                </div>
                <Field label="message" name="message" textarea />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {status === "error" && (
                    <p className="mono max-w-[16rem] text-[0.625rem] leading-relaxed tracking-[0.14em] text-spark uppercase">
                      That didn&apos;t send — check your connection and try
                      again, or email me directly.
                    </p>
                  )}
                  {status === "unconfigured" && (
                    <p className="mono max-w-[16rem] text-[0.625rem] leading-relaxed tracking-[0.14em] text-spark uppercase">
                      The form isn&apos;t connected yet — use one of the links
                      opposite to reach me.
                    </p>
                  )}
                  {status !== "error" && status !== "unconfigured" && <span />}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="spark-glow mono group inline-flex items-center gap-3 bg-spark px-7 py-3.5 text-xs font-medium tracking-[0.16em] uppercase on-spark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? "sending" : "send message"}
                    {status === "sending" ? (
                      <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

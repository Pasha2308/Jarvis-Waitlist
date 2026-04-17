"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const bootLines = [
  "> Booting assistant core...",
  "> Syncing environment...",
  "> User detected.",
];

export default function EntryScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        lineRefs.current,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.35,
          duration: 0.45,
        },
      )
        .fromTo(
          [titleRef.current, metaRef.current, ctaRef.current],
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
          },
          "+=0.2",
        );
    },
    { scope: rootRef },
  );

  const handleAccessClick = () => {
    const waitlist = document.getElementById("waitlist");
    if (waitlist) {
      waitlist.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={rootRef}
      className="entry-screen relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,42,42,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,42,42,0.25)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="scanline pointer-events-none absolute inset-0" />
      <div className="flicker pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-start">
        <div className="space-y-2">
          {bootLines.map((line, idx) => (
            <p
              key={line}
              ref={(el) => {
                lineRefs.current[idx] = el;
              }}
              className="font-mono text-sm tracking-wide text-white/85 md:text-base"
            >
              {line}
              {idx === bootLines.length - 1 ? <span className="cursor-blink">_</span> : null}
            </p>
          ))}
        </div>

        <h1
          ref={titleRef}
          className="mt-10 bg-gradient-to-r from-white via-white to-red bg-clip-text font-bebas text-5xl leading-none tracking-[0.08em] text-transparent drop-shadow-[0_0_12px_rgba(255,42,42,0.35)] md:text-8xl"
        >
          JARVIS IS COMING HOME
        </h1>

        <button
          ref={ctaRef}
          type="button"
          onClick={handleAccessClick}
          className="group relative mt-8 overflow-hidden border border-red px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-red transition-colors duration-300 hover:text-black md:text-sm"
        >
          <span className="absolute inset-0 -translate-x-full bg-red transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <span className="relative z-10">Request Access</span>
        </button>

        <p ref={metaRef} className="mt-5 font-mono text-xs tracking-wider text-white/70 md:text-sm">
          2,847 operators already inside
        </p>
      </div>

      <style jsx>{`
        .scanline {
          background: linear-gradient(to bottom, transparent 0%, rgba(255, 42, 42, 0.2) 50%, transparent 100%);
          opacity: 0.08;
          animation: scanline 3s linear infinite;
        }

        .flicker {
          background: rgba(255, 255, 255, 0.02);
          mix-blend-mode: screen;
          animation: flicker 4.5s infinite;
        }

        .cursor-blink {
          margin-left: 4px;
          color: #ff2a2a;
          animation: blink 1s step-end infinite;
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes flicker {
          0%,
          100% {
            opacity: 0.06;
          }
          22% {
            opacity: 0.03;
          }
          23% {
            opacity: 0.07;
          }
          24% {
            opacity: 0.04;
          }
          63% {
            opacity: 0.05;
          }
          64% {
            opacity: 0.02;
          }
        }

        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

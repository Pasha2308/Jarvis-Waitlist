"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const personalityLines = [
  "Open the file.",
  "You were here.",
  "Continue?",
  "You don\u2019t search anymore.",
];

export default function PersonalitySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const finalLineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const targets = [labelRef.current, ...lineRefs.current, finalLineRef.current].filter(Boolean);

      gsap.set(targets, { y: 20, opacity: 0 });

      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.4,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="flex min-h-screen items-center bg-black px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <div className="max-w-3xl space-y-6 text-left">
          <p ref={labelRef} className="font-mono text-xs tracking-[0.22em] text-red/55 md:text-sm">
            {"> SYSTEM LOG / 02:14:08"}
          </p>

          {personalityLines.map((line, idx) => (
            <p
              key={line}
              ref={(el) => {
                lineRefs.current[idx] = el;
              }}
              className="font-rajdhani text-3xl font-semibold leading-tight md:text-5xl lg:text-6xl"
            >
              {line}
            </p>
          ))}

          <p className="h-2" aria-hidden="true" />

          <p
            ref={finalLineRef}
            className="font-rajdhani text-3xl font-bold leading-tight text-red drop-shadow-[0_0_12px_rgba(255,42,42,0.35)] md:text-5xl lg:text-6xl"
          >
            Your system thinks with you.
          </p>
        </div>
      </div>
    </section>
  );
}

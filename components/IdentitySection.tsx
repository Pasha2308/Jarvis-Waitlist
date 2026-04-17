"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const firstBlockLines = [
  "You open a task.",
  "You switch tabs.",
  "You search again.",
  "You repeat.",
];

const secondBlockLines = ["You didn\u2019t ask.", "It already helped."];

export default function IdentitySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const firstLineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const secondLineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const finalLineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.set(
        [...firstLineRefs.current, ...secondLineRefs.current, finalLineRef.current].filter(
          Boolean,
        ),
        { opacity: 0.3, color: "#b5b5b5" },
      );

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      reveal.to(firstLineRefs.current, {
        opacity: 1,
        color: "#ffffff",
        stagger: 0.3,
        duration: 0.7,
        ease: "power2.out",
      });

      reveal.to(
        secondLineRefs.current,
        {
          opacity: 1,
          color: "#ffffff",
          stagger: 0.3,
          duration: 0.7,
          ease: "power2.out",
        },
        "+=0.15",
      );

      reveal.to(
        finalLineRef.current,
        {
          opacity: 1,
          color: "#ff2a2a",
          duration: 0.8,
          ease: "power2.out",
        },
        "+=0.2",
      );
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="flex min-h-screen items-center justify-center bg-black px-6 py-16 text-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-4">
          {firstBlockLines.map((line, idx) => (
            <p
              key={line}
              ref={(el) => {
                firstLineRefs.current[idx] = el;
              }}
              className="font-rajdhani text-3xl font-semibold leading-tight tracking-wide md:text-5xl lg:text-6xl"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="mx-auto hidden h-72 w-px bg-red/80 md:block" />

        <div className="space-y-6 text-left md:text-left">
          {secondBlockLines.map((line, idx) => (
            <p
              key={line}
              ref={(el) => {
                secondLineRefs.current[idx] = el;
              }}
              className="font-rajdhani text-3xl font-semibold leading-tight tracking-wide md:text-5xl lg:text-6xl"
            >
              {line}
            </p>
          ))}

          <p
            ref={finalLineRef}
            className="pt-4 font-mono text-sm uppercase tracking-[0.35em] text-red md:text-base"
          >
            — This is not a tool. This is presence. —
          </p>
        </div>
      </div>
    </section>
  );
}

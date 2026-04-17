"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function MysterySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.set(headlineRef.current, {
        opacity: 0.25,
        filter: "blur(4px)",
      });

      gsap.to(headlineRef.current, {
        opacity: 0.95,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          end: "bottom 35%",
          scrub: 0.9,
        },
      });

      if (statusRef.current) {
        gsap.to(statusRef.current, {
          x: "random(-2, 2)",
          opacity: "random(0.65, 1)",
          duration: 0.12,
          repeat: -1,
          repeatRefresh: true,
          yoyo: true,
          ease: "none",
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="flex min-h-screen items-center justify-center bg-black px-6 py-16 text-center text-white">
      <div className="mx-auto w-full max-w-4xl">
        <h2
          ref={headlineRef}
          className="font-rajdhani text-4xl font-semibold leading-tight tracking-wide md:text-6xl lg:text-7xl"
        >
          We’re not building an app.
          <br />
          We’re building something
          <br />
          that works before you think.
        </h2>

        <p
          ref={statusRef}
          className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-red md:text-sm"
        >
          {"// ACCESS RESTRICTED // SYSTEM EVOLVING //"}
        </p>
      </div>
    </section>
  );
}

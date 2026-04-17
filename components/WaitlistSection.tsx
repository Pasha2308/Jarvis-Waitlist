"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";

type WaitlistResponse = {
  success: boolean;
  displayPosition: number;
  ref_code: string;
  already_exists?: boolean;
};

const terminalLines = ["> Request received", "> Verifying identity...", "> Access granted"];

export default function WaitlistSection() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [refCode, setRefCode] = useState("");
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const referralLink = useMemo(() => {
    if (!refCode) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}?ref=${refCode}`;
  }, [refCode]);

  const revealTerminal = () => {
    terminalLines.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleLineCount(idx + 1);
      }, idx * 600);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          referred_by: referredBy ?? undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as WaitlistResponse;

      setPosition(data.displayPosition);
      setRefCode(data.ref_code);
      setAlreadyExists(Boolean(data.already_exists));
      setSubmitted(true);
      setVisibleLineCount(0);
      revealTerminal();
    } catch (submitError) {
      console.error(submitError);
      setError("System error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      gsap.fromTo(
        ".copy-feedback",
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="waitlist" className="flex min-h-screen items-center justify-center bg-black px-6 py-24 text-white">
      <div className="w-full max-w-2xl text-center">
        <p className="font-mono text-[clamp(0.72rem,1.8vw,0.9rem)] uppercase tracking-[0.2em] text-red">
          {"// Restricted Access"}
        </p>

        <h2 className="mt-4 bg-gradient-to-b from-white to-white/75 bg-clip-text font-bebas text-[clamp(3.2rem,12vw,8rem)] leading-[0.9] tracking-[0.06em] text-transparent">
          Early Access Only
        </h2>

        <p className="mt-4 font-rajdhani text-[clamp(1rem,3vw,1.4rem)] text-white/65">Not everyone gets in.</p>

        {referredBy ? (
          <p className="mt-5 font-mono text-[clamp(0.72rem,2vw,0.9rem)] tracking-[0.08em] text-red">
            You were invited. You&apos;ll both move up.
          </p>
        ) : null}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mx-auto mt-10 w-full max-w-[420px] space-y-4 text-left">
            <input
              type="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
              placeholder="operator@domain.com"
              className="w-full border border-white/20 bg-transparent px-[14px] py-[14px] font-mono text-[clamp(0.8rem,2.6vw,0.95rem)] text-white outline-none transition-colors placeholder:text-white/35 focus:border-red"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red px-4 py-4 font-mono text-[clamp(0.75rem,2.4vw,0.9rem)] uppercase tracking-[0.16em] text-white transition duration-200 hover:scale-[1.03] hover:shadow-[0_0_18px_rgba(255,42,42,0.45)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Securing..." : "Secure Your System \u2192"}
            </button>
            {error ? <p className="font-mono text-xs text-red/90">{error}</p> : null}
          </form>
        ) : (
          <div className="mx-auto mt-12 flex w-full max-w-[540px] flex-col items-center">
            <div className="w-full space-y-2 text-left">
              {terminalLines.map((line, idx) => (
                <p
                  key={line}
                  className={`font-mono text-[clamp(0.8rem,2.6vw,0.95rem)] text-white/85 transition-opacity duration-500 ${
                    idx < visibleLineCount ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
            {alreadyExists ? (
              <p className="mt-4 font-mono text-sm text-red">You&apos;re already on the list.</p>
            ) : null}

            <p className="mt-8 font-bebas text-[clamp(4rem,15vw,9rem)] leading-none tracking-[0.06em] text-white">
              {position ? `#${position}` : "#----"}
            </p>

            <div className="mt-6 w-full border border-red px-4 py-4 text-left">
              <p className="font-mono text-[clamp(0.72rem,2.2vw,0.92rem)] text-red">{referralLink}</p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 w-full border border-red px-4 py-3 font-mono text-[clamp(0.72rem,2.2vw,0.9rem)] uppercase tracking-[0.12em] text-red transition hover:bg-red hover:text-black"
            >
              [ Copy Link - Move Up ]
            </button>

            <p className={`copy-feedback mt-2 font-mono text-xs text-white/80 ${copied ? "opacity-100" : "opacity-0"}`}>
              Copied
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

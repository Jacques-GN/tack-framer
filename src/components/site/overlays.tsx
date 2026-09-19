"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 px-0">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          We use cookies and similar technologies for analytics, site
          functionality, and optional support tools.{" "}
          <a
            href="#"
            className="font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700"
          >
            Privacy &amp; cookies
          </a>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-xl bg-[#12233b] text-white shadow-[0_10px_30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:bg-[#1a3050] active:scale-95 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

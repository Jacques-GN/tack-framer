"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const navLinks = ["Product", "Features", "Pricing", "Blog", "Resources", "Company"];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-[1350px] rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#" className="flex shrink-0 items-center gap-2.5">
            <span className="btn-primary flex size-10 items-center justify-center rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.4)]">
              <Download className="size-5 text-white" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">Snap</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">Site</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-violet-600"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#"
              className="btn-primary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              Export a site
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-slate-100 px-4 py-3 lg:hidden" aria-label="Mobile navigation">
            {navLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-violet-600"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

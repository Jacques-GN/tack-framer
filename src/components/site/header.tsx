"use client";

import { useState } from "react";
import { ChevronDown, Download, Globe } from "lucide-react";

const navLinks = [
  { label: "Product", dropdown: true },
  { label: "Features", dropdown: false },
  { label: "Pricing", dropdown: false },
  { label: "Blog", dropdown: false },
  { label: "Resources", dropdown: true },
  { label: "Company", dropdown: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3 sm:pt-5">
      <div className="mx-auto max-w-[1350px] rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <span className="btn-teal-gradient flex size-10 items-center justify-center rounded-xl shadow-[0_4px_14px_rgba(13,148,136,0.4)]">
              <Download className="size-5 text-white" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                NoCode
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-600">
                Export
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className="group flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-teal-600"
              >
                {link.label}
                {link.dropdown && (
                  <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" />
                )}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              className="hidden md:flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-teal-600"
            >
              <Globe className="size-4" />
              EN
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>
            <a
              href="#"
              className="hidden md:inline-flex rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-teal-600"
            >
              Login
            </a>
            <a
              href="#"
              className="btn-teal-gradient inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(13,148,136,0.35)] transition-all duration-200 hover:shadow-[0_6px_22px_rgba(13,148,136,0.5)] hover:brightness-105 active:scale-[0.98]"
            >
              Sign Up
            </a>
            {/* Mobile burger */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-slate-100 px-4 py-3" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-600"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3">
              <a href="#" className="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Login
              </a>
              <span className="text-sm font-semibold text-slate-400">EN</span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

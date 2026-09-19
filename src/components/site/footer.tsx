"use client";

import { useState } from "react";
import { Download, Github, Mail, Send, Star, Twitter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const columns = [
  {
    title: "Product",
    links: [
      "Framer Export",
      "Webflow Export",
      "Wix Export",
      "Squarespace Export",
      "WordPress Export",
      "Developer API",
      "All Export Tools",
    ],
  },
  {
    title: "Company",
    links: ["Features", "Pricing", "About Us", "Blog", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookie Settings"],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address to subscribe.",
      });
      return;
    }
    setEmail("");
    toast({
      title: "Subscribed!",
      description: "You will receive product updates and tutorials from NoCodeExport.",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Rating */}
        <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          NoCodeExport: 5/5 from 1 verified export user
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <span className="btn-teal-gradient flex size-10 items-center justify-center rounded-xl shadow-[0_4px_14px_rgba(13,148,136,0.35)]">
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
            <p className="mt-5 max-w-xs leading-relaxed text-slate-600">
              Empowering designers to own their code. Export clean, semantic
              HTML from your favorite no-code tools.
            </p>

            <div className="mt-7">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Mail className="size-4 text-teal-600" />
                Stay updated
              </p>
              <div className="mt-3 flex max-w-xs items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && subscribe()}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={subscribe}
                  aria-label="Subscribe"
                  className="btn-teal-gradient flex size-10 shrink-0 items-center justify-center rounded-lg text-white shadow-[0_4px_14px_rgba(13,148,136,0.35)] transition-all hover:brightness-105 active:scale-95"
                >
                  <Send className="size-4" />
                </button>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
                By subscribing, you agree to receive product updates, tutorials,
                and marketing emails from NoCodeExport. You can unsubscribe at
                any time. See our{" "}
                <a href="#" className="font-medium text-teal-600 hover:underline">
                  Privacy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] text-slate-600 transition-colors hover:text-teal-600"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 NoCodeExport. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1DA1F2]"
            >
              <Twitter className="size-4.5" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Github className="size-4.5" />
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#5865F2]"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.6 1.25a18.3 18.3 0 0 0-5.5 0 12.6 12.6 0 0 0-.61-1.25.08.08 0 0 0-.08-.04 19.7 19.7 0 0 0-4.88 1.52.07.07 0 0 0-.04.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.22-2a.08.08 0 0 0-.04-.11 13 13 0 0 1-1.87-.9.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.24.2.37.3a.08.08 0 0 1-.01.12c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.37 1.22 2a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6.02-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

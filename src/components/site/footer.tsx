"use client";

import { useState } from "react";
import { Download, Github, Mail, Send, Star, Twitter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const columns = [
  {
    title: "Product",
    links: ["Site Export", "Page Export", "Developer API", "All Export Tools"],
  },
  { title: "Company", links: ["Features", "Pricing", "About Us", "Blog", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookie Settings"] },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address to subscribe." });
      return;
    }
    setEmail("");
    toast({ title: "Subscribed!", description: "You will receive product updates from SnapSite." });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          SnapSite: 5/5 from 1 verified export user
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <span className="btn-primary flex size-10 items-center justify-center rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.35)]">
                <Download className="size-5 text-white" strokeWidth={2.4} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-slate-900">Snap</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-600">Site</span>
              </span>
            </a>
            <p className="mt-5 max-w-xs leading-relaxed text-slate-600">
              Empowering designers to own their code. Export clean, semantic HTML from your
              favorite no-code tools.
            </p>

            <div className="mt-7">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Mail className="size-4 text-violet-600" />
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
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={subscribe}
                  aria-label="Subscribe"
                  className="btn-primary flex size-10 shrink-0 items-center justify-center rounded-lg text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] transition-all hover:brightness-105 active:scale-95"
                >
                  <Send className="size-4" />
                </button>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
                By subscribing, you agree to receive product updates from SnapSite. Unsubscribe at
                any time. See our{" "}
                <a href="#" className="font-medium text-violet-600 hover:underline">
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
                    <a href="#" className="text-[15px] text-slate-600 transition-colors hover:text-violet-600">
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
          <p className="text-sm text-slate-500">© 2026 SnapSite. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1DA1F2]">
              <Twitter className="size-4.5" />
            </a>
            <a href="#" aria-label="GitHub" className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <Github className="size-4.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

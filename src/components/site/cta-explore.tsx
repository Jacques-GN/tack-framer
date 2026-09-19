"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const solutions = [
  {
    label: "Webflow Needs",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-black text-white">
        W
      </span>
    ),
  },
  {
    label: "Wix Sites",
    icon: (
      <span className="text-base font-black tracking-tight text-orange-500">
        WiX
      </span>
    ),
  },
  {
    label: "WordPress Sites",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
        W
      </span>
    ),
  },
  {
    label: "Squarespace Sites",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6 fill-slate-800" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.66 5h17.32A10 10 0 0 0 12 2zM3.34 7a10 10 0 0 0 0 10h17.32a10 10 0 0 0 0-10H3.34zM12 22a10 10 0 0 0 8.66-5H3.34A10 10 0 0 0 12 22z" />
      </svg>
    ),
  },
  {
    label: "Elementor Pages",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-full bg-rose-500 text-xs font-black text-white">
        IE
      </span>
    ),
  },
];

export function CtaExplore() {
  return (
    <>
      {/* Final CTA */}
      <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to export your Framer site?
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Paste your published URL and review the pages. No payment is
              needed to scan.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              toast({
                title: "Let's check your site",
                description: "Paste your published URL at the top to start the scan.",
              })
            }
            className="btn-teal-gradient inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(13,148,136,0.4)] transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
          >
            Check my site
            <ArrowRight className="size-5" />
          </button>
        </div>
      </section>

      {/* Explore solutions */}
      <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Also Explore Our Solutions For
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {solutions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() =>
                  toast({
                    title: s.label,
                    description: "Discover our dedicated export solution.",
                  })
                }
                className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
              >
                {s.icon}
                <span className="font-display text-base font-bold text-slate-900">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

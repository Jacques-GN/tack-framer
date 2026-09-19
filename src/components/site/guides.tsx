"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const guides = [
  "Can Framer Export Code? Yes — Here Is How to Get the HTML, CSS and JS",
  "How to Get Code From Framer (2026 Methods)",
  "How to Self-Host a Framer Website on Netlify (2026)",
];

export function Guides() {
  return (
    <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-[0_8px_20px_rgba(59,130,246,0.35)]">
            <BookOpen className="size-6 text-white" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Framer guides that support the export flow
            </h2>
            <p className="mt-1.5 text-slate-600">
              Use these guides for migration planning, interaction checks, and
              deployment of a rendered Framer export.
            </p>
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {guides.map((title) => (
            <button
              key={title}
              type="button"
              onClick={() =>
                toast({
                  title: "Guide opening",
                  description: title,
                })
              }
              className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
            >
              <span className="font-display text-base font-bold leading-snug text-slate-900">
                {title}
              </span>
              <ArrowRight className="mt-0.5 size-5 shrink-0 text-teal-500 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

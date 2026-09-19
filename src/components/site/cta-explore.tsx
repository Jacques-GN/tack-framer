"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const solutions = ["Webflow Needs", "Wix Sites", "WordPress Sites", "Squarespace Sites", "Elementor Pages"];

export function CtaExplore() {
  return (
    <>
      {/* Final CTA */}
      <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to export your site?
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Paste your published URL and review the pages. No payment is needed to scan.
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
            className="btn-primary inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
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
            {solutions.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => toast({ title: label, description: "Discover our dedicated export solution." })}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
              >
                <span className="font-display text-base font-bold text-slate-900">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { ArrowRight, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sitePassFeatures = [
  "One successful export, up to 100 pages",
  "Website files with downloaded assets",
  "30-day access to your download",
];

const proFeatures = [
  "50 exports every month",
  "Up to 100 pages per export",
  "Download files and assets, or deploy to GitHub and Netlify",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-slate-200 bg-slate-50/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            One site or ongoing exports?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Export once with Site Pass, or choose Pro for regular updates and
            client projects.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Site Pass */}
          <div className="relative flex flex-col rounded-2xl border-2 border-teal-500 bg-white p-8 shadow-[0_20px_50px_rgba(13,148,136,0.12)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Site Pass
              </h3>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                One-time export
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              One site to move. One payment. No subscription.
            </p>
            <p className="mt-6">
              <span className="font-display text-5xl font-bold tracking-tight text-slate-900">
                $15
              </span>{" "}
              <span className="text-slate-500">once</span>
            </p>
            <button
              type="button"
              onClick={() =>
                toast({
                  title: "Site Pass selected",
                  description: "One successful export — $15, one payment.",
                })
              }
              className="btn-teal-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-[0_10px_28px_rgba(13,148,136,0.4)] transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              Export once — $15
              <ArrowRight className="size-4" />
            </button>

            <p className="mt-7 text-sm font-bold text-slate-900">
              Features included:
            </p>
            <ul className="mt-3.5 space-y-3">
              {sitePassFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal-600" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-slate-100 pt-5 mt-7 space-y-2.5 text-sm text-slate-600">
              <p>Scan your site and review the pages before checkout.</p>
              <p>A failed export restores your pass so you can retry.</p>
            </div>
          </div>

          {/* Pro */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Pro</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Keep exporting as your sites evolve.
            </p>
            <p className="mt-6">
              <span className="font-display text-5xl font-bold tracking-tight text-slate-900">
                $10
              </span>{" "}
              <span className="text-slate-500">/ month</span>
            </p>
            <button
              type="button"
              onClick={() =>
                toast({
                  title: "Pro plan selected",
                  description: "50 exports every month — $10/month, billed monthly.",
                })
              }
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-900 transition-all duration-200 hover:border-teal-400 hover:text-teal-700 active:scale-[0.98]"
            >
              Get Pro — $10/month
              <ArrowRight className="size-4" />
            </button>

            <p className="mt-7 text-sm font-bold text-slate-900">
              Features included:
            </p>
            <ul className="mt-3.5 space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal-600" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-slate-100 pt-5 mt-7">
              <p className="text-sm text-slate-600">
                Billed monthly. Renews until canceled.
              </p>
            </div>
          </div>
        </div>

        {/* Free try */}
        <div className="mx-auto mt-12 max-w-4xl border-t border-slate-200 pt-10">
          <h3 className="font-display text-xl font-bold text-slate-900">
            Want to check the output first?
          </h3>
          <p className="mt-2.5 max-w-3xl leading-relaxed text-slate-600">
            Try one page free. One Free export per domain across all accounts.
            Assets stay linked to the original site, and the export includes a
            SnapSite credit link.
          </p>
          <button
            type="button"
            onClick={() =>
              toast({
                title: "Free export started",
                description: "Try one page free — paste your published URL to begin.",
              })
            }
            className="group mt-4 inline-flex items-center gap-2 text-base font-bold text-teal-600 transition-colors hover:text-teal-700"
          >
            Try one page free
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mx-auto mt-10 max-w-4xl border-t border-slate-200 pt-8 text-slate-600">
          Annual billing and Agency options.{" "}
          <a
            href="#"
            className="font-semibold text-slate-900 underline underline-offset-4 hover:text-teal-600"
          >
            See all plans
          </a>
        </div>
      </div>
    </section>
  );
}

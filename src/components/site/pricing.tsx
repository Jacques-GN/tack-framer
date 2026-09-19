"use client";

import { ArrowRight, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Site Pass",
    badge: "One-time export",
    desc: "One site to move. One payment. No subscription.",
    price: "$15",
    per: "once",
    cta: "Export once — $15",
    ctaTitle: "Site Pass selected",
    ctaDesc: "One successful export — $15, one payment.",
    featured: true,
    features: [
      "One successful export, up to 100 pages",
      "Website files with downloaded assets",
      "30-day access to your download",
    ],
    footer: ["Scan your site and review the pages before checkout.", "A failed export restores your pass so you can retry."],
  },
  {
    name: "Pro",
    badge: "",
    desc: "Keep exporting as your sites evolve.",
    price: "$10",
    per: "/ month",
    cta: "Get Pro — $10/month",
    ctaTitle: "Pro plan selected",
    ctaDesc: "50 exports every month — $10/month, billed monthly.",
    featured: false,
    features: [
      "50 exports every month",
      "Up to 100 pages per export",
      "Download files and assets, or deploy to GitHub and Netlify",
    ],
    footer: ["Billed monthly. Renews until canceled."],
  },
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
            Export once with Site Pass, or choose Pro for regular updates and client projects.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.featured
                  ? "relative flex flex-col rounded-2xl border-2 border-violet-500 bg-white p-8 shadow-[0_20px_50px_rgba(124,58,237,0.12)]"
                  : "flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_36px_rgba(15,23,42,0.06)]"
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-slate-900">{plan.name}</h3>
                {plan.badge && (
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.desc}</p>
              <p className="mt-6">
                <span className="font-display text-5xl font-bold tracking-tight text-slate-900">{plan.price}</span>{" "}
                <span className="text-slate-500">{plan.per}</span>
              </p>
              <button
                type="button"
                onClick={() => toast({ title: plan.ctaTitle, description: plan.ctaDesc })}
                className={
                  plan.featured
                    ? "btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-[0_10px_28px_rgba(124,58,237,0.4)] transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                    : "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-900 transition-all duration-200 hover:border-violet-400 hover:text-violet-700 active:scale-[0.98]"
                }
              >
                {plan.cta}
                <ArrowRight className="size-4" />
              </button>

              <p className="mt-7 text-sm font-bold text-slate-900">Features included:</p>
              <ul className="mt-3.5 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-violet-600" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex-1" />
              <div className="mt-7 space-y-2.5 border-t border-slate-100 pt-5 text-sm text-slate-600">
                {plan.footer.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Free try */}
        <div className="mx-auto mt-12 max-w-4xl border-t border-slate-200 pt-10">
          <h3 className="font-display text-xl font-bold text-slate-900">
            Want to check the output first?
          </h3>
          <p className="mt-2.5 max-w-3xl leading-relaxed text-slate-600">
            Try one page free. One Free export per domain across all accounts. Assets stay linked
            to the original site, and the export includes a SnapSite credit link.
          </p>
          <button
            type="button"
            onClick={() =>
              toast({ title: "Free export started", description: "Try one page free — paste your published URL to begin." })
            }
            className="group mt-4 inline-flex items-center gap-2 text-base font-bold text-violet-600 transition-colors hover:text-violet-700"
          >
            Try one page free
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mx-auto mt-10 max-w-4xl border-t border-slate-200 pt-8 text-slate-600">
          Annual billing and Agency options.{" "}
          <a href="#" className="font-semibold text-slate-900 underline underline-offset-4 hover:text-violet-600">
            See all plans
          </a>
        </div>
      </div>
    </section>
  );
}

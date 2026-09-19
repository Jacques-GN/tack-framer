import { ArrowRight, Check, FileCode2 } from "lucide-react";

const steps = [
  {
    title: "Paste the public link",
    desc: "Copy the address of your published site — not its editor. The page must open without a login.",
  },
  {
    title: "Choose the pages to export",
    desc: "The scan follows internal links and lists every page found. Select the ones you need.",
  },
];

export function HowItWorks01() {
  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
          How it works <span className="text-violet-400">·</span> 01
        </div>
        <h2 className="font-display mt-6 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Paste your <span className="text-violet-600">site URL</span> and choose pages.
        </h2>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Mockup: browser card -> pages found */}
          <div className="relative">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="relative w-40 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:w-44">
                <div className="flex items-center gap-1 border-b border-slate-100 px-3 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-2 rounded-full bg-slate-200" />
                  ))}
                </div>
                <div className="space-y-2.5 p-3.5">
                  <div className="h-2.5 w-3/4 rounded-full bg-slate-100" />
                  <div className="h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-14 rounded-lg bg-slate-100" />
                </div>
                <div
                  className="animate-scan-line absolute inset-x-3 h-0.5 rounded-full bg-violet-400/70 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                  aria-hidden="true"
                />
              </div>

              <ArrowRight className="mt-16 size-6 text-violet-500 sm:mt-20" aria-hidden="true" />

              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Pages found
                  </span>
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700">
                    0 / 4
                  </span>
                </div>
                <ul className="divide-y divide-slate-50">
                  {["/about", "/blog/*", "/pricing", "/contact"].map((page) => (
                    <li key={page} className="flex items-center justify-between px-4 py-2.5">
                      <span className="flex items-center gap-2 font-mono text-[13px] text-slate-600">
                        <FileCode2 className="size-3.5 text-violet-500" />
                        {page}
                      </span>
                      <Check className="size-4 text-violet-500" strokeWidth={3} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)]">
              <span className="animate-pulse-dot size-2 rounded-full bg-white" />
              scanning…
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              Choose what to include
            </p>
            <ol className="mt-6 space-y-8">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="btn-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_4px_12px_rgba(124,58,237,0.35)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-slate-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, Check, FileCode2, FileText } from "lucide-react";

const pages = ["/about", "/blog/*", "/pricing", "/contact"];

export function HowItWorks01() {
  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
          How it works <span className="text-teal-400">·</span> 01
        </div>

        <h2 className="font-display mt-6 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Paste your <span className="text-teal-600">Framer URL</span> and
          choose pages.
        </h2>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual mockup */}
          <div className="relative">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Browser card */}
              <div className="relative w-40 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:w-44">
                <div className="flex items-center gap-1 border-b border-slate-100 px-3 py-2.5">
                  <span className="size-2 rounded-full bg-slate-200" />
                  <span className="size-2 rounded-full bg-slate-200" />
                  <span className="size-2 rounded-full bg-slate-200" />
                </div>
                <div className="space-y-2.5 p-3.5">
                  <div className="h-2.5 w-3/4 rounded-full bg-slate-100" />
                  <div className="h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-14 rounded-lg bg-slate-100" />
                  <div className="h-2.5 w-1/2 rounded-full bg-slate-100" />
                </div>
                {/* scan line */}
                <div
                  className="animate-scan-line absolute inset-x-3 h-0.5 rounded-full bg-teal-400/70 shadow-[0_0_12px_rgba(20,184,166,0.8)]"
                  aria-hidden="true"
                />
              </div>

              {/* Arrow */}
              <div className="mt-16 text-teal-500 sm:mt-20" aria-hidden="true">
                <ArrowRight className="size-6" />
              </div>

              {/* Pages found card */}
              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Pages found
                  </span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">
                    0 / 4
                  </span>
                </div>
                <ul className="divide-y divide-slate-50">
                  {pages.map((page) => (
                    <li key={page} className="flex items-center justify-between px-4 py-2.5">
                      <span className="flex items-center gap-2 font-mono text-[13px] text-slate-600">
                        <FileCode2 className="size-3.5 text-teal-500" />
                        {page}
                      </span>
                      <Check className="size-4 text-teal-500" strokeWidth={3} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* scanning pill */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full btn-teal-gradient px-4 py-2 text-sm font-bold text-white shadow-[0_8px_24px_rgba(13,148,136,0.35)]">
              <span className="animate-pulse-dot size-2 rounded-full bg-white" />
              scanning…
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
              Choose what to include
            </p>
            <ol className="mt-6 space-y-8">
              <li className="flex gap-4">
                <span className="btn-teal-gradient flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_4px_12px_rgba(13,148,136,0.35)]">
                  1
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Paste the public Framer link
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-slate-600">
                    Copy the address of your published site, not its editor. The
                    page must open without a login.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="btn-teal-gradient flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_4px_12px_rgba(13,148,136,0.35)]">
                  2
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Choose the pages to export
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-slate-600">
                    The scan follows links up to three levels deep. Select the
                    pages you need from the results, within your plan&apos;s
                    limit.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-10 hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:flex">
              <FileText className="size-5 shrink-0 text-teal-600" />
              <p className="text-sm leading-relaxed text-slate-600">
                Your plan limits how many pages each export includes. Failed
                scans never count against your quota.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

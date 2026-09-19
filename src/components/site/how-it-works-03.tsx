import { CheckCircle2, Cloud, FileArchive, Sparkles } from "lucide-react";

const hosts = [
  {
    name: "Vercel",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6 fill-slate-900" aria-hidden="true">
        <path d="M12 3l10 18H2L12 3z" />
      </svg>
    ),
  },
  {
    name: "Netlify",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <g fill="none" stroke="#0ea5a4" strokeWidth="1.8">
          <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
        </g>
        <circle cx="12" cy="12" r="3" fill="#0ea5a4" />
      </svg>
    ),
  },
  {
    name: "Cloudflare",
    icon: <Cloud className="size-6 fill-orange-400 text-orange-400" />,
  },
  {
    name: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6 fill-slate-900" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
];

export function HowItWorks03() {
  return (
    <section className="relative border-t border-slate-100 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
          How it works <span className="text-amber-300">·</span> 03
        </div>

        <h2 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Test your <span className="text-orange-500">exported site</span> then
          publish it.
        </h2>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: zip + hosting mockup */}
          <div className="flex flex-col items-center">
            <div className="relative rounded-3xl border border-slate-200 bg-white px-12 py-9 text-center shadow-[0_24px_60px_rgba(232,114,28,0.12)]">
              <div
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-orange-200/20 blur-3xl"
                aria-hidden="true"
              />
              <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-[0_10px_28px_rgba(232,114,28,0.4)]">
                <FileArchive className="size-8 text-white" />
              </span>
              <p className="mt-4 font-mono text-sm font-semibold text-slate-700">
                framer-export.zip
              </p>
            </div>

            {/* connectors */}
            <svg
              className="my-1 h-14 w-72 text-amber-300"
              viewBox="0 0 288 56"
              fill="none"
              aria-hidden="true"
            >
              <path d="M144 0 C 144 30, 36 20, 36 56" stroke="currentColor" strokeWidth="1.5" />
              <path d="M144 0 C 144 30, 108 20, 108 56" stroke="currentColor" strokeWidth="1.5" />
              <path d="M144 0 C 144 30, 180 20, 180 56" stroke="currentColor" strokeWidth="1.5" />
              <path d="M144 0 C 144 30, 252 20, 252 56" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <div className="grid grid-cols-4 gap-3 sm:gap-5">
              {hosts.map((host) => (
                <div key={host.name} className="flex flex-col items-center gap-2">
                  <div className="flex size-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    {host.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {host.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
              <CheckCircle2 className="size-4" />
              Choose your hosting
            </div>
          </div>

          {/* Right: steps + callout */}
          <div>
            <ol className="space-y-8">
              <li className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                  1
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Test the exported site
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-slate-600">
                    Unzip the download and open the files through a local web
                    server or temporary hosting. Check layouts, links, forms and
                    animations on desktop and mobile.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                  2
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Publish on your chosen host
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-slate-600">
                    Upload the tested files to Vercel, Netlify, Cloudflare Pages
                    or GitHub Pages. Check the live site before changing your
                    domain. Hosting costs and provider terms apply.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-9 flex gap-3.5 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <p className="text-[15px] leading-relaxed text-slate-700">
                <span className="font-bold text-slate-900">
                  Before you move your domain.
                </span>{" "}
                CMS content is a fixed copy; export again after updates.
                Reconnect forms and hosted services. Test custom components and
                advanced animations before launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

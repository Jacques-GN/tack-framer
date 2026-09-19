import { FileCode2, ImageIcon, Sparkles } from "lucide-react";

const zipItems = [
  {
    icon: FileCode2,
    title: "Page content and design",
    description:
      "Your published Framer pages, visible content and responsive styles. This is a copy of the live site, without the Framer editor. Review page titles and search settings before publishing.",
  },
  {
    icon: ImageIcon,
    title: "Images and fonts",
    description:
      "Choose downloaded assets to include available images and fonts. Free exports keep them linked to the original site. Videos and embeds may still need an internet connection.",
  },
  {
    icon: Sparkles,
    title: "Menus and animations",
    description:
      "Supported menus, component states and animations are included. Test custom components and embeds; some still need external services.",
  },
];

const chips = ["HTML", "IMAGES", "CSS", "JS"];

export function HowItWorks02() {
  return (
    <section className="relative border-t border-slate-100 bg-white py-20 sm:py-28">
      {/* subtle indigo glow */}
      <div
        className="pointer-events-none absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-indigo-500/5 blur-[100px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
          How it works <span className="text-indigo-300">·</span> 02
        </div>

        <h2 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          Download your <span className="text-indigo-600">Framer site</span> as
          HTML files.
        </h2>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: zip contents */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Inside your ZIP download
            </p>
            <ul className="mt-6 space-y-7">
              {zipItems.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mockup */}
          <div className="relative">
            <div className="inline-flex rounded-lg bg-slate-100 px-3.5 py-2 font-mono text-[13px] text-slate-500">
              yoursite.framer.website
            </div>

            <div className="relative mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
              {/* mini browser */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="h-2 w-16 rounded-full bg-indigo-500" />
                <div className="mt-3 h-2 w-24 rounded-full bg-slate-200" />
                <div className="mt-4 flex gap-3">
                  <div className="h-24 w-20 rounded-lg bg-slate-200/80" />
                  <div className="flex-1 space-y-2.5 pt-1">
                    <div className="h-2 w-full rounded-full bg-slate-200/80" />
                    <div className="h-2 w-5/6 rounded-full bg-slate-200/80" />
                    <div className="h-2 w-4/6 rounded-full bg-slate-200/80" />
                    <div className="mt-4 h-7 w-24 rounded-lg bg-slate-200/80" />
                  </div>
                </div>
              </div>

              {/* connector lines */}
              <svg
                className="absolute -bottom-9 left-1/2 h-10 w-56 -translate-x-1/2 text-indigo-300"
                viewBox="0 0 224 40"
                fill="none"
                aria-hidden="true"
              >
                <path d="M112 0 C 112 20, 28 16, 28 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M112 0 L 112 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M112 0 C 112 20, 196 16, 196 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </div>

            {/* chips */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-lg border border-indigo-100 bg-white px-3.5 py-2 text-xs font-bold tracking-[0.12em] text-slate-600 shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

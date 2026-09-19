import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Cloud,
  FileArchive,
  FileCode2,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

/* Shared section shell: badge + title */
function Shell({
  n,
  badgeClass,
  title,
  children,
}: {
  n: string;
  badgeClass: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative border-t border-slate-100 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${badgeClass}`}>
          How it works <span className="opacity-50">·</span> {n}
        </div>
        <h2 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h2>
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">{children}</div>
      </div>
    </section>
  );
}

function StepList({ steps, dotClass }: { steps: { title: string; desc: string }[]; dotClass: string }) {
  return (
    <ol className="space-y-8">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${dotClass}`}>
            {i + 1}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mt-1.5 leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── 01: paste URL → scan pages ─────────────────────────────────────────── */
const steps1 = [
  { title: "Paste the public link", desc: "Copy the address of your published site — not its editor. The page must open without a login." },
  { title: "Choose the pages to export", desc: "The scan follows internal links and lists every page found. Select the ones you need." },
];

function ScanMock() {
  return (
    <div className="flex items-start gap-4 sm:gap-6">
      <div className="relative w-40 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:w-44">
        <div className="flex items-center gap-1 border-b border-slate-100 px-3 py-2.5">
          {[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-slate-200" />)}
        </div>
        <div className="space-y-2.5 p-3.5">
          <div className="h-2.5 w-3/4 rounded-full bg-slate-100" />
          <div className="h-2.5 w-full rounded-full bg-slate-100" />
          <div className="h-14 rounded-lg bg-slate-100" />
        </div>
        <div className="animate-scan-line absolute inset-x-3 h-0.5 rounded-full bg-teal-400/70 shadow-[0_0_12px_rgba(20,184,166,0.8)]" aria-hidden="true" />
      </div>
      <ArrowRight className="mt-16 size-6 text-teal-500 sm:mt-20" aria-hidden="true" />
      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Pages found</span>
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">0 / 4</span>
        </div>
        <ul className="divide-y divide-slate-50">
          {["/about", "/blog/*", "/pricing", "/contact"].map((page) => (
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
  );
}

/* ── 02: what's inside the ZIP ──────────────────────────────────────────── */
const zipItems = [
  { icon: FileCode2, title: "Page content and design", description: "Your published pages with visible content and responsive styles — a copy of the live site, without the original editor." },
  { icon: ImageIcon, title: "Images and fonts", description: "Choose which assets to download. Anything not downloaded stays linked to the original site; videos and embeds may need internet access." },
  { icon: Sparkles, title: "Menus and animations", description: "Supported menus, component states and animations are included. Test custom components and embeds after export." },
];

/* ── 03: test then publish ──────────────────────────────────────────────── */
const hosts = [
  { name: "Vercel", icon: <svg viewBox="0 0 24 24" className="size-6 fill-slate-900" aria-hidden="true"><path d="M12 3l10 18H2L12 3z" /></svg> },
  { name: "Netlify", icon: <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true"><g fill="none" stroke="#06b6d4" strokeWidth="1.8"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" /></g><circle cx="12" cy="12" r="3" fill="#06b6d4" /></svg> },
  { name: "Cloudflare", icon: <Cloud className="size-6 fill-amber-400 text-amber-400" /> },
  { name: "GitHub", icon: <svg viewBox="0 0 24 24" className="size-6 fill-slate-900" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg> },
];

const steps3 = [
  { title: "Test the exported site", desc: "Unzip the download and open the files through a local web server. Check layouts, links, forms and animations on desktop and mobile." },
  { title: "Publish on your chosen host", desc: "Upload the tested files to Vercel, Netlify, Cloudflare Pages or GitHub Pages, then check the live site before changing your domain." },
];

export function HowItWorks() {
  return (
    <>
      <Shell
        n="01"
        badgeClass="bg-teal-50 text-teal-700"
        title={<>Paste your <span className="text-teal-600">site URL</span> and choose pages.</>}
      >
        <div className="flex flex-col gap-6">
          <ScanMock />
          <div className="btn-primary inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-bold text-white shadow-[0_8px_24px_rgba(13,148,136,0.35)]">
            <span className="animate-pulse-dot size-2 rounded-full bg-white" />
            scanning…
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">Choose what to include</p>
          <div className="mt-6"><StepList steps={steps1} dotClass="btn-primary" /></div>
        </div>
      </Shell>

      <Shell
        n="02"
        badgeClass="bg-cyan-50 text-cyan-600"
        title={<>Download your <span className="text-cyan-600">site</span> as HTML files.</>}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Inside your ZIP download</p>
          <ul className="mt-6 space-y-7">
            {zipItems.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <div className="inline-flex rounded-lg bg-slate-100 px-3.5 py-2 font-mono text-[13px] text-slate-500">yoursite.com</div>
          <div className="relative mt-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="h-2 w-16 rounded-full bg-cyan-500" />
              <div className="mt-3 h-2 w-24 rounded-full bg-slate-200" />
              <div className="mt-4 flex gap-3">
                <div className="h-24 w-20 rounded-lg bg-slate-200/80" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-2 w-full rounded-full bg-slate-200/80" />
                  <div className="h-2 w-5/6 rounded-full bg-slate-200/80" />
                  <div className="h-2 w-4/6 rounded-full bg-slate-200/80" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["HTML", "IMAGES", "CSS", "JS", "sitemap.xml", "robots.txt"].map((chip) => (
              <span key={chip} className="rounded-lg border border-cyan-100 bg-white px-3.5 py-2 text-xs font-bold tracking-[0.12em] text-slate-600 shadow-sm">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Shell>

      <Shell
        n="03"
        badgeClass="bg-amber-50 text-amber-600"
        title={<>Test your <span className="text-amber-500">exported site</span> then publish it.</>}
      >
        <div className="flex flex-col items-center">
          <div className="relative rounded-3xl border border-slate-200 bg-white px-12 py-9 text-center shadow-[0_24px_60px_rgba(245,158,11,0.12)]">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-[0_10px_28px_rgba(245,158,11,0.4)]">
              <FileArchive className="size-8 text-white" />
            </span>
            <p className="mt-4 font-mono text-sm font-semibold text-slate-700">site-export.zip</p>
          </div>
          <div className="my-5 h-8 w-px border-l-2 border-dashed border-amber-300" aria-hidden="true" />
          <div className="grid grid-cols-4 gap-3 sm:gap-5">
            {hosts.map((host) => (
              <div key={host.name} className="flex flex-col items-center gap-2">
                <div className="flex size-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  {host.icon}
                </div>
                <span className="text-xs font-semibold text-slate-600">{host.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
            <CheckCircle2 className="size-4" />
            Choose your hosting
          </div>
        </div>
        <div>
          <StepList steps={steps3} dotClass="bg-amber-400" />
          <div className="mt-9 flex gap-3.5 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5">
            <Bot className="mt-0.5 size-5 shrink-0 text-amber-500" />
            <p className="text-[15px] leading-relaxed text-slate-700">
              <span className="font-bold text-slate-900">Before you move your domain.</span> CMS
              content is a fixed copy — export again after updates. Reconnect forms and hosted
              services, and test custom components before launch.
            </p>
          </div>
        </div>
      </Shell>
    </>
  );
}

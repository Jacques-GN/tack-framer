"use client";

import { useState } from "react";
import { Sparkles, Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useExportStore } from "@/lib/export/store";

export function Hero() {
  const [url, setUrl] = useState("");
  const openWizard = useExportStore((s) => s.openWizard);
  const scanning = useExportStore((s) => s.scanning);

  const handleExport = () => {
    if (!url.trim()) {
      toast({
        title: "Enter a website URL",
        description: "Paste your published Framer site URL to start the export.",
      });
      return;
    }
    // Opens the export wizard: real scan -> page selection -> options -> ZIP
    openWizard(url);
  };

  return (
    <section className="relative overflow-hidden bg-[#0a1424] pt-40 pb-24 sm:pt-48 sm:pb-32">
      {/* Grid pattern */}
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      {/* Teal glows */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-teal-500/20 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 -top-20 h-[420px] w-[420px] rounded-full bg-teal-400/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-full h-64 w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300">
          <span className="animate-pulse-dot size-2 rounded-full bg-teal-400" />
          From published URL to portable files
        </div>

        {/* H1 */}
        <h1 className="font-display mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          Export{" "}
          <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
            Framer
          </span>{" "}
          to HTML
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
          Download your published Framer site as portable HTML, CSS and
          JavaScript for self-hosting, editing or developer handoff.
        </p>

        {/* URL input */}
        <div className="mx-auto mt-11 max-w-2xl">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:gap-3 sm:rounded-full sm:py-2 sm:pl-7 sm:pr-2.5">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExport()}
              placeholder="Enter website URL..."
              aria-label="Website URL"
              className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-lg"
            />
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-400 sm:flex">
              <Clipboard className="size-3" /> V
            </kbd>
            <button
              type="button"
              onClick={handleExport}
              disabled={scanning}
              className="btn-teal-gradient inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3.5 text-base font-bold text-white shadow-[0_10px_28px_rgba(13,148,136,0.45)] transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-70 sm:rounded-full sm:px-7 sm:py-3.5"
            >
              {scanning ? (
                <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Sparkles className="size-5" />
              )}
              <span className="hidden sm:inline">
                {scanning ? "Scanning..." : "Export Site"}
              </span>
              <span className="sm:hidden">{scanning ? "Scanning..." : "Export"}</span>
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Free: 10 single-page exports a month. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}

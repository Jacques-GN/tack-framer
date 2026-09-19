"use client";

import { Bot, Code2, FileText, PartyPopper } from "lucide-react";
import { useExportStore } from "@/lib/export/store";
import { ToggleRow } from "./ui-bits";

export function StepOptimize() {
  const { options, patchOptions, mode, pages, selected } = useExportStore();
  const enabledCount = (options.minifyHtml ? 1 : 0) + (options.seoReport ? 1 : 0);
  const isMulti = mode === "multi" && selected.length > 1;

  return (
    <div>
      <p className="text-sm font-bold text-teal-600">Étape 2 sur 3</p>
      <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Fine-tune your files
      </h2>
      <p className="mt-3 max-w-2xl text-slate-500">
        These optional settings apply when you start the export. You can keep the defaults and
        continue.
      </p>

      {/* Optional enhancements */}
      <section className="mt-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900">Optional enhancements</h3>
          <span className="text-sm text-slate-500">{enabledCount} of 2 enabled</span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ToggleRow
            icon={<Code2 className="size-5" />}
            title="Minify HTML"
            desc="Remove unnecessary whitespace and comments from HTML."
            checked={options.minifyHtml}
            onToggle={() => patchOptions({ minifyHtml: !options.minifyHtml })}
          />
          <ToggleRow
            icon={<FileText className="size-5" />}
            title="Include an SEO audit report"
            desc="Receive a report on page titles, headings and metadata, with issues to review."
            checked={options.seoReport}
            onToggle={() => patchOptions({ seoReport: !options.seoReport })}
          />
        </div>
      </section>

      {/* Included for multi-page */}
      <section className="mt-8">
        <h3 className="text-base font-bold text-slate-900">
          Included when you export multiple pages
        </h3>

        {isMulti ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Code2 className="size-5 shrink-0 text-orange-500" />
                <p className="text-sm font-bold text-slate-900">Generate sitemap.xml</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                List successfully exported pages for search engines.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Bot className="size-5 shrink-0 text-orange-500" />
                <p className="text-sm font-bold text-slate-900">Generate robots.txt</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Include crawler rules with a link to your sitemap.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-500">
            <PartyPopper className="mt-0.5 size-5 shrink-0 text-slate-400" />
            <p>
              Vous exportez une seule page — sitemap.xml et robots.txt sont générés uniquement
              pour les exportations de plusieurs pages ({pages.length} pages détectées sur ce
              site). Repassez en mode « Plusieurs pages » à l&apos;étape 1 pour les inclure.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

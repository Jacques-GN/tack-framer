"use client";

import { useMemo, useState } from "react";
import { Bot, ChevronDown, Code2, ExternalLink, FileCode2, Folder, Laptop, Monitor, Search, Smartphone } from "lucide-react";
import { useExportStore } from "@/lib/export/store";
import { DELIVERY_LABELS, FORMS_LABELS, pageFilePath, pagePathOf } from "@/lib/export/types";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 8;

export function StepPreview() {
  const { pages, selected, options } = useExportStore();
  const [filter, setFilter] = useState("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string>(selected[0] || pages[0]?.url || "");

  const selectedPages = useMemo(() => pages.filter((p) => selected.includes(p.url)), [pages, selected]);

  const filteredFiles = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return selectedPages;
    return selectedPages.filter((p) => p.path.toLowerCase().includes(q));
  }, [selectedPages, filter]);

  const shownFiles = filteredFiles.slice(0, visible);
  const activePath = activeUrl ? pagePathOf(activeUrl) : "/";
  const isMulti = selected.length > 1;

  const deviceBtn = (id: "desktop" | "mobile", icon: React.ReactNode, label: string) => (
    <button
      type="button"
      aria-label={label}
      onClick={() => setDevice(id)}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        device === id ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
      )}
    >
      {icon}
    </button>
  );

  return (
    <div>
      <p className="text-sm font-bold text-teal-600">Étape 3 sur 3</p>
      <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Vérifiez votre site et vos fichiers
      </h2>
      <p className="mt-3 max-w-2xl text-slate-500">
        Parcourez le site original à côté des fichiers prévus pour votre exportation.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* ── Files panel ── */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Folder className="size-5 shrink-0 text-amber-500" />
            <span className="text-base font-bold text-slate-900">Fichiers</span>
            <span className="ml-auto text-xs text-slate-400">{selectedPages.length} pages HTML</span>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-teal-500">
            <Search className="size-3.5 shrink-0 text-slate-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setVisible(INITIAL_VISIBLE);
              }}
              placeholder="Filtrer les fichiers..."
              aria-label="Filtrer les fichiers"
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul className="mt-2 max-h-72 overflow-y-auto pr-1">
            {shownFiles.map((p) => (
              <li key={p.url}>
                <button
                  type="button"
                  onClick={() => setActiveUrl(p.url)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
                    p.url === activeUrl ? "bg-teal-50 ring-1 ring-teal-200" : "hover:bg-slate-50"
                  )}
                >
                  <FileCode2 className="size-4 shrink-0 text-amber-500" />
                  <span className="truncate font-mono text-xs text-slate-700">
                    {pageFilePath(pagePathOf(p.url))}
                  </span>
                </button>
              </li>
            ))}
            {shownFiles.length === 0 && <li className="px-2 py-3 text-xs text-slate-400">Aucun fichier ne correspond.</li>}
          </ul>

          {selectedPages.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setVisible((v) => (v >= filteredFiles.length ? INITIAL_VISIBLE : v + 10))}
              className="mt-2 text-xs font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
            >
              {visible >= filteredFiles.length
                ? "Afficher moins de pages"
                : `Afficher ${selectedPages.length - visible} pages de plus`}
            </button>
          )}

          <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2.5">
              <Folder className="size-4 shrink-0 text-amber-500" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700">Actifs/</p>
                <p className="truncate text-[11px] text-slate-400">
                  {[options.css && "css", options.js && "js", options.fonts && "polices", options.images && "images"]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
            {isMulti && (
              <>
                <div className="flex items-center gap-2.5">
                  <Code2 className="size-4 shrink-0 text-teal-600" />
                  <p className="font-mono text-xs text-slate-700">Sitemap.xml</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Bot className="size-4 shrink-0 text-teal-600" />
                  <p className="font-mono text-xs text-slate-700">robots.txt</p>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* ── Preview panel ── */}
        <div className="min-w-0">
          {/* URL bar */}
          <div className="flex flex-wrap items-center gap-2 rounded-t-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2">
              <FileCode2 className="size-4 shrink-0 text-amber-500" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                {(() => {
                  try {
                    return new URL(activeUrl).hostname + activePath + " web/";
                  } catch {
                    return activeUrl;
                  }
                })()}
              </span>
            </span>

            <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
              {deviceBtn("desktop", <Monitor className="size-4" />, "Vue bureau")}
              {deviceBtn("mobile", <Smartphone className="size-4" />, "Vue mobile")}
            </div>

            <a
              href={activeUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir dans un nouvel onglet"
              className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>

          {/* Iframe */}
          <div className="overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 bg-slate-100 shadow-sm">
            <div className="flex h-6 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-slate-300" />
              ))}
            </div>
            <div className="h-[520px] overflow-auto">
              {activeUrl ? (
                <iframe
                  key={activeUrl + device}
                  src={`/api/preview?url=${encodeURIComponent(activeUrl)}`}
                  title="Aperçu du site original"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  className={cn("mx-auto block h-full border-0 bg-white", device === "mobile" && "w-[390px]")}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Sélectionnez une page à prévisualiser
                </div>
              )}
            </div>
          </div>

          {/* Export details */}
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <button
              type="button"
              onClick={() => setDetailsOpen((o) => !o)}
              aria-expanded={detailsOpen}
              className="flex w-full items-center gap-2.5 text-left"
            >
              <Laptop className="size-4 shrink-0 text-teal-600" />
              <span className="flex-1 text-sm font-bold text-slate-900">Détails d'exportation</span>
              <ChevronDown className={cn("size-4 text-slate-400 transition-transform", detailsOpen && "rotate-180")} />
            </button>
            {detailsOpen && (
              <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ["Pages", `${selectedPages.length} pages HTML`],
                  [
                    "Actifs",
                    [options.images && "Images", options.fonts && "Polices", options.css && "CSS", options.js && "JavaScript"]
                      .filter(Boolean)
                      .join(", ") || "Aucun",
                  ],
                  ["Formulaires", FORMS_LABELS[options.forms]],
                  ["Livraison", DELIVERY_LABELS[options.delivery]],
                  ["Minify HTML", options.minifyHtml ? "Activé" : "Désactivé"],
                  ["Audit SEO", options.seoReport ? "Inclus" : "Non inclus"],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between gap-4 sm:block">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
                    <dd className="font-semibold text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

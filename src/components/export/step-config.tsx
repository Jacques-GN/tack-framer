"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Code2,
  Download,
  FileUp,
  Globe,
  Link2,
  Mail,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { useExportStore } from "@/lib/export/store";
import { FORMS_LABELS } from "@/lib/export/types";
import { CardDropdown, CheckBadge, GreenCheckbox, SectionHeader } from "./ui-bits";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 8;

const FORM_MODES = [
  {
    id: "snapsite" as const,
    icon: <Mail className="size-5" />,
    desc: "Nous traitons les soumissions et vous envoyons les données par e-mail.",
  },
  {
    id: "manual" as const,
    icon: <Code2 className="size-5" />,
    desc: "Conservez les attributs du formulaire original. Vous gérez le backend.",
  },
  {
    id: "custom" as const,
    icon: <Link2 className="size-5" />,
    desc: "Envoyez les données à votre propre API (Zapier, Make, etc.).",
  },
  {
    id: "formspree" as const,
    icon: <Globe className="size-5" />,
    desc: "Envoyez les soumissions à Formspree. Collez l'URL de votre endpoint ci-dessous.",
  },
  {
    id: "netlify" as const,
    icon: <Upload className="size-5" />,
    desc: "Détection automatique une fois le site déployé sur Netlify.",
  },
];

const DELIVERY_MODES = [
  { id: "zip" as const, title: "ZIP download", desc: "Download the export as a ZIP file.", icon: <Download className="size-5" /> },
  { id: "github" as const, title: "Sync with GitHub", desc: "Push your export to a GitHub repository.", icon: <Code2 className="size-5" />, badge: "Pro", disabled: true },
  { id: "netlify" as const, title: "Deploy to Netlify", desc: "Deploy your export as a live Netlify site.", icon: <Globe className="size-5" />, badge: "Pro", disabled: true },
];

export function StepConfig() {
  const {
    pages, selected, mode, scanning, scanError, options,
    setMode, togglePage, selectAll, deselectAll, patchOptions,
  } = useExportStore();

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setClosed((c) => ({ ...c, [k]: !c[k] }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((p) => p.path.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
  }, [pages, search]);

  const shown = filtered.slice(0, visible);
  const formMode = FORM_MODES.find((m) => m.id === options.forms)!;

  const modeCard = (id: "single" | "multi", icon: React.ReactNode, title: string, desc: string) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      aria-pressed={mode === id}
      className={cn(
        "relative rounded-xl border p-4 text-left transition-all duration-150",
        mode === id ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600" : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      {mode === id && <CheckBadge />}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-slate-500">{icon}</span>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-snug text-slate-500">{desc}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div>
      <p className="text-sm font-bold text-teal-600">Étape 1 sur 3</p>
      <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Choisissez quoi exporter
      </h2>
      <p className="mt-3 max-w-2xl text-slate-500">
        Sélectionnez vos pages, choisissez les ressources à télécharger et décidez comment recevoir
        vos fichiers.
      </p>

      {scanning && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
          <span className="size-4 animate-spin rounded-full border-2 border-teal-300 border-t-teal-600" />
          Analyse du site en cours — découverte des pages…
        </div>
      )}
      {scanError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {scanError}
        </div>
      )}

      {/* ── Pages to export ── */}
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Pages à exporter"
          right={<span className="mr-1 text-sm text-slate-500">{selected.length} sur {pages.length} sélectionnées</span>}
          open={!closed.pages}
          onToggle={() => toggle("pages")}
        />

        {!closed.pages && (
          <div className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {modeCard("single", <FileUp className="size-5" />, "Page unique", "Exportez uniquement l'URL saisie.")}
              {modeCard("multi", <SlidersHorizontal className="size-5" />, "Plusieurs pages", `Choisissez parmi les ${pages.length} pages trouvées.`)}
            </div>

            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-teal-500">
              <Search className="size-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisible(INITIAL_VISIBLE);
                }}
                placeholder="Pages de recherche..."
                aria-label="Rechercher des pages"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-3 flex items-center gap-5">
              <button type="button" onClick={selectAll} className="text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">
                Sélectionnez tout
              </button>
              <button type="button" onClick={deselectAll} className="text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800">
                Tout désélectionner
              </button>
            </div>

            <ul className="mt-2">
              {shown.map((p) => (
                <li key={p.url} className="border-b border-slate-100 last:border-b-0">
                  <label className="flex cursor-pointer items-center gap-3 py-3">
                    <GreenCheckbox checked={selected.includes(p.url)} onToggle={() => togglePage(p.url)} label={`Sélectionner ${p.path}`} />
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        togglePage(p.url);
                      }}
                      className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700"
                    >
                      {p.path}
                    </span>
                    {p.title && (
                      <span className="hidden max-w-[45%] truncate text-xs text-slate-400 sm:block">{p.title}</span>
                    )}
                  </label>
                </li>
              ))}
              {shown.length === 0 && <li className="py-4 text-sm text-slate-400">Aucune page ne correspond.</li>}
            </ul>

            {filtered.length > INITIAL_VISIBLE && (
              <button
                type="button"
                onClick={() => setVisible((v) => (v >= filtered.length ? INITIAL_VISIBLE : v + 12))}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
              >
                {visible >= filtered.length ? "Afficher moins de pages" : `Afficher ${filtered.length - visible} pages de plus`}
                <ChevronDown className={cn("size-4", visible >= filtered.length && "rotate-180")} />
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Export settings ── */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Paramètres d'exportation"
          icon={<SlidersHorizontal className="size-5 text-slate-600" />}
          open={!closed.settings}
          onToggle={() => toggle("settings")}
        />

        {!closed.settings && (
          <div className="mt-5 space-y-6">
            {/* Assets */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Actifs</h3>
              <div className="mt-3">
                <p className="text-sm leading-relaxed text-slate-500">
                  Choisissez les ressources à télécharger. Le reste restera lié au site d'origine.
                </p>
                <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {(
                    [
                      ["images", "Images"],
                      ["fonts", "Polices de caractères"],
                      ["css", "CSS"],
                      ["js", "JavaScript"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex cursor-pointer items-center gap-3">
                      <GreenCheckbox
                        checked={options[key]}
                        onToggle={() => patchOptions({ [key]: !options[key] } as never)}
                        label={label}
                      />
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Formulaires</h3>
              <div className="mt-4">
                <CardDropdown
                  ariaLabel="Gestion des formulaires"
                  value={options.forms}
                  onChange={(id) => patchOptions({ forms: id as never })}
                  entries={FORM_MODES.map((m) => ({ id: m.id, title: FORMS_LABELS[m.id], desc: m.desc, icon: m.icon }))}
                />
                {(options.forms === "custom" || options.forms === "formspree") && (
                  <input
                    type="url"
                    value={options.formsEndpoint}
                    onChange={(e) => patchOptions({ formsEndpoint: e.target.value })}
                    placeholder={options.forms === "formspree" ? "https://formspree.io/f/xxxxxxx" : "https://votre-api.com/endpoint"}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-500"
                  />
                )}
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{formMode.desc}</p>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Livraison de fichiers</h3>
              <div className="mt-4">
                <CardDropdown
                  ariaLabel="Livraison des fichiers"
                  value={options.delivery}
                  onChange={(id) => patchOptions({ delivery: id as never })}
                  entries={DELIVERY_MODES}
                />
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  La livraison GitHub et Netlify est disponible avec Pro ou Agency.{" "}
                  <span className="font-medium text-teal-700 underline underline-offset-2">
                    Choisissez une option d'exportation
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

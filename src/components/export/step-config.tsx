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

export function StepConfig() {
  const {
    pages,
    selected,
    mode,
    scanning,
    scanError,
    options,
    setMode,
    togglePage,
    selectAll,
    deselectAll,
    patchOptions,
  } = useExportStore();

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [formsOpen, setFormsOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) => p.path.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
    );
  }, [pages, search]);

  const shown = filtered.slice(0, visible);
  const total = pages.length;

  return (
    <div>
      {/* Heading */}
      <p className="text-sm font-bold text-teal-600">Étape 1 sur 4</p>
      <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Choisissez quoi exporter
      </h2>
      <p className="mt-3 max-w-2xl text-slate-500">
        Sélectionnez vos pages, choisissez les ressources à télécharger et décidez comment
        recevoir vos fichiers.
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
          right={
            <span className="mr-1 text-sm text-slate-500">
              {selected.length} sur {total} sélectionnées
            </span>
          }
          open={pagesOpen}
          onToggle={() => setPagesOpen((o) => !o)}
        />

        {pagesOpen && (
          <div className="mt-5">
            {/* Mode cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("single")}
                aria-pressed={mode === "single"}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all duration-150",
                  mode === "single"
                    ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                {mode === "single" && <CheckBadge />}
                <div className="flex items-start gap-3">
                  <FileUp className="mt-0.5 size-5 shrink-0 text-slate-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Page unique</p>
                    <p className="mt-1 text-sm leading-snug text-slate-500">
                      Exportez uniquement l&apos;URL que vous avez saisie.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("multi")}
                aria-pressed={mode === "multi"}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all duration-150",
                  mode === "multi"
                    ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                {mode === "multi" && <CheckBadge />}
                <div className="flex items-start gap-3">
                  <SlidersHorizontal className="mt-0.5 size-5 shrink-0 text-slate-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Plusieurs pages</p>
                    <p className="mt-1 text-sm leading-snug text-slate-500">
                      Choisissez parmi les {total} pages trouvées.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Search */}
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

            {/* Select links */}
            <div className="mt-3 flex items-center gap-5">
              <button
                type="button"
                onClick={selectAll}
                className="text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
              >
                Sélectionnez tout
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
              >
                Tout désélectionner
              </button>
            </div>

            {/* Page list */}
            <ul className="mt-2">
              {shown.map((p) => {
                const checked = selected.includes(p.url);
                return (
                  <li key={p.url} className="border-b border-slate-100 last:border-b-0">
                    <label className="flex cursor-pointer items-center gap-3 py-3">
                      <GreenCheckbox
                        checked={checked}
                        onToggle={() => togglePage(p.url)}
                        label={`Sélectionner ${p.path}`}
                      />
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
                        <span className="hidden max-w-[45%] truncate text-xs text-slate-400 sm:block">
                          {p.title}
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
              {shown.length === 0 && (
                <li className="py-4 text-sm text-slate-400">Aucune page ne correspond.</li>
              )}
            </ul>

            {filtered.length > INITIAL_VISIBLE && (
              <button
                type="button"
                onClick={() => setVisible((v) => (v >= filtered.length ? INITIAL_VISIBLE : v + 12))}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
              >
                {visible >= filtered.length
                  ? "Afficher moins de pages"
                  : `Afficher ${filtered.length - visible} pages de plus`}
                <ChevronDown
                  className={cn("size-4", visible >= filtered.length && "rotate-180")}
                />
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Export settings ── */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Exporter les paramètres"
          icon={<SlidersHorizontal className="size-5 text-slate-600" />}
          open={settingsOpen}
          onToggle={() => setSettingsOpen((o) => !o)}
        />

        {settingsOpen && (
          <div className="mt-5 space-y-6">
            {/* Actifs */}
            <div className="border-b border-slate-100 pb-6">
              <SectionHeader
                title="Actifs"
                open={assetsOpen}
                onToggle={() => setAssetsOpen((o) => !o)}
              />
              {assetsOpen && (
                <div className="mt-3">
                  <p className="text-sm leading-relaxed text-slate-500">
                    Choisissez les ressources à télécharger. Toutes les ressources qui ne peuvent
                    pas être téléchargées peuvent toujours dépendre du site d&apos;origine.
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
              )}
            </div>

            {/* Formulaires */}
            <div className="border-b border-slate-100 pb-6">
              <SectionHeader
                title="Formulaires"
                open={formsOpen}
                onToggle={() => setFormsOpen((o) => !o)}
              />
              {formsOpen && (
                <div className="mt-4">
                  <CardDropdown
                    ariaLabel="Gestion des formulaires"
                    value={options.forms}
                    onChange={(id) => patchOptions({ forms: id as never })}
                    entries={[
                      {
                        id: "nocodeexport",
                        title: FORMS_LABELS.nocodeexport,
                        desc: "Nous traitons les soumissions de formulaires et vous envoyons les données par e-mail.",
                        icon: <Mail className="size-5" />,
                      },
                      {
                        id: "manual",
                        title: FORMS_LABELS.manual,
                        desc: "Conservez les attributs de la forme originale. Vous gérez le backend.",
                        icon: <Code2 className="size-5" />,
                      },
                      {
                        id: "custom",
                        title: FORMS_LABELS.custom,
                        desc: "Envoyez les données du formulaire à votre propre API (Zapier, Make, etc.).",
                        icon: <Link2 className="size-5" />,
                      },
                      {
                        id: "formspree",
                        title: FORMS_LABELS.formspree,
                        desc: "Envoyez les soumissions à Formspree. Collez l'URL de votre point de terminaison ci-dessous.",
                        icon: <Globe className="size-5" />,
                      },
                      {
                        id: "netlify",
                        title: FORMS_LABELS.netlify,
                        desc: "Détection automatique des formulaires lorsqu'ils sont déployés sur Netlify. Aucun backend nécessaire.",
                        icon: <Upload className="size-5" />,
                      },
                    ]}
                  />
                  {(options.forms === "custom" || options.forms === "formspree") && (
                    <input
                      type="url"
                      value={options.formsEndpoint}
                      onChange={(e) => patchOptions({ formsEndpoint: e.target.value })}
                      placeholder={
                        options.forms === "formspree"
                          ? "https://formspree.io/f/xxxxxxx"
                          : "https://votre-api.com/endpoint"
                      }
                      className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-500"
                    />
                  )}
                  {options.forms === "manual" && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                      Configurez vous-même la gestion des formulaires après l&apos;exportation. Les
                      formulaires peuvent nécessiter une nouvelle URL de soumission pour
                      fonctionner.
                    </p>
                  )}
                  {options.forms === "nocodeexport" && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                      Les formulaires détectés seront acheminés via NoCodeExport — vous recevrez
                      les soumissions par e-mail après l&apos;exportation.
                    </p>
                  )}
                  {options.forms === "netlify" && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                      L&apos;attribut data-netlify sera ajouté à chaque formulaire exporté.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Livraison de fichiers */}
            <div>
              <SectionHeader
                title="Livraison de fichiers"
                open={deliveryOpen}
                onToggle={() => setDeliveryOpen((o) => !o)}
              />
              {deliveryOpen && (
                <div className="mt-4">
                  <CardDropdown
                    ariaLabel="Livraison des fichiers"
                    value={options.delivery}
                    onChange={(id) => patchOptions({ delivery: id as never })}
                    entries={[
                      {
                        id: "zip",
                        title: "ZIP download",
                        desc: "Download the export as a ZIP file.",
                        icon: <Download className="size-5" />,
                      },
                      {
                        id: "github",
                        title: "Sync with GitHub",
                        desc: "Push your export to a GitHub repository.",
                        icon: <Code2 className="size-5" />,
                        badge: "Pro",
                        disabled: true,
                      },
                      {
                        id: "netlify",
                        title: "Deploy to Netlify",
                        desc: "Deploy your export as a live Netlify site.",
                        icon: <Globe className="size-5" />,
                        badge: "Pro",
                        disabled: true,
                      },
                    ]}
                  />
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    La livraison GitHub et Netlify est disponible avec Pro ou Agency.{" "}
                    <span className="font-medium text-teal-700 underline underline-offset-2">
                      Choisissez une option d&apos;exportation
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

"use client";

import { Check, ChevronDown, Download, FileText, FileUp, Layers, PencilLine, Sparkles } from "lucide-react";
import { useExportStore, type PlanId } from "@/lib/export/store";
import { DELIVERY_LABELS, FORMS_LABELS } from "@/lib/export/types";
import { cn } from "@/lib/utils";

function PlanCard({
  id,
  name,
  tagline,
  price,
  priceSuffix,
  features,
  footnote,
}: {
  id: PlanId;
  name: string;
  tagline: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  footnote: string;
}) {
  const { plan, setPlan } = useExportStore();
  const selected = plan === id;
  return (
    <button
      type="button"
      onClick={() => setPlan(id)}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-150 sm:p-6",
        selected
          ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
          : "border-slate-200 hover:border-slate-300"
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-lg font-bold text-slate-900">{name}</span>
          <span className="mt-0.5 block text-sm text-slate-500">{tagline}</span>
        </span>
        {selected ? (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
            <Check className="size-3.5" strokeWidth={3.5} />
          </span>
        ) : (
          <span className="size-6 shrink-0 rounded-full border-2 border-slate-300" />
        )}
      </span>

      <span className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold tracking-tight text-slate-900">{price}</span>
        {priceSuffix && <span className="text-sm text-slate-500">{priceSuffix}</span>}
      </span>

      <span className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-slate-100 pt-5">
        {features.map((f) => (
          <span key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
            <Check className="mt-0.5 size-4 shrink-0 text-slate-400" />
            {f}
          </span>
        ))}
      </span>

      <span className="mt-5 block border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
        {footnote}
      </span>
    </button>
  );
}

export function StepCheckout() {
  const { pages, selected, options, mode, plan, setStep } = useExportStore();
  const assetText = [
    options.images && "Images",
    options.fonts && "polices",
    options.css && "CSS",
    options.js && "JavaScript",
  ]
    .filter(Boolean)
    .join(", ");

  const priceLabel =
    plan === "site-pass" ? "15 $ une fois" : plan === "pro" ? "10 $ / mois" : "0 $";

  return (
    <div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Choisissez votre option d&apos;exportation
      </h2>
      <p className="mt-3 max-w-2xl text-slate-500">
        Exportez un site, abonnez-vous au travail en cours ou essayez une seule page
        gratuitement.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <PlanCard
          id="site-pass"
          name="Laissez-passer du site"
          tagline="Pour un déménagement unique"
          price="15 $"
          priceSuffix="Une fois"
          features={[
            "1 site, jusqu'à 100 pages",
            "Choisissez les ressources à télécharger",
            "Accès au téléchargement ZIP de 30 jours",
          ]}
          footnote="Pas d'abonnement. Les exportations ayant échoué restaurant votre passe."
        />
        <PlanCard
          id="pro"
          name="Pro"
          tagline="Pour les mises à jour continues"
          price="10 $"
          priceSuffix="/ mois"
          features={[
            "50 exportations/mois, jusqu'à 100 pages chacune",
            "Choisissez les ressources à télécharger",
            "Livraison ZIP, GitHub ou Netlify",
          ]}
          footnote="Facturé mensuellement. Renouvelle jusqu'à annulation."
        />
        <PlanCard
          id="free"
          name="gratuit"
          tagline="Testez une page"
          price="0 $"
          features={[
            "1 page · 1 exportation gratuite par domaine",
            "Les actifs restent liés à votre site",
            "Téléchargement ZIP",
          ]}
          footnote="La limite de domaine est partagée entre tous les comptes gratuits."
        />
      </div>

      {/* Your export summary */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900">Votre exportation</h3>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
          >
            <PencilLine className="size-3.5" />
            Modifier les paramètres
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2">
            <FileUp className="size-4 shrink-0 text-slate-500" />
            Exporter {selected.length} pages
            <ChevronDown className="size-3.5 text-slate-400" />
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers className="size-4 shrink-0 text-slate-500" />
            {assetText || "Aucun actif"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Download className="size-4 shrink-0 text-slate-500" />
            {DELIVERY_LABELS[options.delivery]}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2">
            <FileText className="size-4 shrink-0 text-slate-500" />
            Formulaires : {FORMS_LABELS[options.forms]}
          </span>
          {options.seoReport && (
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-slate-500" />
              Inclure un rapport d&apos;audit SEO
            </span>
          )}
          {mode === "multi" && selected.length > 1 && (
            <span className="inline-flex items-center gap-2">
              <FileText className="size-4 shrink-0 text-slate-500" />
              sitemap.xml + robots.txt
            </span>
          )}
        </div>
      </section>

      <p className="mt-5 text-center text-sm text-slate-400">
        Démo — aucune carte bancaire n&apos;est requise : cliquez sur « Démarrer
        l&apos;exportation » pour générer votre ZIP ({pages.length} pages détectées).
      </p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Rocket, X } from "lucide-react";
import { useExportStore } from "@/lib/export/store";
import { StepConfig } from "./step-config";
import { StepOptimize } from "./step-optimize";
import { StepPreview } from "./step-preview";
import { ProgressModal } from "./progress-modal";
import { cn } from "@/lib/utils";

const STEP_TITLES = ["Contenu & options", "Optimisations", "Vérification"];

export function ExportWizard() {
  const { open, step, scanning, pages, selected, exporting, setStep, closeWizard, startExport } =
    useExportStore();

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !exporting) closeWizard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, exporting, closeWizard]);

  if (!open) return null;

  const canContinue = step === 1 ? selected.length > 0 && !scanning : true;
  const isLast = step === 3;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Assistant d'exportation"
      >
        <div className="mx-auto my-6 w-full max-w-5xl px-3 sm:my-10 sm:px-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {step > 1 && (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    ✓
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-widest text-teal-600">
                    Assistant d&apos;exportation
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {step} / 3 — {STEP_TITLES[step - 1]}
                  </p>
                </div>
              </div>
              {/* Step dots */}
              <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      s === step ? "w-7 bg-teal-600" : s < step ? "w-4 bg-teal-300" : "w-4 bg-slate-200"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={closeWizard}
                disabled={exporting}
                aria-label="Fermer l'assistant"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {step === 1 && <StepConfig />}
              {step === 2 && <StepOptimize />}
              {step === 3 && <StepPreview />}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse items-center gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-between sm:px-8">
              <button
                type="button"
                onClick={() => (step === 1 ? closeWizard() : setStep((step - 1) as 1 | 2))}
                disabled={exporting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 sm:w-auto"
              >
                <ArrowLeft className="size-4" />
                {step === 1 ? "Annuler" : "Retour"}
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={() => void startExport()}
                  disabled={exporting || selected.length === 0}
                  className="btn-teal-gradient inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(13,148,136,0.4)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
                >
                  <Rocket className="size-4" />
                  Démarrer l&apos;exportation ({selected.length} page{selected.length > 1 ? "s" : ""})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => canContinue && setStep((step + 1) as 2 | 3)}
                  disabled={!canContinue}
                  className="btn-teal-gradient inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(13,148,136,0.4)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
                >
                  Continuer
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
            {pages.length} pages détectées sur ce site
          </p>
        </div>
      </div>

      <ProgressModal />
    </>
  );
}

"use client";

import { CheckCircle2, Download, Loader2, XCircle } from "lucide-react";
import { useExportStore } from "@/lib/export/store";
import { cn } from "@/lib/utils";

function phasePercent(phase: string, pagesDone: number, pagesTotal: number, filesCount: number): number {
  switch (phase) {
    case "queued":
      return 4;
    case "downloading":
      return 5 + Math.min(40, (pagesDone / Math.max(1, pagesTotal)) * 40);
    case "assets":
      return 45 + Math.min(45, Math.round((filesCount / 350) * 45));
    case "packaging":
      return 93;
    case "done":
      return 100;
    default:
      return 0;
  }
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ProgressModal() {
  const { job, exporting, closeWizard, startExport } = useExportStore();

  if (!exporting || !job) return null;

  const pct = phasePercent(job.phase, job.pagesDone, job.pagesTotal, job.filesCount);
  const done = job.status === "done";
  const failed = job.status === "error";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Progression de l'exportation"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Icon + title */}
        <div className="flex flex-col items-center text-center">
          {done ? (
            <CheckCircle2 className="size-14 text-teal-600" />
          ) : failed ? (
            <XCircle className="size-14 text-red-500" />
          ) : (
            <Loader2 className="size-14 animate-spin text-teal-600" />
          )}
          <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">
            {done
              ? "Exportation terminée !"
              : failed
                ? "Échec de l'exportation"
                : "Exportation en cours…"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            {done
              ? "Votre site est prêt à être téléchargé."
              : failed
                ? job.error || "Une erreur inattendue est survenue."
                : job.phaseLabel}
          </p>
        </div>

        {/* Progress bar */}
        {!done && !failed && (
          <div className="mt-6">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
              <span>{Math.round(pct)}%</span>
              <span>
                {job.pagesDone}/{job.pagesTotal} pages · {job.filesCount} fichiers
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        {done && (
          <dl className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Pages</dt>
              <dd className="font-display text-xl font-bold text-slate-900">{job.pagesTotal}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Fichiers</dt>
              <dd className="font-display text-xl font-bold text-slate-900">{job.filesCount}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Taille</dt>
              <dd className="font-display text-xl font-bold text-slate-900">{fmtBytes(job.bytes)}</dd>
            </div>
          </dl>
        )}

        {/* Live log */}
        {!done && !failed && job.log.length > 0 && (
          <ul className="mt-5 max-h-32 space-y-1.5 overflow-y-auto rounded-xl bg-slate-50 p-3">
            {job.log.slice(-6).map((l, i) => (
              <li key={`${i}-${l.slice(0, 12)}`} className="truncate font-mono text-[11px] text-slate-500">
                {l}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-2.5">
          {done && (
            <a
              href={`/api/export/download?jobId=${job.id}`}
              className="btn-teal-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(13,148,136,0.35)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              <Download className="size-4" />
              Télécharger le ZIP — {job.zipName}
            </a>
          )}
          {failed && (
            <button
              type="button"
              onClick={() => void startExport()}
              className="btn-teal-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(13,148,136,0.35)] transition-all hover:brightness-105"
            >
              Réessayer
            </button>
          )}
          <button
            type="button"
            onClick={closeWizard}
            className={cn(
              "inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-colors",
              done ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {done ? "Terminer" : "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}

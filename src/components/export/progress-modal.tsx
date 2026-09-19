"use client";

import { CheckCircle2, Download, Loader2, XCircle } from "lucide-react";
import { useExportStore } from "@/lib/export/store";

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ProgressModal() {
  const { exporting, progress, done, exportError, closeWizard, startExport } =
    useExportStore();

  if (!exporting && !done && !exportError) return null;

  const running = exporting && progress && progress.pct < 100;
  const failed = !!exportError;
  const finished = !!done;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Progression de l'exportation"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Icon + title */}
        <div className="flex flex-col items-center text-center">
          {finished ? (
            <CheckCircle2 className="size-14 text-teal-600" />
          ) : failed ? (
            <XCircle className="size-14 text-red-500" />
          ) : (
            <Loader2 className="size-14 animate-spin text-teal-600" />
          )}
          <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900">
            {finished
              ? "Exportation terminée !"
              : failed
                ? "Échec de l'exportation"
                : "Exportation en cours…"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            {finished
              ? "Le téléchargement du ZIP a démarré automatiquement."
              : failed
                ? exportError
                : progress?.label}
          </p>
        </div>

        {/* Progress bar */}
        {running && progress && (
          <div className="mt-6">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
              <span>{Math.round(progress.pct)}%</span>
              <span>Ne fermez pas cette fenêtre</span>
            </div>
            {progress.log.length > 0 && (
              <ul className="mt-5 max-h-28 space-y-1.5 overflow-y-auto rounded-xl bg-slate-50 p-3">
                {progress.log.slice(-5).map((l, i) => (
                  <li key={`${i}-${l.slice(0, 12)}`} className="truncate font-mono text-[11px] text-slate-500">
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Stats */}
        {finished && done && (
          <dl className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Pages</dt>
              <dd className="font-display text-xl font-bold text-slate-900">{done.pages}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Fichiers</dt>
              <dd className="font-display text-xl font-bold text-slate-900">{done.files}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">ZIP</dt>
              <dd className="font-display text-xl font-bold text-slate-900">{fmtBytes(done.bytes)}</dd>
            </div>
          </dl>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-2.5">
          {finished && (
            <p className="truncate rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-center font-mono text-xs font-medium text-teal-800">
              <Download className="mr-1.5 inline size-3.5" />
              {done?.filename}
            </p>
          )}
          {failed && (
            <button
              type="button"
              onClick={() => void startExport()}
              className="btn-teal-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(13,148,136,0.35)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              Réessayer
            </button>
          )}
          <button
            type="button"
            onClick={closeWizard}
            className={cnx(
              "inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-colors",
              finished
                ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                : "border-transparent text-slate-500 hover:bg-slate-50"
            )}
          >
            {finished ? "Terminer" : "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}

// local tiny cn helper to keep this file dependency-light
function cnx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

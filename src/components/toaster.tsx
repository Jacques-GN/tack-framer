"use client";

import { X } from "lucide-react";
import { useToastStore } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">{t.title}</p>
            {t.description && (
              <p className="mt-0.5 text-sm leading-snug text-slate-600">{t.description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Fermer la notification"
            onClick={() => dismiss(t.id)}
            className="text-slate-400 transition-colors hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

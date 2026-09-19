"use client";

import { create } from "zustand";
import type { ExportJob, ExportOptions, ScannedPage } from "@/lib/export/types";
import { DEFAULT_OPTIONS, normalizeInputUrl } from "@/lib/export/types";

export type PlanId = "site-pass" | "pro" | "free";

type WizardState = {
  open: boolean;
  step: 1 | 2 | 3 | 4;
  // scan state
  url: string;
  scanning: boolean;
  scanError: string | null;
  scannedUrl: string;
  pages: ScannedPage[];
  // selection
  mode: "single" | "multi";
  selected: string[];
  // options
  options: ExportOptions;
  plan: PlanId;
  // export job
  jobId: string | null;
  job: ExportJob | null;
  exporting: boolean;
  pollTimer: ReturnType<typeof setInterval> | null;
  // actions
  openWizard: (url?: string) => void;
  closeWizard: () => void;
  reset: () => void;
  setStep: (s: 1 | 2 | 3 | 4) => void;
  setUrl: (u: string) => void;
  scan: () => Promise<void>;
  setMode: (m: "single" | "multi") => void;
  togglePage: (url: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  patchOptions: (p: Partial<ExportOptions>) => void;
  setPlan: (p: PlanId) => void;
  startExport: () => Promise<void>;
  stopPolling: () => void;
};

const initial = {
  open: false,
  step: 1 as 1 | 2 | 3 | 4,
  url: "",
  scanning: false,
  scanError: null as string | null,
  scannedUrl: "",
  pages: [] as ScannedPage[],
  mode: "multi" as "single" | "multi",
  selected: [] as string[],
  options: { ...DEFAULT_OPTIONS },
  plan: "site-pass" as PlanId,
  jobId: null as string | null,
  job: null as ExportJob | null,
  exporting: false,
  pollTimer: null as ReturnType<typeof setInterval> | null,
};

export const useExportStore = create<WizardState>((set, get) => ({
  ...initial,

  openWizard: (url) => {
    set({ open: true });
    if (url !== undefined) {
      const normalized = normalizeInputUrl(url) || url;
      set({ url: normalized });
      void get().scan();
    }
  },

  closeWizard: () => {
    get().stopPolling();
    set({ open: false, exporting: false });
  },

  reset: () => {
    get().stopPolling();
    set({ ...initial, options: { ...DEFAULT_OPTIONS } });
  },

  setStep: (s) => set({ step: s }),
  setUrl: (u) => set({ url: u }),

  scan: async () => {
    const { url } = get();
    const normalized = normalizeInputUrl(url);
    if (!normalized) {
      set({ scanError: "Veuillez saisir une URL de site valide." });
      return;
    }
    set({ scanning: true, scanError: null, pages: [], selected: [] });
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        set({ scanning: false, scanError: data.error || "Le scan a échoué." });
        return;
      }
      const pages: ScannedPage[] = data.pages;
      set({
        scanning: false,
        pages,
        scannedUrl: data.url,
        selected: pages.map((p) => p.url),
      });
    } catch {
      set({ scanning: false, scanError: "Erreur réseau pendant le scan." });
    }
  },

  setMode: (m) => {
    const { pages, mode } = get();
    if (m === mode) return;
    set({
      mode: m,
      selected: m === "multi" ? pages.map((p) => p.url) : pages.slice(0, 1).map((p) => p.url),
    });
  },

  togglePage: (u) => {
    const { selected, mode } = get();
    if (mode === "single") {
      set({ selected: [u] });
      return;
    }
    set({ selected: selected.includes(u) ? selected.filter((x) => x !== u) : [...selected, u] });
  },

  selectAll: () => set({ selected: get().pages.map((p) => p.url) }),
  deselectAll: () => set({ selected: [] }),

  patchOptions: (p) => set({ options: { ...get().options, ...p } }),
  setPlan: (p) => set({ plan: p }),

  startExport: async () => {
    const { scannedUrl, selected, options } = get();
    if (!scannedUrl || selected.length === 0) return;
    set({ exporting: true, job: null, jobId: null });
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: scannedUrl, pages: selected, options }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        set({
          exporting: false,
          job: {
            id: "",
            status: "error",
            phase: "error",
            phaseLabel: "Échec du démarrage",
            pagesTotal: selected.length,
            pagesDone: 0,
            filesCount: 0,
            bytes: 0,
            log: [],
            zipName: "",
            error: data.error || "Impossible de démarrer l'exportation.",
            startedAt: Date.now(),
          },
        });
        return;
      }
      set({ jobId: data.jobId });
      // start polling
      get().stopPolling();
      const timer = setInterval(async () => {
        const { jobId } = get();
        if (!jobId) return;
        try {
          const r = await fetch(`/api/export?jobId=${jobId}`);
          const d = await r.json();
          if (d.ok && d.job) {
            set({ job: d.job });
            if (d.job.status === "done" || d.job.status === "error") {
              get().stopPolling();
            }
          }
        } catch {
          /* transient network error: keep polling */
        }
      }, 1200);
      set({ pollTimer: timer });
    } catch {
      set({ exporting: false, scanError: null });
    }
  },

  stopPolling: () => {
    const t = get().pollTimer;
    if (t) clearInterval(t);
    set({ pollTimer: null });
  },
}));

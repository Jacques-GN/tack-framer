"use client";

import { create } from "zustand";
import type { ExportOptions, ScannedPage } from "@/lib/export/types";
import { DEFAULT_OPTIONS, normalizeInputUrl } from "@/lib/export/types";

export type PlanId = "site-pass" | "pro" | "free";

export type ExportProgress = {
  pct: number;
  label: string;
  log: string[];
};

export type ExportDone = {
  pages: number;
  files: number;
  bytes: number;
  filename: string;
};

type WizardState = {
  open: boolean;
  step: 1 | 2 | 3;
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
  // export
  exporting: boolean;
  progress: ExportProgress | null;
  done: ExportDone | null;
  exportError: string | null;
  // actions
  openWizard: (url?: string) => void;
  closeWizard: () => void;
  reset: () => void;
  setStep: (s: 1 | 2 | 3) => void;
  setUrl: (u: string) => void;
  scan: () => Promise<void>;
  setMode: (m: "single" | "multi") => void;
  togglePage: (url: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  patchOptions: (p: Partial<ExportOptions>) => void;
  setPlan: (p: PlanId) => void;
  startExport: () => Promise<void>;
};

const initial = {
  open: false,
  step: 1 as 1 | 2 | 3,
  url: "",
  scanning: false,
  scanError: null as string | null,
  scannedUrl: "",
  pages: [] as ScannedPage[],
  mode: "multi" as "single" | "multi",
  selected: [] as string[],
  options: { ...DEFAULT_OPTIONS },
  plan: "site-pass" as PlanId,
  exporting: false,
  progress: null as ExportProgress | null,
  done: null as ExportDone | null,
  exportError: null as string | null,
};

// Client-side simulated timeline shown while the synchronous export runs.
// The server does the real work; the UI advances through realistic phases
// and snaps to 100% when the ZIP response arrives.
function simulateProgress(pagesTotal: number, onTick: (p: ExportProgress) => void): () => void {
  const start = Date.now();
  const log = [`Export de ${pagesTotal} page(s) lancé…`];
  const timer = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000;
    // Asymptotic curve: fast start, approaching 95% but never reaching it
    const pct = Math.min(95, 100 * (1 - Math.exp(-elapsed / 14)));
    const label =
      pct < 30
        ? `Téléchargement des pages… (${Math.min(pagesTotal, Math.round((pct / 95) * pagesTotal * 2.2))}/${pagesTotal})`
        : pct < 75
          ? `Téléchargement des actifs… ${Math.round(pct * 3.4)} fichiers`
          : pct < 90
            ? "Réécriture du HTML et des liens…"
            : "Création de l'archive ZIP…";
    if (pct > 30 && log.length === 1) log.push("Pages récupérées — collecte des actifs…");
    if (pct > 75 && log.length === 2) log.push("Réécriture du HTML (liens internes + actifs locaux)…");
    if (pct > 90 && log.length === 3) log.push("Création de l'archive ZIP…");
    onTick({ pct, label, log: [...log] });
  }, 500);
  return () => clearInterval(timer);
}

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
    set({ open: false, exporting: false, progress: null });
  },

  reset: () => {
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
    set({
      exporting: true,
      done: null,
      exportError: null,
      progress: { pct: 2, label: "Préparation de l'exportation…", log: ["Initialisation…"] },
    });

    const stopSimulation = simulateProgress(selected.length, (p) => {
      if (get().exporting) set({ progress: p });
    });

    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: scannedUrl, pages: selected, options }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        stopSimulation();
        set({
          exporting: false,
          progress: null,
          exportError:
            (data && data.error) ||
            "L'exportation a échoué. Le site est peut-être protégé — réessayez.",
        });
        return;
      }

      const blob = await res.blob();
      stopSimulation();

      const files = Number(res.headers.get("x-export-files") || 0);
      const bytes = Number(res.headers.get("x-export-bytes") || blob.size);
      const pagesCount = Number(res.headers.get("x-export-pages") || selected.length);
      const filename =
        res.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1] ||
        "export.zip";

      // Auto-download
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);

      set({
        exporting: false,
        progress: { pct: 100, label: "Exportation terminée", log: [] },
        done: { pages: pagesCount, files, bytes, filename },
      });
    } catch {
      stopSimulation();
      set({
        exporting: false,
        progress: null,
        exportError: "Erreur réseau pendant l'exportation. Réessayez.",
      });
    }
  },
}));

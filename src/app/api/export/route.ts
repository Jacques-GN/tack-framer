import { NextRequest, NextResponse } from "next/server";
import { createJob, getJob, updateJob } from "@/lib/export/jobs";
import { runExportJob } from "@/lib/export/exporter";
import {
  DEFAULT_OPTIONS,
  normalizeInputUrl,
  type ExportOptions,
  type ExportParams,
} from "@/lib/export/types";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300;

/** GET /api/export?jobId=... — poll job status */
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ ok: false, error: "jobId manquant" }, { status: 400 });
  }
  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ ok: false, error: "Tâche introuvable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, job });
}

/** POST /api/export — start an export job (runs in background) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = normalizeInputUrl(String(body?.url || ""));
    const pages: string[] = Array.isArray(body?.pages)
      ? body.pages.map((p: unknown) => String(p)).filter((p: string) => p.startsWith("http"))
      : [];

    if (!url || pages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "URL et sélection de pages requises." },
        { status: 400 }
      );
    }

    // Merge + validate options
    const raw = (body?.options || {}) as Partial<ExportOptions>;
    const options: ExportOptions = {
      ...DEFAULT_OPTIONS,
      ...raw,
      forms: (["nocodeexport", "manual", "custom", "formspree", "netlify"] as const).includes(raw.forms)
        ? raw.forms!
        : "manual",
      delivery: raw.delivery === "github" || raw.delivery === "netlify" ? raw.delivery : "zip",
      formsEndpoint: typeof raw.formsEndpoint === "string" ? raw.formsEndpoint.slice(0, 500) : "",
    };

    const jobId = randomUUID();
    const zipName = `export-${jobId.slice(0, 6)}.zip`;
    createJob(jobId, pages.length, zipName);

    const params: ExportParams = { url, pages, options };

    // Fire-and-forget: the dev server process stays alive, the client polls.
    void runExportJob(jobId, params).catch(() => {
      updateJob(jobId, {
        status: "error",
        phase: "error",
        error: "Erreur interne pendant l'exportation.",
        finishedAt: Date.now(),
      });
    });

    return NextResponse.json({ ok: true, jobId });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur inattendue." },
      { status: 500 }
    );
  }
}

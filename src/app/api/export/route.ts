import { NextRequest, NextResponse } from "next/server";
import { runExport } from "@/lib/export/exporter";
import {
  DEFAULT_OPTIONS,
  normalizeInputUrl,
  type ExportOptions,
} from "@/lib/export/types";

export const runtime = "nodejs";
export const maxDuration = 300;

/** POST /api/export — runs the export synchronously and streams the ZIP back. */
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
    if (pages.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Maximum 100 pages par exportation." },
        { status: 400 }
      );
    }

    // Merge + validate options
    const raw = (body?.options || {}) as Partial<ExportOptions>;
    const options: ExportOptions = {
      ...DEFAULT_OPTIONS,
      ...raw,
      forms: (["snapsite", "manual", "custom", "formspree", "netlify"] as const).includes(raw.forms as never)
        ? (raw.forms as ExportOptions["forms"])
        : "manual",
      delivery: raw.delivery === "github" || raw.delivery === "netlify" ? raw.delivery : "zip",
      formsEndpoint: typeof raw.formsEndpoint === "string" ? raw.formsEndpoint.slice(0, 500) : "",
    };

    const result = await runExport({ url, pages, options });

    if (!result.ok || !result.zip) {
      return NextResponse.json(
        { ok: false, error: result.error || "Échec de l'exportation." },
        { status: 422 }
      );
    }

    return new NextResponse(new Uint8Array(result.zip), {
      status: 200,
      headers: {
        "content-type": "application/zip",
        "content-disposition": `attachment; filename="${result.zipName}"`,
        "content-length": String(result.zip.length),
        "cache-control": "no-store",
        "x-export-files": String(result.filesCount),
        "x-export-bytes": String(result.bytes),
        "x-export-pages": String(result.pagesCount),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur inattendue." },
      { status: 500 }
    );
  }
}

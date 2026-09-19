import { NextRequest, NextResponse } from "next/server";
import { scanSite } from "@/lib/export/crawler";
import { normalizeInputUrl } from "@/lib/export/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = normalizeInputUrl(String(body?.url || ""));
    if (!url) {
      return NextResponse.json(
        { ok: false, error: "Veuillez saisir une URL de site valide." },
        { status: 400 }
      );
    }
    const result = await scanSite(url, { maxPages: 100 });
    if (!result.ok || result.pages.length === 0) {
      return NextResponse.json(
        { ok: false, error: result.error || "Aucune page trouvée sur ce site." },
        { status: 422 }
      );
    }
    return NextResponse.json({
      ok: true,
      url,
      host: result.host,
      pages: result.pages,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur inattendue du scan." },
      { status: 500 }
    );
  }
}

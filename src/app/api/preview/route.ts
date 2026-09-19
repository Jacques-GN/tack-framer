import { NextRequest, NextResponse } from "next/server";
import { normalizeInputUrl } from "@/lib/export/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

/**
 * GET /api/preview?url=... — proxies the original page so it can be displayed
 * inside the step-3 iframe without X-Frame-Options issues.
 * We inject a <base> tag so all relative sub-resources resolve to the origin.
 */
export async function GET(req: NextRequest) {
  const url = normalizeInputUrl(req.nextUrl.searchParams.get("url") || "");
  if (!url) {
    return new NextResponse("URL manquante", { status: 400 });
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    let html = await res.text();

    // Inject <base> so relative assets/links load from the original site
    html = html.replace(/<base\b[^>]*>/gi, "");
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${url}">`);
    } else {
      html = `<base href="${url}">` + html;
    }
    // Strip CSP that would block our injected base
    html = html.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

    return new NextResponse(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        // no X-Frame-Options: this response is meant to be framed
      },
    });
  } catch {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;color:#64748b">
       <h2 style="color:#0f172a">Aperçu indisponible</h2>
       <p>Impossible de charger cette page pour l'aperçu intégré. Vous pouvez l'ouvrir dans un nouvel onglet.</p>
       </body></html>`,
      { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  } finally {
    clearTimeout(t);
  }
}

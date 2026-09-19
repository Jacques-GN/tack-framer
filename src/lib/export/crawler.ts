import type { ScannedPage } from "./types";
import { pagePathOf } from "./types";

// ─── Site scanner: sitemap.xml + link crawl + /404 probe ─────────────────────

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function fetchText(url: string, timeoutMs = 15000): Promise<{ status: number; body: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    const body = await res.text();
    return { status: res.status, body };
  } finally {
    clearTimeout(t);
  }
}

function extractTitle(html: string): string {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (og?.[1]) return decodeEntities(og[1]).trim();
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t?.[1]) return decodeEntities(t[1]).replace(/\s+/g, " ").trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1?.[1]) return decodeEntities(h1[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
  return "";
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractInternalLinks(html: string, origin: string): string[] {
  const urls = new Set<string>();
  const re = /href\s*=\s*["']([^"'#]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = decodeEntities(m[1]).trim();
    if (!raw || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) continue;
    try {
      const u = new URL(raw, origin);
      if (u.origin !== origin) continue;
      if (u.pathname.match(/\.(xml|txt|json|pdf|zip|webmanifest|ico)$/i)) continue;
      u.hash = "";
      u.search = "";
      urls.add(u.toString().replace(/\/$/, u.pathname === "/" ? "/" : ""));
    } catch {
      /* ignore */
    }
  }
  return [...urls];
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        out[idx] = await fn(items[idx]);
      } catch {
        out[idx] = undefined as unknown as R;
      }
    }
  });
  await Promise.all(workers);
  return out;
}

export type ScanOptions = { maxPages?: number };

export async function scanSite(inputUrl: string, opts: ScanOptions = {}): Promise<{
  ok: boolean;
  host: string;
  pages: ScannedPage[];
  error?: string;
}> {
  const maxPages = opts.maxPages ?? 100;
  let base: URL;
  try {
    base = new URL(inputUrl);
  } catch {
    return { ok: false, host: "", pages: [], error: "URL invalide" };
  }
  const origin = base.origin;
  const host = base.hostname;

  // 1) Sitemap first — Framer sites auto-publish /sitemap.xml
  const discovered = new Map<string, string>(); // url -> title
  try {
    const sm = await fetchText(`${origin}/sitemap.xml`, 12000);
    if (sm.status === 200 && sm.body.includes("<")) {
      const locs = [...sm.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) =>
        decodeEntities(m[1]).trim()
      );
      for (const loc of locs) {
        try {
          const u = new URL(loc);
          if (u.origin !== origin) continue;
          u.hash = "";
          u.search = "";
          const norm = u.toString().replace(/\/$/, u.pathname === "/" ? "/" : "");
          if (!discovered.has(norm) && discovered.size < maxPages) discovered.set(norm, "");
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* sitemap optional */
  }

  // 2) Crawl homepage links (catches pages missing from the sitemap)
  try {
    const home = await fetchText(base.toString(), 15000);
    if (home.body && home.body.length > 200) {
      const links = extractInternalLinks(home.body, origin).slice(0, 120);
      for (const l of links) {
        if (!discovered.has(l) && discovered.size < maxPages) discovered.set(l, "");
      }
      if (!discovered.has(base.toString().replace(/\/$/, base.pathname === "/" ? "/" : ""))) {
        discovered.set(base.toString(), "");
      }
    } else {
      return { ok: false, host, pages: [], error: "Impossible de charger le site. Vérifiez l'URL — le site doit être publié." };
    }
  } catch {
    return { ok: false, host, pages: [], error: "Site injoignable (délai dépassé). Vérifiez l'URL et réessayez." };
  }

  // 3) Probe /404 — Framer publishes it but never lists it in the sitemap
  try {
    const p404 = await fetchText(`${origin}/404`, 10000);
    if (p404.body && p404.body.length > 500 && /<html|<body/i.test(p404.body)) {
      const norm = `${origin}/404`;
      if (!discovered.has(norm) && discovered.size < maxPages) discovered.set(norm, "");
    }
  } catch {
    /* optional */
  }

  // 4) Fetch titles (concurrency 8)
  const entries = [...discovered.keys()].slice(0, maxPages);
  const titles = await mapLimit(entries, 8, async (url) => {
    try {
      const r = await fetchText(url, 12000);
      if (r.body && r.body.length > 100) return extractTitle(r.body);
      return "";
    } catch {
      return "";
    }
  });

  const pages: ScannedPage[] = entries.map((url, i) => ({
    url,
    path: pagePathOf(url),
    title: titles[i] || "",
  }));

  // Root first, then alphabetical
  pages.sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    if (a.path === "/404") return -1;
    if (b.path === "/404") return 1;
    return a.path.localeCompare(b.path);
  });

  return { ok: true, host, pages };
}

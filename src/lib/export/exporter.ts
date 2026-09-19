import JSZip from "jszip";
import {
  pagePathOf,
  pageFilePath,
  relPrefixFor,
  type ExportParams,
} from "./types";
import {
  extractHtmlAssets,
  extractCssAssets,
  classifyAsset,
  extFromUrl,
  rewriteCss,
  rewriteHtml,
  minifyHtml,
  auditPage,
  buildAuditHtml,
} from "./html";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// Serverless-friendly limits (runs fully in memory, no disk writes)
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per asset
const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB per export
const MAX_ASSETS = 1200;

export type ExportResult = {
  ok: boolean;
  zip?: Buffer;
  zipName: string;
  filesCount: number;
  bytes: number;
  pagesCount: number;
  log: string[];
  error?: string;
};

async function fetchBinary(url: string, timeoutMs = 20000): Promise<{ ok: boolean; buf?: Buffer; type?: string; status?: number }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "*/*" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, status: res.status };
    const ab = await res.arrayBuffer();
    return { ok: true, buf: Buffer.from(ab), type: res.headers.get("content-type") || "" };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(t);
  }
}

function hashName(url: string, salt: number): string {
  let h = 5381;
  const s = url + "|" + salt;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36).padStart(7, "0");
}

function safeFolder(host: string): string {
  return host.replace(/[^a-zA-Z0-9.-]+/g, "-").slice(0, 60);
}

const FOLDER_BY_KIND: Record<string, string> = {
  images: "assets/images",
  fonts: "assets/fonts",
  css: "assets/css",
  js: "assets/js",
  other: "assets/other",
};

/** Runs a full export synchronously and returns the ZIP buffer (no disk, no job state — Vercel-ready). */
export async function runExport(params: ExportParams): Promise<ExportResult> {
  const { url: siteUrl, pages, options } = params;
  const files = new Map<string, Buffer>(); // localPath -> content
  const assetMap = new Map<string, string>(); // absolute URL -> localPath
  const pageMap = new Map<string, string>(); // absolute page URL -> localPath
  const log: string[] = [];
  let totalBytes = 0;

  const zipName = `${safeFolder(new URL(siteUrl).hostname)}-${new Date().toISOString().slice(0, 10)}.zip`;

  try {
    // ── Map every selected page to its local file path ──
    for (const p of pages) {
      pageMap.set(p, pageFilePath(pagePathOf(p)));
    }

    // ── Phase 1: download pages & collect assets ──
    log.push(`Export de ${pages.length} page(s) — ${siteUrl}`);

    const pageHtmls = new Map<string, string>();
    for (let i = 0; i < pages.length; i++) {
      const pageUrl = pages[i];
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      try {
        const res = await fetch(pageUrl, {
          headers: { "user-agent": UA, accept: "text/html" },
          signal: ctrl.signal,
          redirect: "follow",
        });
        const html = await res.text();
        pageHtmls.set(pageUrl, html);
        log.push(`Page récupérée : ${pagePathOf(pageUrl)}`);
      } catch {
        log.push(`⚠ Échec de récupération : ${pagePathOf(pageUrl)} — ignorée`);
      } finally {
        clearTimeout(t);
      }
    }

    if (pageHtmls.size === 0) {
      throw new Error("Aucune page n'a pu être téléchargée. Le site est peut-être hors ligne ou protégé.");
    }

    // ── Phase 2: discover + download assets ──
    log.push("Collecte des actifs (images, polices, CSS, JS)…");

    const pending = new Set<string>();
    for (const [, html] of pageHtmls) {
      for (const u of extractHtmlAssets(html, siteUrl)) {
        const kind = classifyAsset(u);
        if (kind === "css" && !options.css) continue;
        if (kind === "js" && !options.js) continue;
        if (kind === "images" && !options.images) continue;
        if (kind === "fonts" && !options.fonts) continue;
        pending.add(u);
      }
    }

    const downloadedCss = new Map<string, string>(); // cssUrl -> css text
    const queue = [...pending].slice(0, MAX_ASSETS);
    const seen = new Set<string>(queue);
    let processed = 0;

    async function downloadAsset(url: string): Promise<string | null> {
      if (assetMap.has(url)) return assetMap.get(url)!;
      if (totalBytes > MAX_TOTAL_BYTES) return null;

      let res = await fetchBinary(url);
      if (!res.ok) {
        // one retry
        res = await fetchBinary(url);
      }
      if (!res.ok || !res.buf || res.buf.length > MAX_FILE_BYTES) return null;

      const kind = classifyAsset(url);
      let ext = extFromUrl(url, "bin");
      if (!ext || ext === "bin") {
        const ct = res.type || "";
        if (ct.includes("png")) ext = "png";
        else if (ct.includes("jpeg")) ext = "jpg";
        else if (ct.includes("webp")) ext = "webp";
        else if (ct.includes("svg")) ext = "svg";
        else if (ct.includes("woff2")) ext = "woff2";
        else if (ct.includes("woff")) ext = "woff";
        else if (ct.includes("css")) ext = "css";
        else if (ct.includes("javascript")) ext = "js";
      }
      const localPath = `${FOLDER_BY_KIND[kind]}/${hashName(url, assetMap.size)}.${ext}`;
      assetMap.set(url, localPath);
      files.set(localPath, res.buf);
      totalBytes += res.buf.length;

      // CSS: parse for nested assets (fonts, images) and queue them
      if (ext === "css") {
        let cssText = res.buf.toString("utf8");
        const nested = extractCssAssets(cssText, url);
        for (const n of nested) {
          const nk = classifyAsset(n);
          if (nk === "images" && !options.images) continue;
          if (nk === "fonts" && !options.fonts) continue;
          if (!seen.has(n) && seen.size < MAX_ASSETS * 2) {
            seen.add(n);
            queue.push(n);
          }
        }
        downloadedCss.set(url, cssText);
      }
      return localPath;
    }

    // Process the queue with concurrency 6 (handles nested CSS refs too)
    let qHead = 0;
    async function worker() {
      while (qHead < queue.length) {
        const url = queue[qHead++];
        processed++;
        try {
          await downloadAsset(url);
        } catch {
          /* skip broken asset */
        }
        if (processed % 25 === 0) {
          log.push(`Actifs téléchargés : ${files.size} fichiers…`);
        }
        if (totalBytes > MAX_TOTAL_BYTES) {
          log.push("⚠ Limite de taille atteinte — certains actifs distants resteront liés au site d'origine.");
          break;
        }
      }
    }
    await Promise.all(Array.from({ length: 6 }, worker));

    log.push(`${files.size} actifs téléchargés (${(totalBytes / 1024).toFixed(0)} Ko)`);

    // ── Rewrite CSS text now that all nested assets are mapped ──
    for (const [cssUrl, cssText] of downloadedCss) {
      const localPath = assetMap.get(cssUrl);
      if (!localPath) continue;
      const mapping = new Map<string, string>();
      for (const u of extractCssAssets(cssText, cssUrl)) {
        const lp = assetMap.get(u);
        if (lp) mapping.set(u, lp);
      }
      files.set(localPath, Buffer.from(rewriteCss(cssText, mapping), "utf8"));
    }

    // ── Phase 3: rewrite & store pages ──
    log.push("Réécriture du HTML (liens internes + actifs locaux)…");

    const audits: ReturnType<typeof auditPage>[] = [];
    const origin = new URL(siteUrl).origin;
    const formsPathPrefix = `${origin}/__forms__`;

    for (const [pageUrl, html] of pageHtmls) {
      const pagePath = pagePathOf(pageUrl);
      const relPrefix = relPrefixFor(pagePath);
      const rewritten = rewriteHtml(html, {
        pagePath,
        assetMap,
        pageMap,
        relPrefix,
        options,
        forms: { mode: options.forms, endpoint: options.formsEndpoint, formsPathPrefix },
      });
      const finalHtml = options.minifyHtml ? minifyHtml(rewritten) : rewritten;
      const localFile = pageMap.get(pageUrl) || pageFilePath(pagePath);
      files.set(localFile, Buffer.from(finalHtml, "utf8"));
      if (options.seoReport) audits.push(auditPage(finalHtml, pagePath));
    }

    // ── sitemap.xml + robots.txt (multi-page) ──
    if (pages.length > 1) {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
        .map((p) => `<url><loc>${p}</loc></url>`)
        .join("\n")}\n</urlset>\n`;
      files.set("sitemap.xml", Buffer.from(sitemap, "utf8"));
      files.set(
        "robots.txt",
        Buffer.from(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, "utf8")
      );
      log.push("sitemap.xml et robots.txt générés");
    }

    // ── SEO audit report ──
    if (options.seoReport && audits.length) {
      files.set("audit-report.html", Buffer.from(buildAuditHtml(audits, siteUrl), "utf8"));
      log.push(`Rapport d'audit SEO généré (${audits.length} pages)`);
    }

    // ── Manifest ──
    const manifest = {
      source: siteUrl,
      exportedAt: new Date().toISOString(),
      pages: pages.length,
      files: files.size,
      bytes: totalBytes,
      options,
    };
    files.set("export-summary.json", Buffer.from(JSON.stringify(manifest, null, 2), "utf8"));

    // ── Phase 4: build ZIP (in memory) ──
    log.push(`Création de l'archive ZIP… (${files.size} fichiers)`);
    const zip = new JSZip();
    for (const [p, buf] of files) zip.file(p, buf);
    const zipBuf = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    log.push(`Archive prête : ${zipName} (${(zipBuf.length / 1024).toFixed(0)} Ko)`);

    return {
      ok: true,
      zip: zipBuf,
      zipName,
      filesCount: files.size,
      bytes: totalBytes,
      pagesCount: pages.length,
      log,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.push(`✖ Erreur : ${message}`);
    return {
      ok: false,
      zipName,
      filesCount: files.size,
      bytes: totalBytes,
      pagesCount: pages.length,
      log,
      error: message,
    };
  }
}

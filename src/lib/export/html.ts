// ─── HTML/CSS processing: asset discovery, URL rewriting, minify, SEO audit ──

export function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

const ASSET_EXT =
  /\.(png|jpe?g|gif|webp|avif|svg|ico|bmp|css|js|mjs|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|json|pdf|vtt)(\?|#|$)/i;

export type AssetKind = "images" | "fonts" | "css" | "js" | "other";

export function classifyAsset(url: string): AssetKind {
  const clean = url.split("?")[0].split("#")[0];
  if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(clean)) return "fonts";
  if (/\.(css)(\?|$)/i.test(clean)) return "css";
  if (/\.(js|mjs)(\?|$)/i.test(clean)) return "js";
  if (/\.(png|jpe?g|gif|webp|avif|svg|ico|bmp|mp4|webm|mp3|wav|pdf)(\?|$)/i.test(clean)) return "images";
  return "other";
}

export function extFromUrl(url: string, fallback: string): string {
  const m = url.split("?")[0].match(/\.([a-zA-Z0-9]{1,8})$/);
  return m ? m[1].toLowerCase() : fallback;
}

/** Extract every asset-ish URL referenced by an HTML document. */
export function extractHtmlAssets(html: string, pageUrl: string): Set<string> {
  const urls = new Set<string>();
  const push = (raw: string) => {
    if (!raw) return;
    const u = decodeEntities(raw).trim();
    if (!u || /^(data:|blob:|javascript:|mailto:|tel:|#|about:)/i.test(u)) return;
    if (!/^https?:\/\//i.test(u) && !u.startsWith("/") && !u.startsWith(".")) return;
    try {
      const abs = new URL(u, pageUrl).toString();
      const clean = abs.split("#")[0];
      if (ASSET_EXT.test(clean) || /framerusercontent|assets|cdn|static|media|images/i.test(clean)) {
        urls.add(clean);
      }
    } catch {
      /* ignore */
    }
  };

  // link href (stylesheets, preloads, icons)
  const linkRe = /<link\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html))) {
    const tag = m[0];
    const href = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    const rel = (tag.match(/rel\s*=\s*["']([^"']+)["']/i)?.[1] || "").toLowerCase();
    const as = (tag.match(/as\s*=\s*["']([^"']+)["']/i)?.[1] || "").toLowerCase();
    if (rel.includes("stylesheet") || rel.includes("preload") || rel.includes("icon") || rel.includes("apple") || as === "font" || as === "image" || as === "style" || as === "script") {
      push(href);
    }
  }

  // script src
  const scriptRe = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = scriptRe.exec(html))) push(m[1]);

  // img src / srcset
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    push(tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || "");
    const srcset = tag.match(/\bsrcset\s*=\s*["']([^"']+)["']/i)?.[1];
    if (srcset) srcset.split(",").forEach((part) => push(part.trim().split(/\s+/)[0]));
  }

  // source src / srcset
  const sourceRe = /<source\b[^>]*>/gi;
  while ((m = sourceRe.exec(html))) {
    const tag = m[0];
    push(tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || "");
    const srcset = tag.match(/\bsrcset\s*=\s*["']([^"']+)["']/i)?.[1];
    if (srcset) srcset.split(",").forEach((part) => push(part.trim().split(/\s+/)[0]));
  }

  // video/audio/poster
  const mediaRe = /<(video|audio|object|embed)\b[^>]*>/gi;
  while ((m = mediaRe.exec(html))) {
    const tag = m[0];
    push(tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || "");
    push(tag.match(/\bposter\s*=\s*["']([^"']+)["']/i)?.[1] || "");
  }

  // inline style url(...)
  const styleRe = /style\s*=\s*["']([^"']*url\([^"']*)["']/gi;
  while ((m = styleRe.exec(html))) {
    const urlsInStyle = m[1].match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi) || [];
    urlsInStyle.forEach((u) => push(u.replace(/^url\(\s*['"]?/, "").replace(/['"]?\s*\)$/, "")));
  }

  // JSON blobs inside script tags (Framer uses JSON props with asset URLs)
  const jsonRe = /<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = jsonRe.exec(html))) {
    const found = m[1].match(/https?:\/\/[^"'\\\s)]+\.(?:png|jpe?g|webp|avif|gif|svg|mp4|webm|woff2?|ttf|otf)/gi) || [];
    found.forEach((u) => urls.add(u.replace(/\\\//g, "/")));
  }
  // framerusercontent URLs anywhere in inline scripts
  const fuRe = /https?:\\?\/\\?\/[^"'\\\s)]*framerusercontent\.com[^"'\\\s)\\]*/gi;
  while ((m = fuRe.exec(html))) {
    const u = m[0].replace(/\\\//g, "/");
    if (ASSET_EXT.test(u)) urls.add(u);
  }

  return urls;
}

/** Extract asset URLs referenced inside a CSS file. */
export function extractCssAssets(css: string, cssUrl: string): Set<string> {
  const urls = new Set<string>();
  const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    const raw = m[1].trim();
    if (!raw || /^data:/i.test(raw)) continue;
    try {
      urls.add(new URL(raw, cssUrl).toString().split("#")[0]);
    } catch {
      /* ignore */
    }
  }
  return urls;
}

/**
 * Rewrite a downloaded CSS file: replace absolute asset URLs with local
 * relative paths (css lives at assets/css/, so prefix = ../).
 */
export function rewriteCss(css: string, mapping: Map<string, string>): string {
  let out = css;
  for (const [abs, local] of mapping) {
    if (!css.includes(abs) && !css.includes(abs.replace(/&/g, "\\&"))) continue;
    const rel = "../" + local;
    out = out.split(abs).join(rel);
    try {
      const absEsc = abs.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
      out = out.replace(new RegExp(absEsc, "g"), rel);
    } catch {
      /* ignore */
    }
  }
  return out;
}

export type RewriteContext = {
  pagePath: string; // e.g. "/blog/post"
  assetMap: Map<string, string>; // absolute URL -> local path ("assets/images/x.png")
  pageMap: Map<string, string>; // absolute page URL -> local page file path
  relPrefix: string; // e.g. "../.."
  options: { images: boolean; fonts: boolean; css: boolean; js: boolean };
  forms: { mode: string; endpoint: string; formsPathPrefix: string };
};

/**
 * Rewrite an exported HTML page so it works offline:
 *  - assets -> relative local paths
 *  - internal page links -> relative folder links
 *  - forms -> configured handling
 */
export function rewriteHtml(html: string, ctx: RewriteContext): string {
  let out = html;

  // 1) Replace every known asset URL with its local relative path.
  // relPrefix is "" (root page) or "../"*, local is "assets/..."; concatenate
  // directly to get "assets/…" or "../assets/…".
  for (const [abs, local] of ctx.assetMap) {
    const rel = ctx.relPrefix + local;
    if (out.includes(abs)) out = out.split(abs).join(rel);
    // entity-escaped variant (&amp; in query strings)
    const esc = abs.replace(/&/g, "&amp;");
    if (esc !== abs && out.includes(esc)) out = out.split(esc).join(rel);
    // JSON-escaped variant (\/ in inline scripts)
    const jsonEsc = abs.replace(/\//g, "\\/");
    if (out.includes(jsonEsc)) out = out.split(jsonEsc).join(rel.replace(/\//g, "\\/"));
  }

  // 2) Rewrite internal page links (same site) to local folders.
  for (const [absUrl, localFile] of ctx.pageMap) {
    const folderRel =
      localFile === "index.html" ? "./" : ctx.relPrefix + localFile.replace(/\/index\.html$/, "/");
    // Replace href occurrences (both quoted forms)
    const variants = [absUrl, absUrl.replace(/&/g, "&amp;"), absUrl.replace(/\/$/, "")];
    for (const v of variants) {
      if (!v) continue;
      out = out
        .split(`href="${v}"`).join(`href="${folderRel}"`)
        .split(`href='${v}'`).join(`href='${folderRel}'`);
    }
  }

  // 3) Forms handling
  if (ctx.forms.mode === "snapsite") {
    out = out.replace(/<form\b([^>]*)>/gi, (full, attrs: string) => {
      const cleaned = attrs
        .replace(/\s(action|data-netlify|data-formspree)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\smethod\s*=\s*("[^"]*"|'[^']*')/gi, "");
      return `<form${cleaned} action="${ctx.forms.formsPathPrefix}/submit" method="POST">`;
    });
  } else if (ctx.forms.mode === "custom" || ctx.forms.mode === "formspree") {
    if (ctx.forms.endpoint) {
      out = out.replace(/<form\b([^>]*)>/gi, (full, attrs: string) => {
        const cleaned = attrs
          .replace(/\saction\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
          .replace(/\sdata-netlify\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
        return `<form${cleaned} action="${ctx.forms.endpoint}" method="POST">`;
      });
    }
  } else if (ctx.forms.mode === "netlify") {
    out = out.replace(/<form\b([^>]*)>/gi, (full, attrs: string) => {
      if (/data-netlify/i.test(attrs)) return `<form${attrs}>`;
      return `<form${attrs} data-netlify="true">`;
    });
  }
  // "manual": keep original attributes untouched

  // 4) Remove frame-busting / CSP meta that could break offline viewing
  out = out.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
  out = out.replace(/<base\b[^>]*>/gi, "");

  return out;
}

export function minifyHtml(html: string): string {
  return html
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
    .replace(/\n\s+/g, "\n")
    .replace(/>\s*\n\s*</g, "><")
    .replace(/}\s*\n\s*/g, "}")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ─── SEO audit ───────────────────────────────────────────────────────────────

export type PageAudit = {
  path: string;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  h1: string[];
  headings: { h1: number; h2: number; h3: number; h4: number };
  imagesTotal: number;
  imagesMissingAlt: number;
  linksInternal: number;
  linksExternal: number;
  issues: string[];
};

export function auditPage(html: string, path: string): PageAudit {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
  const descMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const description = decodeEntities(descMatch?.[1] || "").trim();

  const headings = { h1: 0, h2: 0, h3: 0, h4: 0 };
  const h1texts: string[] = [];
  const hRe = /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = hRe.exec(html))) {
    const level = Number(m[1]);
    const key = ("h" + level) as keyof typeof headings;
    headings[key]++;
    if (level === 1) {
      const txt = decodeEntities(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
      if (txt) h1texts.push(txt.slice(0, 120));
    }
  }

  let imagesTotal = 0;
  let imagesMissingAlt = 0;
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(html))) {
    imagesTotal++;
    if (!/\balt\s*=\s*["'][^"']+["']/i.test(m[0])) imagesMissingAlt++;
  }

  let linksInternal = 0;
  let linksExternal = 0;
  const aRe = /<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi;
  while ((m = aRe.exec(html))) {
    if (/^https?:\/\//i.test(m[1])) linksExternal++;
    else linksInternal++;
  }

  const issues: string[] = [];
  if (!title) issues.push("Titre manquant");
  else if (title.length < 15) issues.push(`Titre trop court (${title.length} caractères, 15+ recommandé)`);
  else if (title.length > 65) issues.push(`Titre trop long (${title.length} caractères, ≤65 recommandé)`);
  if (!description) issues.push("Meta description manquante");
  else if (description.length < 50) issues.push(`Meta description courte (${description.length} caractères, 50+ recommandé)`);
  else if (description.length > 160) issues.push(`Meta description longue (${description.length} caractères, ≤160 recommandé)`);
  if (headings.h1 === 0) issues.push("Aucun H1 détecté");
  else if (headings.h1 > 1) issues.push(`${headings.h1} H1 détectés (1 recommandé)`);
  if (imagesMissingAlt > 0) issues.push(`${imagesMissingAlt} image(s) sans attribut alt`);

  return {
    path,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    h1Count: headings.h1,
    h1: h1texts,
    headings,
    imagesTotal,
    imagesMissingAlt,
    linksInternal,
    linksExternal,
    issues,
  };
}

export function buildAuditHtml(audits: PageAudit[], siteUrl: string): string {
  const rows = audits
    .map((a) => {
      const issues = a.issues.length
        ? a.issues.map((i) => `<li>${i}</li>`).join("")
        : `<li class="ok">Aucun problème détecté</li>`;
      return `<tr>
  <td><code>${a.path}</code></td>
  <td>${a.title ? `${a.title}<br><small>${a.titleLength} car.</small>` : "<em>—</em>"}</td>
  <td>${a.description ? `${a.description.slice(0, 120)}${a.description.length > 120 ? "…" : ""}<br><small>${a.descriptionLength} car.</small>` : "<em>—</em>"}</td>
  <td class="center">${a.headings.h1} / ${a.headings.h2} / ${a.headings.h3}</td>
  <td class="center">${a.imagesMissingAlt}/${a.imagesTotal}</td>
  <td><ul>${issues}</ul></td>
</tr>`;
    })
    .join("\n");

  const totalIssues = audits.reduce((n, a) => n + a.issues.length, 0);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport d'audit SEO — ${siteUrl}</title>
<style>
  body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 40px auto; max-width: 1100px; color: #0f172a; padding: 0 20px; }
  h1 { font-size: 28px; } .meta { color: #64748b; margin-bottom: 28px; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
  th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; vertical-align: top; }
  th { background: #f8fafc; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: #475569; }
  ul { margin: 0; padding-left: 16px; } li { margin: 2px 0; }
  li.ok { color: #0d9488; } code { background: #f1f5f9; padding: 2px 5px; border-radius: 4px; font-size: 12px; }
  .center { text-align: center; } small { color: #94a3b8; }
  .summary { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; }
</style>
</head>
<body>
<h1>Rapport d'audit SEO</h1>
<p class="meta">Site : <strong>${siteUrl}</strong> · ${audits.length} pages analysées · ${totalIssues} point(s) à examiner</p>
<div class="summary"><strong>Résumé :</strong> ${audits.filter((a) => a.issues.length === 0).length} page(s) sans problème majeur. Vérifiez les titres, les méta-descriptions, la structure des en-têtes et les attributs alt des images listés ci-dessous.</div>
<table>
<thead><tr><th>Page</th><th>Titre</th><th>Meta description</th><th>H1 / H2 / H3</th><th>Images sans alt</th><th>Problèmes à corriger</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`;
}

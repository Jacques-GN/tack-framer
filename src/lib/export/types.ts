// ─── Shared types for the export pipeline ────────────────────────────────────

export type ScannedPage = {
  url: string;
  path: string;
  title: string;
};

export type ScanResult = {
  ok: boolean;
  url: string;
  host: string;
  pages: ScannedPage[];
  error?: string;
};

export type ExportOptions = {
  images: boolean;
  fonts: boolean;
  css: boolean;
  js: boolean;
  forms: "snapsite" | "manual" | "custom" | "formspree" | "netlify";
  formsEndpoint: string;
  delivery: "zip" | "github" | "netlify";
  minifyHtml: boolean;
  seoReport: boolean;
};

export type ExportParams = {
  url: string;
  pages: string[]; // absolute page URLs selected for export
  options: ExportOptions;
};

export const DEFAULT_OPTIONS: ExportOptions = {
  images: true,
  fonts: true,
  css: true,
  js: true,
  forms: "manual",
  formsEndpoint: "",
  delivery: "zip",
  minifyHtml: false,
  seoReport: true,
};

// ─── Helpers shared by client & server ───────────────────────────────────────

export function normalizeInputUrl(raw: string): string {
  let u = raw.trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
  } catch {
    return "";
  }
}

export function pagePathOf(url: string): string {
  try {
    const u = new URL(url);
    let p = decodeURIComponent(u.pathname);
    if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
    return p || "/";
  } catch {
    return "/";
  }
}

/** Convert a page path to its exported folder/file path, e.g. "/" -> "index.html",
 *  "/blog/post" -> "blog/post/index.html" */
export function pageFilePath(path: string): string {
  if (path === "/") return "index.html";
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  // Sanitize each segment for the filesystem
  const segs = clean
    .split("/")
    .map(
      (s) =>
        s
          .replace(/[^a-zA-Z0-9._-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80) || "page"
    )
    .join("/");
  return `${segs}/index.html`;
}

/** Relative prefix (e.g. "", "../", "../../") from a page file to the root. */
export function relPrefixFor(path: string): string {
  if (path === "/") return "";
  const clean = path.replace(/^\/+|\/+$/g, "");
  return "../".repeat(clean.split("/").length);
}

export const FORMS_LABELS: Record<ExportOptions["forms"], string> = {
  snapsite: "Formulaires SnapSite",
  manual: "Manuel / Brut",
  custom: "Point de terminaison personnalisé",
  formspree: "Formspree",
  netlify: "Formulaires Netlify",
};

export const DELIVERY_LABELS: Record<ExportOptions["delivery"], string> = {
  zip: "Téléchargement ZIP",
  github: "Sync with GitHub",
  netlify: "Deploy to Netlify",
};

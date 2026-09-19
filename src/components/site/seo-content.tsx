import Link from "next/link";

function TealLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="#"
      className="font-medium text-teal-600 underline decoration-teal-300 underline-offset-2 hover:text-teal-700"
    >
      {children}
    </Link>
  );
}

const verifyItems = [
  {
    term: "Selected pages:",
    desc: "compare the scan selection with the HTML files in your download. Open representative pages, including a CMS item if selected; an unlinked page may need separate handling.",
  },
  {
    term: "Nested URLs:",
    desc: "paste each important destination URL into a new tab and refresh it. Check navigation and redirects instead of relying only on the homepage.",
  },
  {
    term: "Images, fonts and scripts:",
    desc: "inspect failed network requests and source-host URLs. Free keeps assets linked; paid asset downloading can reduce dependencies, but inaccessible files, videos and embeds may remain remote.",
  },
  {
    term: "Mobile interactions:",
    desc: "compare desktop and mobile layouts. Test menus with touch and keyboard, scroll effects, links and custom components; record anything that needs adjustment.",
  },
  {
    term: "Replacement services:",
    desc: "send a test form to an endpoint you control and verify delivery. Reconnect analytics and any search, account or payment service. Published CMS content will not update automatically.",
  },
  {
    term: "Search and launch:",
    desc: "verify destination canonicals, titles, robots rules and sitemap URLs. Keep existing paths or add redirects, then check HTTPS on the final domain before retiring the original host.",
  },
];

export function SeoContent() {
  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        {/* Left sticky intro */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            How to Export Framer to HTML, CSS and JavaScript
          </h2>
          <p className="mt-5 leading-relaxed text-slate-600">
            Export a published Framer website by scanning its public URL,
            selecting the pages you need and downloading a ZIP of the rendered
            HTML, CSS and JavaScript. Review the files and their remaining
            service dependencies before moving your domain.
          </p>
        </div>

        {/* Right articles */}
        <div className="space-y-12">
          <article>
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Framer Export Code: What the ZIP Contains
            </h3>
            <p className="mt-4 leading-relaxed text-slate-600">
              This Framer export code workflow starts from the public, published
              URL rather than the private editor. NoCodeExport captures the
              rendered frontend and packages the selected pages with their{" "}
              <strong className="font-semibold text-slate-900">
                HTML, CSS, JavaScript, and metadata
              </strong>
              . Images and fonts are referenced or included according to the
              export options and plan.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              The result is portable static code you can inspect, version, edit,
              and self-host on{" "}
              <strong className="font-semibold text-slate-900">Vercel</strong>,{" "}
              <strong className="font-semibold text-slate-900">Netlify</strong>,{" "}
              <strong className="font-semibold text-slate-900">
                Cloudflare Pages
              </strong>
              ,{" "}
              <strong className="font-semibold text-slate-900">
                GitHub Pages
              </strong>
              , or your own server. It is not the original Framer project file
              or an editable set of React components; teams that need
              application architecture should choose a React or Next.js rebuild.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Framer&apos;s <TealLink>portability article</TealLink> describes
              downloading published files, while its{" "}
              <TealLink>HTML export article</TealLink> says native HTML export
              for self-hosting is unavailable. Checked September 17, 2026.
              NoCodeExport captures the public frontend; this is a separate
              workflow from an official project export.
            </p>
          </article>

          <article>
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              What Is Preserved and What Is Not
            </h3>
            <p className="mt-4 leading-relaxed text-slate-600">
              NoCodeExport captures the rendered HTML, styles, metadata and
              reachable assets. Supported menus, reveals and other browser
              interactions may continue through captured runtime files or
              recovery helpers, but each page still needs visual and functional
              testing.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              The ZIP is not the original Framer project. CMS updates, forms,
              custom code components, external embeds and advanced stateful
              behavior may still depend on Framer or another service and can
              require replacement.
            </p>
          </article>

          <article>
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Framer Export Code vs a React or Next.js Rebuild
            </h3>
            <p className="mt-4 leading-relaxed text-slate-600">
              Choose a static export when the published design is finished and
              the goal is portable files, independent hosting, a backup, or a
              fast developer handoff. Choose a React or Next.js rebuild when the
              site needs reusable components, application state, authentication,
              a database, or frequent feature development.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              The two outputs solve different problems. Review the tradeoffs in
              our <TealLink>Framer to code vs Framer to HTML comparison</TealLink>{" "}
              before treating an exported snapshot as a replacement for a
              maintained application codebase.
            </p>
          </article>

          <article>
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              How to Verify a Framer Export Before You Migrate
            </h3>
            <dl className="mt-4 space-y-4">
              {verifyItems.map((item) => (
                <div key={item.term} className="leading-relaxed text-slate-600">
                  <dt className="inline">
                    <strong className="font-semibold text-slate-900">
                      {item.term}
                    </strong>{" "}
                  </dt>
                  <dd className="inline">{item.desc}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 leading-relaxed text-slate-600">
              Use the <TealLink>Framer export walkthrough</TealLink> for page
              selection and the <TealLink>Framer-to-Netlify guide</TealLink> for
              deployment checks. Keep a working copy available for rollback.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

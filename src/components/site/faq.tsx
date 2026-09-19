"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can I export Framer to HTML for free?",
    a: "Yes. Free lets you try a single published page, with images and fonts linked to the original site. It allows up to 10 exports per month, but each domain gets only one successful Free export in total, shared across all Free accounts; that domain allowance does not reset monthly. Failed attempts do not use it. For another export of the same domain, choose a Site Pass for one successful export or Pro for recurring exports.",
  },
  {
    q: "How do I get code from Framer without a paid Pro plan?",
    a: "NoCodeExport can capture the public pages of a Framer site without access to your Framer account. Framer's editor has no HTML export button; one Framer article describes downloading the published files, while another says native HTML export for self-hosting is unavailable. Our workflow packages a rendered snapshot of the published site as HTML, CSS and JavaScript; it does not provide an official Framer project bundle or the original React components. CMS data and hosted services require separate handling.",
  },
  {
    q: "Does this preserve Framer animations?",
    a: "Supported scroll, hover, menu and transition behavior can be retained through captured runtime files or recovery helpers. Results vary by site, so test important interactions at every breakpoint; stateful code components and hosted embeds may need manual work.",
  },
  {
    q: "Can I self-host a Framer website on Vercel or Netlify?",
    a: "Yes. Export the published Framer site, unzip the HTML, CSS, JavaScript, and assets, then deploy that folder to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or a private server. Test navigation, forms, analytics, and custom domains before moving production traffic because services tied to Framer may need to be reconnected.",
  },
  {
    q: "Does it export all Framer pages or only the homepage?",
    a: "Single-page export captures the submitted page. Full-site export follows reachable same-site links up to the crawler depth and the selected plan's page limit. Unlinked, private or login-protected routes are not discovered automatically.",
  },
  {
    q: "Does the export include local images and custom fonts?",
    a: "The local-assets option downloads reachable images and fonts and rewrites their references. Large videos, third-party embeds and inaccessible files can remain remote, so inspect the ZIP before unpublishing the original site.",
  },
  {
    q: "What happens to Framer CMS content and forms after export?",
    a: "Published CMS pages can be captured as static HTML at export time, so the content remains visible but no longer updates from Framer automatically. Forms and other services that depend on Framer should be tested after export and, when necessary, connected to a new form endpoint or backend before launch.",
  },
  {
    q: "Can I update my Framer website after exporting it?",
    a: "Yes. You can edit the downloaded files, or publish your changes in Framer and create a new export to deploy. The existing download does not sync automatically. Each Site Pass covers one successful export; use another pass for a later one-off export or Pro for recurring exports within its limits. The lifetime Free allowance for a domain does not renew when you edit the site.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about the export process.
          </p>
        </div>

        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-xl border transition-colors duration-200 ${
                  isOpen
                    ? "border-teal-300 bg-white shadow-[0_8px_28px_rgba(13,148,136,0.08)]"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-bold text-slate-900 sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-slate-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

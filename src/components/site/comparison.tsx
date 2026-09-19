import { Code2, RefreshCw, Lock, ScanSearch, Check } from "lucide-react";

const rows = [
  {
    icon: Code2,
    label: "Portable HTML output",
    framer:
      "No native HTML bundle for self-hosting is offered in Framer's HTML-export documentation.",
    nocode:
      "Packages rendered HTML, CSS, and JavaScript for a standard static hosting workflow.",
  },
  {
    icon: RefreshCw,
    label: "Export workflow",
    framer: "Design, publish and manage the site using Framer's hosted platform.",
    nocode: "Starts from the live site and produces a ready-to-review export.",
  },
  {
    icon: Lock,
    label: "Ownership after launch",
    framer:
      "Platform-managed publishing, rendering and optimization services remain part of Framer hosting.",
    nocode:
      "The exported front-end files can live on your infrastructure; hosted services still need replacements.",
  },
  {
    icon: ScanSearch,
    label: "Best fit",
    framer: "Keeping the design and hosting workflow inside Framer.",
    nocode: "Moving to HTML, reducing lock-in, or handing code to another team.",
  },
];

export function Comparison() {
  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Framer vs HTML Export Tool Comparison
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
          Framer&apos;s native HTML-export article says it does not provide a
          self-hosting bundle. Its separate portability guidance describes
          retrieving published files. NoCodeExport offers a public-URL capture
          workflow; neither the rendered snapshot nor this comparison promises
          an editable Framer project.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="w-[22%] px-6 py-4 text-sm font-bold text-slate-900">
                    What you need
                  </th>
                  <th className="w-[39%] px-6 py-4 text-sm font-bold text-slate-900">
                    Framer native workflow
                  </th>
                  <th className="w-[39%] bg-teal-50/50 px-6 py-4 text-sm font-bold text-teal-800">
                    <span className="inline-flex items-center gap-1.5">
                      Recommended path
                      <Check className="size-4 text-teal-600" strokeWidth={3} />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                          <row.icon className="size-4" />
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {row.label}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm leading-relaxed text-slate-600">
                      {row.framer}
                    </td>
                    <td className="bg-teal-50/50 px-6 py-5 text-sm font-medium leading-relaxed text-slate-800">
                      {row.nocode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 bg-white px-6 py-4">
            <p className="text-sm text-slate-500">
              Framer HTML-export documentation, checked 17 September 2026:{" "}
              <a
                href="https://www.framer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
              >
                www.framer.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

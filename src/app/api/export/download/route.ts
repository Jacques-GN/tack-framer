import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/export/jobs";
import { readFile, stat } from "fs/promises";

export const runtime = "nodejs";

/** GET /api/export/download?jobId=... — stream the generated ZIP */
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ ok: false, error: "jobId manquant" }, { status: 400 });
  }
  const job = getJob(jobId);
  if (!job || job.status !== "done" || !job.zipPath) {
    return NextResponse.json(
      { ok: false, error: "Exportation non disponible" },
      { status: 404 }
    );
  }
  try {
    await stat(job.zipPath);
    const buf = await readFile(job.zipPath);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "content-type": "application/zip",
        "content-disposition": `attachment; filename="${job.zipName}"`,
        "content-length": String(buf.length),
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Fichier introuvable" }, { status: 404 });
  }
}

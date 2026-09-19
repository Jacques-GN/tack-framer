import type { ExportJob } from "./types";

// ─── In-memory job registry (survives HMR via globalThis) ────────────────────

const g = globalThis as unknown as { __nceJobs?: Map<string, ExportJob> };
if (!g.__nceJobs) g.__nceJobs = new Map();

const jobs = g.__nceJobs;

export function createJob(id: string, pagesTotal: number, zipName: string): ExportJob {
  const job: ExportJob = {
    id,
    status: "running",
    phase: "queued",
    phaseLabel: "Préparation de l'exportation…",
    pagesTotal,
    pagesDone: 0,
    filesCount: 0,
    bytes: 0,
    log: [],
    zipName,
    startedAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): ExportJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<ExportJob>): ExportJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  Object.assign(job, patch);
  return job;
}

export function pushLog(id: string, line: string) {
  const job = jobs.get(id);
  if (!job) return;
  job.log.push(line);
  // keep the log bounded
  if (job.log.length > 400) job.log.splice(0, job.log.length - 400);
}

// Purge jobs older than 24h (ZIP files have a 30-day claim in marketing; we
// keep the in-memory registry light, the ZIP itself lives on disk).
setInterval(() => {
  const cutoff = Date.now() - 24 * 3600 * 1000;
  for (const [id, job] of jobs) {
    if (job.finishedAt && job.finishedAt < cutoff) jobs.delete(id);
  }
}, 3600 * 1000).unref?.();

import { reedFetch, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  try {
    const job = await reedFetch(`/jobs/${opts.id}`, {})

    if (opts.format === "plain") {
      const salary =
        job.minimumSalary || job.maximumSalary
          ? `${job.currency || "GBP"} ${job.minimumSalary ?? "?"}-${job.maximumSalary ?? "?"}`
          : "Not disclosed"
      process.stdout.write(
        `${job.jobTitle}\n${job.employerName || "—"} · ${job.locationName || "—"}\n` +
          `Salary: ${salary}\nType: ${job.jobType || "—"}\nApply: ${job.externalUrl || job.jobUrl}\n\n${job.jobDescription || ""}\n`,
      )
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}

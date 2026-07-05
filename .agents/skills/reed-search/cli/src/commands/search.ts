import { reedFetch, mapResult, writeError, type JobResult } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  distance?: number
  permanent?: boolean
  contract?: boolean
  temp?: boolean
  fullTime?: boolean
  partTime?: boolean
  minSalary?: number
  maxSalary?: number
  graduate?: boolean
  take: number
  skip: number
  format: "json" | "table" | "plain"
}

function renderTable(results: JobResult[]): string {
  if (results.length === 0) return "No results."
  const rows = results.map((r) => {
    const title = r.jobTitle.slice(0, 40).padEnd(40)
    const employer = (r.employerName || "—").slice(0, 24).padEnd(24)
    const loc = (r.locationName || "—").slice(0, 20).padEnd(20)
    const salary =
      r.minimumSalary || r.maximumSalary
        ? `${r.currency || "GBP"} ${r.minimumSalary ?? "?"}-${r.maximumSalary ?? "?"}`
        : "—"
    return `${String(r.jobId).padEnd(9)} ${title} ${employer} ${loc} ${salary}`
  })
  const header =
    "ID".padEnd(9) + " " + "TITLE".padEnd(40) + " " + "EMPLOYER".padEnd(24) + " " + "LOCATION".padEnd(20) + " SALARY"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const data = await reedFetch("/search", {
      keywords: opts.query,
      locationName: opts.location,
      distanceFromLocation: opts.distance,
      permanent: opts.permanent,
      contract: opts.contract,
      temp: opts.temp,
      fullTime: opts.fullTime,
      partTime: opts.partTime,
      minimumSalary: opts.minSalary,
      maximumSalary: opts.maxSalary,
      graduate: opts.graduate,
      resultsToTake: opts.take,
      resultsToSkip: opts.skip,
    })

    const results: JobResult[] = (data.results || []).map(mapResult)

    if (opts.format === "table") {
      process.stdout.write(renderTable(results) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        results
          .map(
            (r) =>
              `${r.jobTitle}\n  ${r.employerName || "—"} · ${r.locationName || "—"} · ${r.date || "—"}\n  id: ${r.jobId}\n  ${r.jobUrl}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: results.length, totalResults: data.totalResults ?? null }, results },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}

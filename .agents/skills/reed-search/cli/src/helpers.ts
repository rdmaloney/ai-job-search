// Data source: Reed.co.uk's official public jobseeker API (https://www.reed.co.uk/developers/jobseeker).
// Auth: API key as the HTTP Basic Auth username, empty password. Requires REED_API_KEY env var.

export const BASE_URL = "https://www.reed.co.uk/api/1.0"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

function authHeader(): string {
  const key = process.env.REED_API_KEY
  if (!key) {
    throw new Error(
      "REED_API_KEY is not set. Get a free key at https://www.reed.co.uk/developers/jobseeker and export it.",
    )
  }
  return "Basic " + Buffer.from(`${key}:`).toString("base64")
}

export async function reedFetch(path: string, params: Record<string, string | number | boolean | undefined>): Promise<any> {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v))
  }

  const maxRetries = 4
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url.toString(), {
      headers: { Authorization: authHeader(), Accept: "application/json" },
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      await new Promise((r) => setTimeout(r, delay))
      delay = Math.min(delay * 2, 4000)
      continue
    }
    if (response.status === 401) {
      throw new Error("Reed API rejected the request (401) — check REED_API_KEY is valid.")
    }
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }
  throw new Error("Request failed after max retries")
}

export interface JobResult {
  jobId: number
  employerName: string | null
  jobTitle: string
  locationName: string | null
  minimumSalary: number | null
  maximumSalary: number | null
  currency: string | null
  date: string | null
  jobUrl: string
}

export function mapResult(r: any): JobResult {
  return {
    jobId: r.jobId,
    employerName: r.employerName ?? null,
    jobTitle: r.jobTitle,
    locationName: r.locationName ?? null,
    minimumSalary: r.minimumSalary ?? null,
    maximumSalary: r.maximumSalary ?? null,
    currency: r.currency ?? null,
    date: r.date ?? null,
    jobUrl: r.jobUrl ?? `https://www.reed.co.uk/jobs/${r.jobId}`,
  }
}

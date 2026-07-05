#!/usr/bin/env bun
// Self-contained CLI for Reed.co.uk's official public jobseeker API — the
// primary UK job board integration. Requires a free REED_API_KEY
// (https://www.reed.co.uk/developers/jobseeker). Unlike scraping-based
// integrations, this is Reed's own supported API, so there's no ToS risk.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "take" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `reed-cli — search UK jobs via Reed.co.uk's official jobseeker API

Requires REED_API_KEY env var (free key: https://www.reed.co.uk/developers/jobseeker).

USAGE
  bun run src/cli.ts search --query "<keywords>" [flags]
  bun run src/cli.ts detail <jobId> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords (job title, skill, or role).
  --location, -l <text>   UK place name, e.g. "Manchester", "London", "Remote".
  --distance <miles>      Radius from location. Default 10.
  --permanent / --contract / --temp   Employment type flags.
  --fullTime / --partTime             Schedule flags.
  --minSalary / --maxSalary <n>       Salary range (GBP).
  --graduate              Entry-level roles only.
  --take, -n <n>          Results per page (max 100). Default 20.
  --skip <n>              Pagination offset. Default 0.
  --format <fmt>          json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search -q "assistant manager" -l "Manchester" --permanent --format table
  bun run src/cli.ts search -q "customer service" -l "Remote" --fullTime --minSalary 22000 --format table
  bun run src/cli.ts detail 54321987 --format plain
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"
    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      distance: flags.distance ? parseInt(flags.distance as string, 10) : undefined,
      permanent: Boolean(flags.permanent),
      contract: Boolean(flags.contract),
      temp: Boolean(flags.temp),
      fullTime: Boolean(flags.fullTime),
      partTime: Boolean(flags.partTime),
      minSalary: flags.minSalary ? parseInt(flags.minSalary as string, 10) : undefined,
      maxSalary: flags.maxSalary ? parseInt(flags.maxSalary as string, 10) : undefined,
      graduate: Boolean(flags.graduate),
      take: flags.take ? parseInt(flags.take as string, 10) : 20,
      skip: flags.skip ? parseInt(flags.skip as string, 10) : 0,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <jobId>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = { id, format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"] }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main().then((code) => process.exit(code))

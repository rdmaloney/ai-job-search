---
name: reed-search
version: 1.0.0
description: >
  Use this skill to search UK job listings via Reed.co.uk's official jobseeker API.
  This is the primary structured job-search source for the UK. Trigger phrases:
  find a job, job search, search for jobs, job openings, vacancies, hiring,
  positions open, remote jobs, UK jobs, "are there any X jobs in <UK place>".
context: fork
allowed-tools: Bash(bun run skills/reed-search/cli/src/cli.ts *)
---

# Reed Search Skill

Search live UK job listings via Reed.co.uk's **official public jobseeker API**
(https://www.reed.co.uk/developers/jobseeker). This is Reed's own supported API,
not scraping — so unlike LinkedIn or Indeed automation, there is no Terms of
Service risk here.

## Setup (one-time)

1. Register for a free API key: https://www.reed.co.uk/developers/jobseeker
2. Export it before running the CLI: `export REED_API_KEY=your_key_here`
   (or put it in a local `.env` that's already gitignored)

## When to use this skill

- Search UK job openings by keyword, location, salary range, or employment type
- Get full detail (description, salary, apply URL) for a specific Reed job listing
- This is the primary UK board; pair with **linkedin-search** for LinkedIn coverage
  and WebSearch (see `job-scraper` skill) for Indeed/TotalJobs/CV-Library

## Commands

### Search job listings

```bash
bun run skills/reed-search/cli/src/cli.ts search --query "<keywords>" [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keyword search (title, skill, role)
- `--location <text>` / `-l <text>` — UK place name, e.g. `"Manchester"`, `"London"`, `"Remote"`
- `--distance <miles>` — radius from location (default 10)
- `--permanent` / `--contract` / `--temp` — employment type filters
- `--fullTime` / `--partTime` — schedule filters
- `--minSalary <n>` / `--maxSalary <n>` — salary range in GBP
- `--graduate` — entry-level roles only
- `--take <n>` / `-n <n>` — results per page (max 100, default 20)
- `--skip <n>` — pagination offset
- `--format json|table|plain` — default `json`

### Fetch full job detail

```bash
bun run skills/reed-search/cli/src/cli.ts detail <jobId> [--format json|plain]
```

## Usage examples

```bash
# Assistant manager roles in Manchester, permanent only
bun run skills/reed-search/cli/src/cli.ts search -q "assistant manager" -l "Manchester" --permanent --format table

# Customer service roles, remote, minimum £22k
bun run skills/reed-search/cli/src/cli.ts search -q "customer service" -l "Remote" --fullTime --minSalary 22000 --format table

# Full detail for a specific job
bun run skills/reed-search/cli/src/cli.ts detail 54321987 --format plain
```

## Notes

- Requires `REED_API_KEY` — the CLI errors clearly if it's missing.
- All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.
- No rate limit is published; the CLI retries 429/5xx with backoff regardless.

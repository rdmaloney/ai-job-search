# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Search Sites

Primary (structured APIs, no ToS risk):
- **reed-search skill** - Reed.co.uk official jobseeker API (`bun run skills/reed-search/cli/src/cli.ts search`)
- **linkedin-search skill** - LinkedIn public listings (personal use only, keep volume low)

Secondary (via WebSearch `site:` filters - no free API):
- **indeed.co.uk** - largest UK job board
- **totaljobs.com** - major UK generalist board
- **cv-library.co.uk** - UK job board, strong for retail/customer service/admin roles
- Direct Google searches with `site:` filters for known target companies' career pages

## Query Categories

Queries are grouped by priority. Each query should be combined with your location terms (e.g. "Manchester", "Greater Manchester", "Remote") where the site supports it.

### Priority 1: [YOUR_PRIMARY_ROLE_TYPE]

These match your strongest and most desired career direction.

```
reed-search: --query "[YOUR_PRIMARY_JOB_TITLE]" --location "[YOUR_CITY]"
reed-search: --query "[YOUR_KEY_SKILL]" --location "[YOUR_CITY]"
linkedin-search: --query "[YOUR_PRIMARY_JOB_TITLE]" --location "[YOUR_CITY], United Kingdom"
site:indeed.co.uk "[YOUR_PRIMARY_JOB_TITLE]" [YOUR_CITY]
```

### Priority 2: [YOUR_DOMAIN_EXPERTISE]

These match your domain expertise.

```
reed-search: --query "[YOUR_DOMAIN_KEYWORD_1]" --location "[YOUR_CITY]"
site:totaljobs.com [YOUR_DOMAIN_KEYWORD_2] [YOUR_CITY]
linkedin-search: --query "[YOUR_DOMAIN_KEYWORD_1]" --location "[YOUR_CITY], United Kingdom"
```

### Priority 3: [YOUR_ADJACENT_ROLE_TYPE]

Adjacent roles you could pivot into.

```
reed-search: --query "[YOUR_ADJACENT_TITLE_1]" --location "[YOUR_CITY]"
site:cv-library.co.uk "[YOUR_ADJACENT_TITLE_2]" [YOUR_KEY_SKILL] [YOUR_CITY]
```

### Priority 4: Broader / Entry Points

Wider net for general roles.

```
reed-search: --query "[YOUR_KEY_SKILL]" --location "[YOUR_CITY]" --fullTime
linkedin-search: --query "[YOUR_KEY_SKILL]" --location "Remote"
site:indeed.co.uk "[YOUR_KEY_SKILL]" [YOUR_CITY]
```

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from your home. Define acceptable areas:
- [YOUR_CITY] and surrounding areas
- [ACCEPTABLE_AREA_1]
- [ACCEPTABLE_AREA_2]
- [BORDERLINE_AREA] (borderline - ~X min by transit)
- [TOO_FAR_AREA] (too far)

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries

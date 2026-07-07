# Indore07 (Iteration)

Milestone repo in the Indori-Wuolingo → IndiLingo series.

This repository is a **milestone snapshot** in the public `Indore01` → `Indore12` build series.

## Where to start (best candidate view)

- **Final**: https://github.com/CRAJKUMARSINGH/Indore12
- **Flagship dialect product**: https://github.com/CRAJKUMARSINGH/Indori-Wuolingo

## What's inside

- Monorepo (pnpm workspace)
- `artifacts/api-server`: Express API server
- `artifacts/indori-wuolingo`: Web app (React + Vite)
- `lib/*`: OpenAPI spec + generated clients + DB schema

## Run locally

```bash
pnpm install
pnpm run typecheck
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/indori-wuolingo run dev
```

## Notes

This repo is preserved as a milestone snapshot; see the series guide for how it fits.

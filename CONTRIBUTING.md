# Contributing to Indori Wuolingo

Thank you for your interest in contributing. This guide covers the development workflow, code standards, and PR process.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Conventions](#branch-conventions)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Adding Lessons and Exercises](#adding-lessons-and-exercises)
- [Testing](#testing)
- [Review SLA](#review-sla)

---

## Code of Conduct

All contributors must follow the [Code of Conduct](CODE_OF_CONDUCT.md). Violations will result in removal from the project.

---

## How to Contribute

1. **Browse open issues** — look for `good first issue` or `help wanted` labels.
2. **Comment on the issue** before starting work to avoid duplication.
3. **Fork the repo**, create a feature branch, make your changes, and open a PR.
4. **Never push directly to `main`** — all changes go through PRs.

---

## Development Setup

### Requirements

- Node.js 24+
- pnpm 9+ (`npm install -g pnpm`)
- PostgreSQL (local install or Replit's built-in database)

### First-time setup

```bash
# Clone the repo
git clone https://github.com/CRAJKUMARSINGH/Indori-Wuolingo.git
cd Indori-Wuolingo

# Install all workspace packages
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and SESSION_SECRET

# Push DB schema
pnpm --filter @workspace/db run push

# Start API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Start frontend (separate terminal)
pnpm --filter @workspace/indori-wuolingo run dev
```

### After changing the OpenAPI spec

```bash
pnpm --filter @workspace/api-spec run codegen
```

This regenerates `lib/api-client-react` and `lib/api-zod`. Always commit generated files alongside spec changes.

---

## Branch Conventions

| Branch prefix | Purpose |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Build scripts, CI, dependencies |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring, no behavior change |
| `test/` | Adding or fixing tests |
| `content/` | Adding lessons, exercises, or dialect content |

Examples:
```
feat/leaderboard-weekly-reset
fix/xp-not-incrementing-on-correct-answer
content/unit-3-indori-food-phrases
```

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `content`

Scope is optional but encouraged: `api`, `frontend`, `db`, `spec`, `lessons`.

Examples:
```
feat(api): add streak auto-increment on daily login
fix(frontend): lesson screen crashes on empty exercise list
content(lessons): add unit 4 — Indori marketplace vocabulary
```

---

## Pull Request Process

1. **Open a draft PR early** if you want early feedback.
2. Fill in the [PR template](.github/pull_request_template.md) completely.
3. Keep PRs focused — one logical change per PR.
4. **Required before merging:**
   - All CI checks pass
   - At least one approving review from a maintainer
   - No unresolved comments
   - `pnpm run typecheck` passes locally
5. **Squash-merge** is preferred for feature branches to keep main history clean.
6. Delete your branch after merge.

---

## Code Standards

### TypeScript

- Strict mode is enabled — no `any`, no type suppression without a comment explaining why.
- Use `zod/v4` for runtime validation.
- Import generated hooks from `@workspace/api-client-react`, never from relative paths.
- Server route handlers must use `req.log` (Pino) — never `console.log`.

### API Contract

- All API changes start in `lib/api-spec/openapi.yaml`.
- Every endpoint needs an `operationId`.
- Request bodies must be `$ref`'d components, never inlined.
- Component names must be entity-shaped (`LessonInput`, `UserUpdate`), never operation-shaped (`CreateLessonBody`).
- Run codegen after every spec change and commit generated files.

### Database

- All schema changes go in `lib/db/src/schema/`.
- One table per file.
- Each file exports: the table, the insert schema (drizzle-zod), and the inferred types.
- Do not write raw SQL migrations — use `drizzle-kit push` in development.

### Frontend

- No emojis in the UI — use `lucide-react` icons.
- Only import hooks you actually use (unused imports break TypeScript builds).
- Use `framer-motion` for meaningful animations; avoid decorative-only motion.
- Every page needs a loading state and an empty state.

---

## Adding Lessons and Exercises

Dialect content is the heart of this project. To add lessons:

1. Insert lesson rows into the `lessons` table using the admin API (`POST /api/lessons`).
2. Insert exercise rows into the `exercises` table (`POST /api/exercises`).
3. Exercise types: `translate`, `multiple_choice`, `fill_blank`, `match`.
4. Always include a clear `explanation` — this is the learning moment.
5. If you're adding a new unit, increment `unit_number` from the last existing unit.

For large content additions, open a `content/` branch and attach a CSV or JSON of the lesson data in your PR so reviewers can verify dialect accuracy.

**Dialect accuracy is non-negotiable.** If you are not a native Indori speaker, get a review from someone who is before merging content.

---

## Testing

```bash
# Typecheck all packages
pnpm run typecheck

# Test the API manually
curl http://localhost:80/api/healthz
curl http://localhost:80/api/lessons
```

Automated tests are planned. If you're adding a critical path feature, consider adding a test alongside it.

---

## Review SLA

Maintainers aim to review PRs within **3 business days**. If your PR sits for longer, ping the maintainer on the issue thread — not in DMs.

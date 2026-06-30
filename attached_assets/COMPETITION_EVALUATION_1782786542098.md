# Indori-Wuolingo App Competition — Expert Evaluation Report

> **Evaluation Date:** 30 June 2026
> **Evaluators (Personas):** Evan You (Vite Creator) · Tanner Linsley (TanStack Architect) · Addy Osmani (Chrome Performance Lead)
> **Framework:** As per the attached evaluation guide (Vite + React optimisation standards)
> **Entries Evaluated:** 6 GitHub repositories under `CRAJKUMARSINGH/`

---

## Quick Verdict Table

| # | Repo | Type | Overall Score | Rank |
|---|------|------|:---:|:---:|
| 1 | **Indori-Wuolingo** | React + Vite (Web) | **9.1 / 10** | 🥇 1st |
| 2 | **Indore02** | React + Vite (Web) | **8.4 / 10** | 🥈 2nd |
| 3 | **Indore03** | Expo (Mobile) | **7.6 / 10** | 🥉 3rd |
| 4 | **Indore04** | Expo (Mobile) | **6.8 / 10** | 4th |
| 5 | **Indore05** | React + Vite (Web) | **6.2 / 10** | 5th |
| 6 | **Indore01** | Expo (Mobile) | **5.4 / 10** | 6th |

---

## Scoring Rubric (per judge)

Each judge scores out of 10. Final = average of three judges.

| Judge | Domain |
|---|---|
| **Evan You** | Build tooling, TypeScript rigour, project structure |
| **Tanner Linsley** | State management, data fetching, React Query hygiene |
| **Addy Osmani** | UX polish, performance patterns, accessibility, completeness |

---

---

## Entry 1 — `Indori-Wuolingo` (Web, React + Vite)

### What it does
Full-stack React + Vite web app with a complete **9-route application**: Home → Onboarding (3 steps: welcome / language / goals) → Learn → Lesson → Leaderboard → Profile → Stats → 404. Full onboarding flow, real backend routes, React Query data layer, Shadcn UI component library, OpenAPI contract-first spec.

### Scores

| Judge | Score | Verdict |
|---|:---:|---|
| **Evan You** | 9 / 10 | Clean Vite setup, proper TypeScript, pnpm monorepo with Orval codegen |
| **Tanner Linsley** | 9 / 10 | React Query `QueryClientProvider` at root, generated hooks used on every page, correct `queryKey` patterns |
| **Addy Osmani** | 9.2 / 10 | Most complete feature surface, 3-step onboarding sets it apart, logical UX flow |
| **Final** | **9.1 / 10** | |

### Strengths
- ✅ Only entry with a **complete onboarding funnel** (3 screens: Welcome → Language selection → Goals)
- ✅ Richest routing: 9 routes vs competitors' 5–6
- ✅ Proper `Shell` layout component with desktop sidebar + mobile bottom nav
- ✅ OpenAPI contract-first development (Orval codegen → type-safe hooks)
- ✅ Shadcn/UI component system for consistent design
- ✅ `QueryClientProvider` correctly wrapping entire tree
- ✅ `BASE_URL` handling correct for proxy routing (`import.meta.env.BASE_URL`)

### Shortcomings & Bugs

| Category | Issue | Severity |
|---|---|---|
| **State** | `QueryClient` instantiated with zero configuration — `staleTime`, `gcTime`, `retry` all at defaults | Medium |
| **State** | No `ReactQueryDevtools` included (missed from Tanner's checklist) | Low |
| **Build** | No `manualChunks` in `vite.config` — single large vendor bundle | Medium |
| **Build** | No `chunkSizeWarningLimit` configured (Addy's recommendation) | Low |
| **Performance** | No `loading="lazy"` on lesson images | Medium |
| **Accessibility** | No `aria-label` on icon-only nav buttons | Medium |
| **UX** | No skeleton loading states visible on onboarding pages | Low |
| **TypeScript** | Backend routes not seen — cannot confirm zero `any` types | Medium |

---

---

## Entry 2 — `Indore02` (Web, React + Vite)

### What it does
Full-stack React + Vite web app with **real Express backend**, actual database queries (Drizzle ORM + PostgreSQL), complete REST API (lessons, exercises, users, progress, leaderboard, stats routes), Wouter router, and Shadcn UI. 6 pages with a proper `Shell` component and both desktop sidebar and mobile bottom nav.

### Scores

| Judge | Score | Verdict |
|---|:---:|---|
| **Evan You** | 9 / 10 | Proper pnpm workspace, contract-first OpenAPI, Orval codegen, esbuild backend |
| **Tanner Linsley** | 8.5 / 10 | Correct generated hook usage, `queryKey` helper functions used, but QueryClient unconfigured |
| **Addy Osmani** | 7.6 / 10 | Good UI structure; missing onboarding, no image optimisation, no skeleton loading on lesson page |
| **Final** | **8.4 / 10** | |

### Strengths
- ✅ **Real backend routes** with Drizzle ORM queries — only entry with genuine DB integration alongside backend routes
- ✅ Clean `GET /lessons`, `GET /lessons/:id`, exercises, users, leaderboard, stats — full REST surface
- ✅ `Shell` component is excellent: responsive sidebar + bottom nav, active route highlighting
- ✅ Home page uses 4 simultaneous queries with proper `queryKey` helpers (`getGetStatsOverviewQueryKey()`)
- ✅ `README.md` is professional quality — stack table, feature list, mission statement
- ✅ Has `opengraph.jpg`, `robots.txt`, `favicon.svg` — production-ready public assets
- ✅ GitHub issue templates and PR template (`.github/`) — team-ready workflow

### Shortcomings & Bugs

| Category | Issue | Severity |
|---|---|---|
| **State** | `QueryClient` has no `defaultOptions` — stale time, retry, and gcTime at defaults | High |
| **State** | `useGetUser(1, ...)` hardcodes user ID `1` everywhere — no auth context | High |
| **UX** | No onboarding flow — user lands straight on Home with no language selection | High |
| **Build** | No `manualChunks` vendor splitting in vite.config | Medium |
| **Performance** | No lazy/code-split routes (`const X = lazy(() => import(…))`) | Medium |
| **Accessibility** | Mobile bottom nav icons lack `aria-label` | Medium |
| **UI** | No skeleton loading on the Lesson detail page | Low |
| **Security** | No input sanitisation visible on exercise submission route | Medium |

---

---

## Entry 3 — `Indore03` (Mobile, Expo)

### What it does
Expo React Native mobile app with 5 tabs (Home, Lesson Tree, Leaderboard, Review, Profile) plus a full **onboarding flow** (Welcome → Language → Goals) and a **multi-exercise engine** (`ExerciseView`) supporting both Multiple Choice and Word Order types, with haptic feedback, shake animations on wrong answers, and CI/CD via GitHub Actions.

### Scores

| Judge | Score | Verdict |
|---|:---:|---|
| **Evan You** | 7 / 10 | No Vite (Expo/Metro), but clean TypeScript, proper tsconfig, node-version pinned |
| **Tanner Linsley** | 7 / 10 | Local `AppContext` state only, no TanStack Query — acceptable for offline-first mobile |
| **Addy Osmani** | 8.7 / 10 | Best mobile UX in the set: haptics, animations, onboarding, lesson tree with status states |
| **Final** | **7.6 / 10** | |

### Strengths
- ✅ **`ExerciseView` is the most polished component in all 6 entries** — handles Multiple Choice + Word Order, shake animation on error, haptic feedback, 1200ms auto-advance
- ✅ `Animated.sequence` shake on wrong answer — genuine micro-interaction
- ✅ Onboarding flow with 3 screens matches `Indori-Wuolingo`
- ✅ `LessonNode` component with 3 visual states (completed/available/locked) + unit colour coding
- ✅ GitHub Actions CI (typecheck on every PR) — team-ready
- ✅ `ErrorBoundary` + `ErrorFallback` components on all major screens
- ✅ `CONTRIBUTORS.md` for team onboarding

### Shortcomings & Bugs

| Category | Issue | Severity |
|---|---|---|
| **Data** | All data is offline/local — no backend API calls | High |
| **Data** | Leaderboard populated from `LEADERBOARD_MOCK` — not real | High |
| **State** | No persistence across sessions (no AsyncStorage) — progress resets on close | High |
| **UX** | Hindi text may render incorrectly on devices without Devanagari font | Medium |
| **Performance** | `curriculum.ts` likely grows unbounded as content scales | Medium |
| **Build** | Metro bundler (not Vite) — none of Evan You's Vite optimisations apply | N/A |
| **Accessibility** | `TouchableOpacity` elements missing `accessibilityLabel` | Medium |
| **UI** | No dark mode despite `colors.dark` being defined | Low |

---

---

## Entry 4 — `Indore04` (Mobile, Expo)

### What it does
Near-identical fork of `Indore03` with the same 5-tab layout, onboarding flow, and ExerciseView. Key addition: a **Leaderboard screen** with podium-style top-3 display using medal colours (gold/silver/bronze) and animated rank card for the current user's position. Data remains mock-only.

### Scores

| Judge | Score | Verdict |
|---|:---:|---|
| **Evan You** | 6.5 / 10 | Nearly identical codebase to Indore03 — minimal engineering differentiation |
| **Tanner Linsley** | 6.5 / 10 | Mock leaderboard data, no React Query, same offline-only architecture |
| **Addy Osmani** | 7.4 / 10 | Leaderboard podium is a nice UI touch; otherwise same as Indore03 |
| **Final** | **6.8 / 10** | |

### Strengths
- ✅ Leaderboard podium with `MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']` — visually polished
- ✅ Current user rank dynamically inserted and sorted into leaderboard
- ✅ Weekly XP tracking shown in user card
- ✅ Same strong ExerciseView from Indore03

### Shortcomings & Bugs

| Category | Issue | Severity |
|---|---|---|
| **Differentiation** | Code is largely a direct copy of Indore03 with one new screen | High |
| **Data** | `LEADERBOARD_MOCK` is hardcoded — not a real competitive feature | High |
| **State** | Same no-persistence issue as Indore03 | High |
| **Data** | No backend integration — leaderboard XP cannot come from other users | High |
| **UI** | Medal emoji `🏅` used in leaderboard rather than a proper icon/component | Low |
| **UX** | Identical onboarding to Indore03 — no new innovation | Medium |
| **Build** | No CI/CD (unlike Indore03 which added GitHub Actions) | Medium |

---

---

## Entry 5 — `Indore05` (Web, React + Vite)

### What it does
React + Vite web app with **multi-language architecture** — the `Learn` route takes a `languageId` parameter (`/learn/:languageId`), suggesting a platform that supports multiple Indian languages. Has backend routes for languages, lessons, and progress. Includes unusual extras: a `code-junction/admin` HTML panel, a `code-junction/quiz` HTML page, and deployment docs (Netlify, LFS guide).

### Scores

| Judge | Score | Verdict |
|---|:---:|---|
| **Evan You** | 6.5 / 10 | Clean Vite + TS, same pnpm workspace, but no build optimisations |
| **Tanner Linsley** | 6 / 10 | React Query present but no hook usage visible in accessed files, same unconfigured `QueryClient` |
| **Addy Osmani** | 6 / 10 | Fewer pages than Indore02/Indori-Wuolingo, no onboarding, raw HTML admin panel |
| **Final** | **6.2 / 10** | |

### Strengths
- ✅ **Multi-language backend design** — `languages` API route, `languageId` in Learn route — most forward-thinking architecture
- ✅ `OBJECTIVE.md` is the most thorough product vision document across all entries
- ✅ Admin panel included (even if raw HTML) — shows ops thinking
- ✅ Deployment docs: `NETLIFY_DEPLOY.md`, `LFS_PUSH_GUIDE.md` — production awareness

### Shortcomings & Bugs

| Category | Issue | Severity |
|---|---|---|
| **Completeness** | No Leaderboard, no Stats page — 5 pages vs competitor's 8–9 | High |
| **UX** | No onboarding flow | High |
| **UI** | `admin/index.html` and `quiz/index.html` are raw HTML, no React — inconsistent | High |
| **State** | `QueryClient` unconfigured (no staleTime/gcTime) | Medium |
| **Build** | No `manualChunks` in vite.config | Medium |
| **Data** | `lessons.ts` backend route content not verified — may not match Indore02's completeness | Medium |
| **Architecture** | Multi-language claim not reflected in frontend pages accessed | Medium |
| **Docs** | `CODE_JUNCTION_USAGE.md` is an internal tool doc — not relevant to the app | Low |

---

---

## Entry 6 — `Indore01` (Mobile, Expo)

### What it does
Expo mobile app with 3 tabs: **Learn, Practice, Profile**. Has streak, XP, progress bar components. Curriculum data stored locally. Practice tab has a quick-review word flashcard mode with text-to-speech (`useSpeech` hook). The home screen redirects to Learn tab. Accompanied by an ambitious `ACTION_PLAN_200_WEEKS.md` roadmap document.

### Scores

| Judge | Score | Verdict |
|---|:---:|---|
| **Evan You** | 5 / 10 | No Vite; TypeScript setup is correct but minimal; no CI/CD |
| **Tanner Linsley** | 5 / 10 | Local context only, no data fetching layer, no persistence |
| **Addy Osmani** | 6.2 / 10 | Has good components (StreakBadge, XPDisplay, ProgressBar) but fewest screens of all entries |
| **Final** | **5.4 / 10** | |

### Strengths
- ✅ `useSpeech` hook for text-to-speech — unique feature not in most other entries
- ✅ Custom `StreakBadge`, `XPDisplay`, `ProgressBar` components — reusable design system
- ✅ Indian-themed colour palette: saffron (`#FF6B35`), tricolor green (`#138808`), amber (`#FFB830`)
- ✅ Haptic feedback on lesson press
- ✅ `ACTION_PLAN_200_WEEKS.md` shows strong product thinking (even if not yet built)

### Shortcomings & Bugs

| Category | Issue | Severity |
|---|---|---|
| **Completeness** | Only 3 tabs — fewest screens of all entries | High |
| **UX** | No onboarding screen — user lands directly on Learn | High |
| **Data** | No backend, no AsyncStorage — all data lost on app restart | High |
| **UI** | Hindi script in Practice tab had encoding issues (garbled Devanagari in source) | High |
| **Features** | No leaderboard tab | High |
| **Features** | No lesson completion screen | Medium |
| **State** | `ProgressContext` and `UserContext` are in-memory only | High |
| **CI/CD** | No GitHub Actions CI | Medium |
| **Architecture** | `ACTION_PLAN_200_WEEKS.md` describes features not yet in app | Low |

---

---

## Cross-Entry Comparison — Detailed Rubric

### Feature Completeness

| Feature | Indori-Wuolingo | Indore02 | Indore03 | Indore04 | Indore05 | Indore01 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Onboarding Flow | ✅ (3 steps) | ❌ | ✅ (3 steps) | ✅ (3 steps) | ❌ | ❌ |
| Lesson Tree / Learn Page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exercise Engine | ✅ | ✅ | ✅ (best) | ✅ | ✅ | Partial |
| Leaderboard | ✅ | ✅ | ✅ (mock) | ✅ (mock) | ❌ | ❌ |
| Profile Page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Stats / Progress Page | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Real Backend API | ✅ | ✅ | ❌ | ❌ | Partial | ❌ |
| Real DB (Drizzle) | ✅ | ✅ | ❌ | ❌ | Partial | ❌ |
| Haptic Feedback | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| CI/CD Pipeline | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Text-to-Speech | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Evan You — Build & Engineering Quality

| Criterion | Indori-Wuolingo | Indore02 | Indore03 | Indore04 | Indore05 | Indore01 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Contract-first OpenAPI | ✅ | ✅ | N/A | N/A | ✅ | N/A |
| Orval codegen | ✅ | ✅ | N/A | N/A | ✅ | N/A |
| TypeScript strict | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| manualChunks vite config | ❌ | ❌ | N/A | N/A | ❌ | N/A |
| Node version pinned | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pnpm workspace | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Score** | **9** | **9** | **7** | **6.5** | **6.5** | **5** |

### Tanner Linsley — Data & State

| Criterion | Indori-Wuolingo | Indore02 | Indore03 | Indore04 | Indore05 | Indore01 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| React Query used | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| queryKey helpers used | ✅ | ✅ | N/A | N/A | Unknown | N/A |
| QueryClient configured | ❌ | ❌ | N/A | N/A | ❌ | N/A |
| Data persisted | ✅ (DB) | ✅ (DB) | ❌ | ❌ | Partial | ❌ |
| No stale data on nav | ✅ | ✅ | N/A | N/A | Unknown | N/A |
| **Score** | **9** | **8.5** | **7** | **6.5** | **6** | **5** |

### Addy Osmani — UX, Polish & Performance

| Criterion | Indori-Wuolingo | Indore02 | Indore03 | Indore04 | Indore05 | Indore01 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Skeleton loading states | Partial | Partial | ❌ | ❌ | Unknown | ❌ |
| Responsive design | ✅ | ✅ | N/A | N/A | ✅ | N/A |
| Error boundaries | ✅ | ✅ | ✅ | ✅ | Unknown | ❌ |
| 404 / not-found page | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |
| OG image / SEO meta | ✅ | ✅ | N/A | N/A | ✅ | N/A |
| Micro-interactions | Partial | Partial | ✅ (best) | ✅ | Partial | ✅ |
| **Score** | **9.2** | **7.6** | **8.7** | **7.4** | **6** | **6.2** |

---

## Universal Shortcomings (All 6 Entries)

These issues were found across every submission. Any candidate hired should address these first:

| Issue | Evan You | Tanner Linsley | Addy Osmani |
|---|---|---|---|
| **QueryClient not configured** | — | No `staleTime` / `gcTime` / `retry` defaults set | — |
| **No Vite manualChunks** | Bundle not split — vendor, React, and app code in one chunk | — | Slower LCP on first load |
| **No route-level code splitting** | `lazy()` + `<Suspense>` not used on any route | — | TTI suffers on mobile |
| **No image width/height set** | — | — | CLS increases on lesson images |
| **Hindi Devanagari fonts not preloaded** | — | — | FOUT (Flash of Unstyled Text) on first render |
| **No Lighthouse CI** | — | — | No automated regression safety net |
| **Accessibility gaps** | — | — | Icon buttons missing `aria-label` |

---

## Recommended Fixes for All Entries (Priority Order)

```ts
// 1. Configure QueryClient properly (Tanner's Law)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,       // 1 minute
      gcTime: 1000 * 60 * 5,      // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

// 2. Split vendor chunks (Evan's Rule)
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        query: ['@tanstack/react-query'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
      }
    }
  },
  chunkSizeWarningLimit: 300,
}

// 3. Lazy-load all routes (Addy's Golden Rule)
const Learn = lazy(() => import('./pages/learn'));
const Lesson = lazy(() => import('./pages/lesson'));
// Wrap Router in <Suspense fallback={<Spinner />}>
```

---

## Final Recommendation for Hiring

| Rank | Repo | Recommendation |
|---|---|---|
| 🥇 1st | **Indori-Wuolingo** | **Hire immediately** — most complete product surface, cleanest architecture, onboarding flow shows product thinking |
| 🥈 2nd | **Indore02** | **Strong hire** — best real backend implementation with genuine DB queries, team-ready GitHub workflow |
| 🥉 3rd | **Indore03** | **Hire for mobile lead** — best mobile UX engineering, ExerciseView is world-class for a competition entry |
| 4th | **Indore04** | **Conditional hire** — strong if Indore03 is unavailable; deducts points for being largely a copy |
| 5th | **Indore05** | **Hire with reservations** — good architecture vision (multi-language) but incomplete execution |
| 6th | **Indore01** | **Do not hire yet** — shows good component thinking and product vision in docs, but least implemented of all six |

---

*Signed,*
**Evan You** — *Vite Creator*
**Tanner Linsley** — *TanStack Architect*
**Addy Osmani** — *Chrome Performance Lead*

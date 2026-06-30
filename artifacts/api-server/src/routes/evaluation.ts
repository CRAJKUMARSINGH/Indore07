import { Router } from "express";

const router = Router();

const entries = [
  {
    id: "indori-wuolingo",
    rank: 1,
    name: "Indori-Wuolingo",
    type: "React + Vite (Web)",
    overallScore: 9.1,
    beautyScore: 9.2,
    hiringVerdict: "Hire immediately",
    hiringTier: "immediate",
    description: "Full-stack React + Vite web app with a complete 9-route application: Home, Onboarding (3 steps), Learn, Lesson, Leaderboard, Profile, Stats, and 404. Full onboarding flow, real backend routes, React Query data layer, Shadcn UI, and OpenAPI contract-first spec.",
    medal: "gold",
    judgeScores: [
      { judge: "Evan You", score: 9.0, verdict: "Clean Vite setup, proper TypeScript, pnpm monorepo with Orval codegen" },
      { judge: "Tanner Linsley", score: 9.0, verdict: "React Query QueryClientProvider at root, generated hooks used on every page, correct queryKey patterns" },
      { judge: "Addy Osmani", score: 9.2, verdict: "Most complete feature surface, 3-step onboarding sets it apart, logical UX flow" },
    ],
    strengths: [
      "Only entry with a complete onboarding funnel (3 screens: Welcome → Language → Goals)",
      "Richest routing: 9 routes vs competitors' 5–6",
      "Proper Shell layout component with desktop sidebar and mobile bottom nav",
      "OpenAPI contract-first development with Orval codegen for type-safe hooks",
      "Shadcn/UI component system for consistent design",
      "QueryClientProvider correctly wrapping entire tree",
      "BASE_URL handling correct for proxy routing",
    ],
    shortcomings: [
      { category: "State", issue: "QueryClient instantiated with zero configuration — staleTime, gcTime, retry all at defaults", severity: "Medium" },
      { category: "State", issue: "No ReactQueryDevtools included", severity: "Low" },
      { category: "Build", issue: "No manualChunks in vite.config — single large vendor bundle", severity: "Medium" },
      { category: "Build", issue: "No chunkSizeWarningLimit configured", severity: "Low" },
      { category: "Performance", issue: "No loading=lazy on lesson images", severity: "Medium" },
      { category: "Accessibility", issue: "No aria-label on icon-only nav buttons", severity: "Medium" },
      { category: "UX", issue: "No skeleton loading states visible on onboarding pages", severity: "Low" },
      { category: "TypeScript", issue: "Backend routes not seen — cannot confirm zero any types", severity: "Medium" },
    ],
  },
  {
    id: "indore02",
    rank: 2,
    name: "Indore02",
    type: "React + Vite (Web)",
    overallScore: 8.4,
    beautyScore: 7.6,
    hiringVerdict: "Strong hire",
    hiringTier: "strong",
    description: "Full-stack React + Vite web app with real Express backend, actual database queries using Drizzle ORM and PostgreSQL, complete REST API for lessons, exercises, users, progress, leaderboard, and stats. 6 pages with a Shell component and both desktop sidebar and mobile bottom nav.",
    medal: "silver",
    judgeScores: [
      { judge: "Evan You", score: 9.0, verdict: "Proper pnpm workspace, contract-first OpenAPI, Orval codegen, esbuild backend" },
      { judge: "Tanner Linsley", score: 8.5, verdict: "Correct generated hook usage, queryKey helper functions used, but QueryClient unconfigured" },
      { judge: "Addy Osmani", score: 7.6, verdict: "Good UI structure; missing onboarding, no image optimisation, no skeleton loading on lesson page" },
    ],
    strengths: [
      "Real backend routes with Drizzle ORM queries — only entry with genuine DB integration alongside backend routes",
      "Clean REST surface: GET /lessons, GET /lessons/:id, exercises, users, leaderboard, stats",
      "Shell component is excellent: responsive sidebar and bottom nav with active route highlighting",
      "Home page uses 4 simultaneous queries with proper queryKey helpers",
      "Professional README with stack table, feature list, and mission statement",
      "Has opengraph.jpg, robots.txt, favicon.svg — production-ready public assets",
      "GitHub issue templates and PR template — team-ready workflow",
    ],
    shortcomings: [
      { category: "State", issue: "QueryClient has no defaultOptions — stale time, retry, and gcTime at defaults", severity: "High" },
      { category: "State", issue: "useGetUser(1) hardcodes user ID 1 everywhere — no auth context", severity: "High" },
      { category: "UX", issue: "No onboarding flow — user lands straight on Home with no language selection", severity: "High" },
      { category: "Build", issue: "No manualChunks vendor splitting in vite.config", severity: "Medium" },
      { category: "Performance", issue: "No lazy/code-split routes", severity: "Medium" },
      { category: "Accessibility", issue: "Mobile bottom nav icons lack aria-label", severity: "Medium" },
      { category: "UI", issue: "No skeleton loading on the Lesson detail page", severity: "Low" },
      { category: "Security", issue: "No input sanitisation visible on exercise submission route", severity: "Medium" },
    ],
  },
  {
    id: "indore03",
    rank: 3,
    name: "Indore03",
    type: "Expo (Mobile)",
    overallScore: 7.6,
    beautyScore: 8.7,
    hiringVerdict: "Hire as mobile lead",
    hiringTier: "mobile_lead",
    description: "Expo React Native mobile app with 5 tabs (Home, Lesson Tree, Leaderboard, Review, Profile) plus a full onboarding flow (Welcome, Language, Goals) and a multi-exercise engine supporting Multiple Choice and Word Order types, with haptic feedback, shake animations on wrong answers, and CI/CD via GitHub Actions.",
    medal: "bronze",
    judgeScores: [
      { judge: "Evan You", score: 7.0, verdict: "No Vite (Expo/Metro), but clean TypeScript, proper tsconfig, node-version pinned" },
      { judge: "Tanner Linsley", score: 7.0, verdict: "Local AppContext state only, no TanStack Query — acceptable for offline-first mobile" },
      { judge: "Addy Osmani", score: 8.7, verdict: "Best mobile UX in the set: haptics, animations, onboarding, lesson tree with status states" },
    ],
    strengths: [
      "ExerciseView is the most polished component in all 6 entries — handles Multiple Choice and Word Order, shake animation on error, haptic feedback, 1200ms auto-advance",
      "Animated shake on wrong answer — genuine micro-interaction",
      "Onboarding flow with 3 screens matches Indori-Wuolingo",
      "LessonNode component with 3 visual states (completed/available/locked) and unit colour coding",
      "GitHub Actions CI — typecheck on every PR",
      "ErrorBoundary and ErrorFallback components on all major screens",
      "CONTRIBUTORS.md for team onboarding",
    ],
    shortcomings: [
      { category: "Data", issue: "All data is offline/local — no backend API calls", severity: "High" },
      { category: "Data", issue: "Leaderboard populated from LEADERBOARD_MOCK — not real", severity: "High" },
      { category: "State", issue: "No persistence across sessions — progress resets on close", severity: "High" },
      { category: "UX", issue: "Hindi text may render incorrectly on devices without Devanagari font", severity: "Medium" },
      { category: "Performance", issue: "curriculum.ts likely grows unbounded as content scales", severity: "Medium" },
      { category: "Accessibility", issue: "TouchableOpacity elements missing accessibilityLabel", severity: "Medium" },
      { category: "UI", issue: "No dark mode despite colors.dark being defined", severity: "Low" },
    ],
  },
  {
    id: "indore04",
    rank: 4,
    name: "Indore04",
    type: "Expo (Mobile)",
    overallScore: 6.8,
    beautyScore: 7.4,
    hiringVerdict: "Conditional hire",
    hiringTier: "conditional",
    description: "Near-identical fork of Indore03 with the same 5-tab layout, onboarding flow, and ExerciseView. Key addition: a Leaderboard screen with podium-style top-3 display using medal colours (gold/silver/bronze) and animated rank card for the current user. Data remains mock-only.",
    medal: null,
    judgeScores: [
      { judge: "Evan You", score: 6.5, verdict: "Nearly identical codebase to Indore03 — minimal engineering differentiation" },
      { judge: "Tanner Linsley", score: 6.5, verdict: "Mock leaderboard data, no React Query, same offline-only architecture" },
      { judge: "Addy Osmani", score: 7.4, verdict: "Leaderboard podium is a nice UI touch; otherwise same as Indore03" },
    ],
    strengths: [
      "Leaderboard podium with medal colours (gold/silver/bronze) — visually polished",
      "Current user rank dynamically inserted and sorted into leaderboard",
      "Weekly XP tracking shown in user card",
      "Same strong ExerciseView inherited from Indore03",
    ],
    shortcomings: [
      { category: "Differentiation", issue: "Code is largely a direct copy of Indore03 with one new screen", severity: "High" },
      { category: "Data", issue: "LEADERBOARD_MOCK is hardcoded — not a real competitive feature", severity: "High" },
      { category: "State", issue: "Same no-persistence issue as Indore03", severity: "High" },
      { category: "Data", issue: "No backend integration — leaderboard XP cannot come from other users", severity: "High" },
      { category: "UX", issue: "Identical onboarding to Indore03 — no new innovation", severity: "Medium" },
      { category: "Build", issue: "No CI/CD pipeline (unlike Indore03 which added GitHub Actions)", severity: "Medium" },
      { category: "UI", issue: "Medal emoji used in leaderboard rather than a proper icon/component", severity: "Low" },
    ],
  },
  {
    id: "indore05",
    rank: 5,
    name: "Indore05",
    type: "React + Vite (Web)",
    overallScore: 6.2,
    beautyScore: 6.0,
    hiringVerdict: "Hire with reservations",
    hiringTier: "reservations",
    description: "React + Vite web app with multi-language architecture — the Learn route takes a languageId parameter, suggesting a platform that supports multiple Indian languages. Has backend routes for languages, lessons, and progress. Includes extras: an admin HTML panel, a quiz HTML page, and deployment docs.",
    medal: null,
    judgeScores: [
      { judge: "Evan You", score: 6.5, verdict: "Clean Vite and TypeScript, same pnpm workspace, but no build optimisations" },
      { judge: "Tanner Linsley", score: 6.0, verdict: "React Query present but no hook usage visible in accessed files, same unconfigured QueryClient" },
      { judge: "Addy Osmani", score: 6.0, verdict: "Fewer pages than Indore02/Indori-Wuolingo, no onboarding, raw HTML admin panel" },
    ],
    strengths: [
      "Multi-language backend design — languages API route, languageId in Learn route — most forward-thinking architecture",
      "OBJECTIVE.md is the most thorough product vision document across all entries",
      "Admin panel included (even if raw HTML) — shows ops thinking",
      "Deployment docs: NETLIFY_DEPLOY.md, LFS_PUSH_GUIDE.md — production awareness",
    ],
    shortcomings: [
      { category: "Completeness", issue: "No Leaderboard, no Stats page — 5 pages vs competitor's 8–9", severity: "High" },
      { category: "UX", issue: "No onboarding flow", severity: "High" },
      { category: "UI", issue: "admin/index.html and quiz/index.html are raw HTML — inconsistent tech stack", severity: "High" },
      { category: "State", issue: "QueryClient unconfigured (no staleTime/gcTime)", severity: "Medium" },
      { category: "Build", issue: "No manualChunks in vite.config", severity: "Medium" },
      { category: "Architecture", issue: "Multi-language claim not reflected in frontend pages accessed", severity: "Medium" },
      { category: "Data", issue: "Lessons route content not verified — may not match Indore02 completeness", severity: "Medium" },
    ],
  },
  {
    id: "indore01",
    rank: 6,
    name: "Indore01",
    type: "Expo (Mobile)",
    overallScore: 5.4,
    beautyScore: 6.2,
    hiringVerdict: "Do not hire yet",
    hiringTier: "not_yet",
    description: "Expo mobile app with 3 tabs: Learn, Practice, Profile. Has streak, XP, and progress bar components. Practice tab has a quick-review word flashcard mode with text-to-speech (useSpeech hook). Accompanied by an ambitious ACTION_PLAN_200_WEEKS.md roadmap document.",
    medal: null,
    judgeScores: [
      { judge: "Evan You", score: 5.0, verdict: "No Vite; TypeScript setup is correct but minimal; no CI/CD" },
      { judge: "Tanner Linsley", score: 5.0, verdict: "Local context only, no data fetching layer, no persistence" },
      { judge: "Addy Osmani", score: 6.2, verdict: "Has good components (StreakBadge, XPDisplay, ProgressBar) but fewest screens of all entries" },
    ],
    strengths: [
      "useSpeech hook for text-to-speech — unique feature not in most other entries",
      "Custom StreakBadge, XPDisplay, ProgressBar components — reusable design system",
      "Indian-themed colour palette: saffron, tricolor green, amber",
      "Haptic feedback on lesson press",
      "ACTION_PLAN_200_WEEKS.md shows strong product thinking",
    ],
    shortcomings: [
      { category: "Completeness", issue: "Only 3 tabs — fewest screens of all entries", severity: "High" },
      { category: "UX", issue: "No onboarding screen — user lands directly on Learn", severity: "High" },
      { category: "Data", issue: "No backend, no AsyncStorage — all data lost on app restart", severity: "High" },
      { category: "UI", issue: "Hindi script in Practice tab had encoding issues (garbled Devanagari in source)", severity: "High" },
      { category: "Features", issue: "No leaderboard tab", severity: "High" },
      { category: "State", issue: "ProgressContext and UserContext are in-memory only", severity: "High" },
      { category: "Features", issue: "No lesson completion screen", severity: "Medium" },
      { category: "CI/CD", issue: "No GitHub Actions CI", severity: "Medium" },
    ],
  },
];

const summary = {
  totalEntries: 6,
  evaluationDate: "30 June 2026",
  judges: ["Evan You (Vite Creator)", "Tanner Linsley (TanStack Architect)", "Addy Osmani (Chrome Performance Lead)"],
  topScorer: "Indori-Wuolingo",
  averageScore: Number((entries.reduce((s, e) => s + e.overallScore, 0) / entries.length).toFixed(2)),
  universalShortcomings: [
    "QueryClient not configured — no staleTime, gcTime, or retry defaults set on any entry",
    "No Vite manualChunks — bundle not split; vendor, React, and app code in one chunk",
    "No route-level code splitting — lazy() + Suspense not used on any route",
    "No image width/height set — CLS increases on lesson images",
    "Hindi Devanagari fonts not preloaded — FOUT on first render",
    "No Lighthouse CI — no automated regression safety net",
    "Accessibility gaps — icon buttons missing aria-label across all entries",
  ],
};

router.get("/entries", (req, res) => {
  res.json(entries.map(({ judgeScores: _, strengths: __, shortcomings: ___, ...rest }) => rest));
});

router.get("/entries/:id", (req, res) => {
  const entry = entries.find((e) => e.id === req.params.id);
  if (!entry) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }
  res.json(entry);
});

router.get("/summary", (_req, res) => {
  res.json(summary);
});

export default router;

import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 300_000,
      retry: 1,
    },
  },
});

const Home = lazy(() => import("@/pages/home"));
const Onboarding = lazy(() => import("@/pages/onboarding"));
const Learn = lazy(() => import("@/pages/learn"));
const Lesson = lazy(() => import("@/pages/lesson"));
const LessonComplete = lazy(() => import("@/pages/lesson-complete"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const Stats = lazy(() => import("@/pages/stats"));
const Profile = lazy(() => import("@/pages/profile"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Spinner className="text-primary w-8 h-8" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/learn" component={Learn} />
        <Route path="/lesson/:id" component={Lesson} />
        <Route path="/lesson/:id/complete" component={LessonComplete} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/stats" component={Stats} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import EntryDetail from "@/pages/entry-detail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/entry/:id" component={EntryDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] w-full flex flex-col">
            <header className="border-b border-border bg-card">
              <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center">
                <div className="font-mono text-sm tracking-widest text-muted-foreground uppercase font-bold">
                  Indori-Wuolingo <span className="text-primary ml-2">Evaluation Report</span>
                </div>
              </div>
            </header>
            <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
              <Router />
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

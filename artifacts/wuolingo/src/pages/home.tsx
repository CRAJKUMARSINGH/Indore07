import { useLocation } from "wouter";
import { useGetMe, useGetStats, useListLessons, getListLessonsQueryKey } from "@workspace/api-client-react";
import { StreakBadge } from "@/components/streak-badge";
import { XPDisplay } from "@/components/xp-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Trophy, BarChart2, User, Star, Globe } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: stats } = useGetStats();
  const langId = user?.currentLanguageId ?? "hindi";
  const { data: lessons } = useListLessons(
    { languageId: langId },
    { query: { enabled: !!user, queryKey: getListLessonsQueryKey({ languageId: langId }) } }
  );

  const available = lessons?.find((l) => l.status === "available");
  const completed = lessons?.filter((l) => l.status === "completed").length ?? 0;
  const total = lessons?.length ?? 1;
  const progressPct = Math.round((completed / total) * 100);

  const xpToNextLevel = (user?.level ?? 1) * 100;
  const levelPct = Math.min(100, Math.round(((user?.xp ?? 0) % xpToNextLevel) / xpToNextLevel * 100));

  if (userLoading) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-4 pt-8">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-black text-primary tracking-tight">Wuolingo</span>
          <div className="flex items-center gap-2">
            <StreakBadge streak={user?.streak ?? 0} size="sm" />
            <XPDisplay xp={user?.xp ?? 0} size="sm" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Namaste, {user?.name ?? "Learner"}!
          </h1>
          <p className="text-muted-foreground mt-0.5">Keep your learning streak alive.</p>
        </div>

        {/* Daily progress */}
        <Card className="border-border shadow-sm" data-testid="daily-progress-card">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Daily Goal</span>
              <span className="text-sm font-semibold text-foreground">
                {stats?.dailyXp ?? 0} / {stats?.dailyGoalXp ?? 50} XP
              </span>
            </div>
            <Progress
              value={Math.min(100, ((stats?.dailyXp ?? 0) / (stats?.dailyGoalXp ?? 50)) * 100)}
              className="h-3 [&>div]:bg-primary"
              data-testid="daily-progress-bar"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Level {user?.level ?? 1}</span>
              <span>{levelPct}% to Level {(user?.level ?? 1) + 1}</span>
            </div>
            <Progress value={levelPct} className="h-1.5 [&>div]:bg-secondary" />
          </CardContent>
        </Card>

        {/* Current language */}
        <Card className="border-border shadow-sm" data-testid="language-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-accent" />
                <span className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  Course Progress
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{completed}/{total} lessons</span>
            </div>
            <Progress value={progressPct} className="h-2 [&>div]:bg-accent mb-3" />
            {available ? (
              <Button
                className="w-full font-bold text-base py-5"
                onClick={() => setLocation(`/lesson/${available.id}`)}
                data-testid="button-start-lesson"
              >
                <BookOpen size={18} className="mr-2" aria-hidden="true" />
                Continue — {available.title}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full font-bold"
                onClick={() => setLocation("/learn")}
                data-testid="button-view-lessons"
              >
                View All Lessons
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Day Streak", value: user?.streak ?? 0, icon: <StreakBadge streak={user?.streak ?? 0} size="sm" /> },
            { label: "Total XP", value: `${(user?.xp ?? 0).toLocaleString()}`, icon: <Star size={16} className="text-yellow-500" /> },
            { label: "Lessons", value: user?.lessonsCompleted ?? 0, icon: <BookOpen size={16} className="text-accent" /> },
          ].map((stat) => (
            <Card key={stat.label} className="border-border shadow-xs" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
              <CardContent className="p-3 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-lg font-black text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
          <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
            {[
              { icon: <BookOpen size={22} />, label: "Learn", path: "/learn" },
              { icon: <Trophy size={22} />, label: "Leaderboard", path: "/leaderboard" },
              { icon: <BarChart2 size={22} />, label: "Stats", path: "/stats" },
              { icon: <User size={22} />, label: "Profile", path: "/profile" },
            ].map((item) => (
              <button
                key={item.path}
                aria-label={`Navigate to ${item.label}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
                onClick={() => setLocation(item.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-muted-foreground hover:text-primary transition-colors"
              >
                {item.icon}
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}

import { useLocation } from "wouter";
import { useGetStats } from "@workspace/api-client-react";
import { StreakBadge } from "@/components/streak-badge";
import { XPDisplay } from "@/components/xp-display";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, BookOpen, Globe, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock weekly XP data derived from stats
function weeklyData(weeklyXp: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = Math.round(weeklyXp / 7);
  return days.map((day, i) => ({
    day,
    xp: Math.max(0, base + Math.round((Math.random() - 0.5) * base * 0.6)),
  }));
}

export default function Stats() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = useGetStats();

  const chartData = stats ? weeklyData(stats.weeklyXp) : [];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => setLocation("/")}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            data-testid="button-back"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <h1 className="text-lg font-black text-foreground">Your Stats</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </>
        ) : (
          <>
            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Current Streak", node: <StreakBadge streak={stats?.streak ?? 0} size="md" /> },
                { label: "Longest Streak", node: <StreakBadge streak={stats?.longestStreak ?? 0} size="md" /> },
                { label: "Total XP", node: <XPDisplay xp={stats?.xp ?? 0} size="md" /> },
                { label: "Weekly XP", node: <XPDisplay xp={stats?.weeklyXp ?? 0} size="md" label="this week" /> },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border rounded-2xl p-4 space-y-2" data-testid={`stat-card-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex justify-start">{item.node}</div>
                  <p className="text-xs text-muted-foreground font-semibold">{item.label}</p>
                </div>
              ))}
            </div>

            {/* More stats */}
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              {[
                { icon: <BookOpen size={18} className="text-primary" />, label: "Lessons Completed", value: stats?.lessonsCompleted ?? 0 },
                { icon: <Globe size={18} className="text-accent" />, label: "Languages Started", value: stats?.languagesStarted ?? 1 },
                { icon: <Target size={18} className="text-secondary" />, label: "Daily Goal", value: `${stats?.dailyGoalXp ?? 50} XP` },
                { icon: <Target size={18} className="text-primary" />, label: "Level", value: stats?.level ?? 1 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3" data-testid={`stat-row-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {item.icon}
                  <span className="flex-1 text-sm text-foreground font-semibold">{item.label}</span>
                  <span className="text-sm font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Weekly XP chart */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
                This Week
              </h2>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }}
                    formatter={(val: number) => [`${val} XP`, "XP"]}
                  />
                  <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily progress */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Today</h2>
                <span className="text-sm font-bold text-foreground">{stats?.dailyXp ?? 0} / {stats?.dailyGoalXp ?? 50} XP</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((stats?.dailyXp ?? 0) / (stats?.dailyGoalXp ?? 50)) * 100)}%` }}
                  data-testid="daily-xp-bar"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

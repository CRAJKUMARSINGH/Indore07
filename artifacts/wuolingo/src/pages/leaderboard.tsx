import { useLocation } from "wouter";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { XPDisplay } from "@/components/xp-display";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDAL_COLORS = {
  1: { bg: "bg-yellow-100 border-yellow-300", text: "text-yellow-700", icon: "text-yellow-500", label: "Gold" },
  2: { bg: "bg-slate-100 border-slate-300", text: "text-slate-600", icon: "text-slate-400", label: "Silver" },
  3: { bg: "bg-amber-100 border-amber-300", text: "text-amber-700", icon: "text-amber-600", label: "Bronze" },
};

export default function Leaderboard() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useGetLeaderboard();
  const entries = data?.entries ?? [];
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

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
          <h1 className="text-lg font-black text-foreground">Weekly Leaderboard</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <>
            <div className="flex justify-center gap-4 items-end h-40">
              {[2, 1, 3].map((r) => <Skeleton key={r} className="w-24 rounded-xl" style={{ height: r === 1 ? 140 : 100 }} />)}
            </div>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </>
        ) : (
          <>
            {/* Podium */}
            {podium.length >= 3 && (
              <div className="flex justify-center gap-3 items-end pt-4" data-testid="leaderboard-podium">
                {[podium[1], podium[0], podium[2]].map((entry, i) => {
                  const rank = entry.rank as 1 | 2 | 3;
                  const colors = MEDAL_COLORS[rank];
                  const heights = { 2: "h-24", 1: "h-36", 3: "h-20" };
                  const h = i === 0 ? heights[2] : i === 1 ? heights[1] : heights[3];

                  return (
                    <div key={entry.userId} className="flex flex-col items-center gap-2" data-testid={`podium-rank-${rank}`}>
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2",
                          entry.isCurrentUser ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
                        )}
                      >
                        {entry.userName[0]?.toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-foreground truncate max-w-[80px] text-center">{entry.userName}</div>
                      <XPDisplay xp={entry.weeklyXp} size="sm" />
                      {/* Podium block */}
                      <div className={cn("w-24 rounded-t-xl flex flex-col items-center justify-start pt-3 gap-1 border-2", h, colors.bg)}>
                        <Medal size={20} className={colors.icon} aria-hidden="true" />
                        <span className={cn("text-2xl font-black", colors.text)}>#{rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Ranked list */}
            <div className="space-y-2" data-testid="leaderboard-list">
              {rest.map((entry) => (
                <div
                  key={entry.userId}
                  data-testid={`leaderboard-entry-${entry.rank}`}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all",
                    entry.isCurrentUser
                      ? "border-primary bg-primary/5 font-bold"
                      : "border-border bg-card"
                  )}
                >
                  <span className="w-8 text-center text-sm font-black text-muted-foreground">#{entry.rank}</span>
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border",
                      entry.isCurrentUser ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-foreground"
                    )}
                  >
                    {entry.userName[0]?.toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-foreground">{entry.userName}</span>
                  <XPDisplay xp={entry.weeklyXp} size="sm" />
                </div>
              ))}
            </div>

            {entries.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Medal size={40} className="mx-auto mb-3 opacity-40" />
                <p>No entries yet. Complete lessons to earn XP!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

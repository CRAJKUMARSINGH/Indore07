import { useParams, useLocation } from "wouter";
import { useGetMe, useGetLesson, getGetLessonQueryKey } from "@workspace/api-client-react";
import { StreakBadge } from "@/components/streak-badge";
import { XPDisplay } from "@/components/xp-display";
import { Button } from "@/components/ui/button";
import { Star, Trophy, ArrowRight } from "lucide-react";

export default function LessonComplete() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id, 10);
  const [, setLocation] = useLocation();
  const { data: user } = useGetMe();
  const { data: lesson } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) },
  });

  const xpEarned = lesson?.xpReward ?? 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/10 flex flex-col items-center justify-center px-4 text-center">
      {/* Celebration icons */}
      <div className="flex gap-3 mb-6">
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            size={i === 1 ? 48 : 36}
            className="text-secondary fill-secondary animate-bounce-in"
            style={{ animationDelay: `${i * 0.1}s` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <Trophy size={64} className="text-primary mb-4 animate-bounce-in" aria-hidden="true" />

      <h1 className="text-3xl font-black text-foreground mb-2">Lesson Complete!</h1>
      <p className="text-muted-foreground mb-8">
        You finished <strong className="text-foreground">{lesson?.title ?? "the lesson"}</strong>.
      </p>

      {/* Stats */}
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xs space-y-4 mb-8 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">XP Earned</span>
          <XPDisplay xp={xpEarned} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">Current Streak</span>
          <StreakBadge streak={user?.streak ?? 0} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">Total XP</span>
          <XPDisplay xp={user?.xp ?? 0} size="sm" />
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button
          className="w-full py-5 font-bold"
          onClick={() => setLocation("/learn")}
          data-testid="button-continue-learning"
        >
          Continue Learning <ArrowRight size={18} className="ml-2" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setLocation("/")}
          data-testid="button-go-home"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

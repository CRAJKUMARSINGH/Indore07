import { useLocation } from "wouter";
import { useGetMe, useListLessons, getListLessonsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Lock, BookOpen, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Learn() {
  const [, setLocation] = useLocation();
  const { data: user } = useGetMe();
  const langId = user?.currentLanguageId ?? "hindi";
  const { data: lessons, isLoading } = useListLessons(
    { languageId: langId },
    { query: { enabled: !!user, queryKey: getListLessonsQueryKey({ languageId: langId }) } }
  );

  const units = lessons
    ? Array.from(new Set(lessons.map((l) => l.unit))).sort()
    : [];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Go back to home"
            onClick={() => setLocation("/")}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            data-testid="button-back-home"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <h1 className="text-lg font-black text-foreground">Lesson Tree</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((u) => (
              <div key={u} className="space-y-4">
                <Skeleton className="h-8 w-40" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          units.map((unit) => {
            const unitLessons = lessons!.filter((l) => l.unit === unit);
            const unitTitle = unitLessons[0]?.unitTitle ?? `Unit ${unit}`;
            return (
              <div key={unit}>
                {/* Unit header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <div className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-sm font-bold">
                    Unit {unit}: {unitTitle}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Lesson nodes — zigzag layout */}
                <div className="space-y-3">
                  {unitLessons.map((lesson, idx) => {
                    const isCompleted = lesson.status === "completed";
                    const isAvailable = lesson.status === "available";
                    const isLocked = lesson.status === "locked";

                    const offsetClass = idx % 3 === 0 ? "ml-0" : idx % 3 === 1 ? "ml-8" : "ml-16";

                    return (
                      <div key={lesson.id} className={cn("flex", offsetClass)}>
                        <button
                          data-testid={`lesson-node-${lesson.id}`}
                          aria-label={`${lesson.title} — ${lesson.status}`}
                          disabled={isLocked}
                          onClick={() => isAvailable && setLocation(`/lesson/${lesson.id}`)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left w-full max-w-xs",
                            isCompleted && "border-accent bg-accent/5 cursor-default",
                            isAvailable && "border-primary bg-primary/5 cursor-pointer animate-node-pulse hover:bg-primary/10",
                            isLocked && "border-muted bg-muted/50 opacity-60 cursor-not-allowed"
                          )}
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                              isCompleted && "bg-accent text-accent-foreground",
                              isAvailable && "bg-primary text-primary-foreground",
                              isLocked && "bg-muted text-muted-foreground"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle size={24} aria-hidden="true" />
                            ) : isAvailable ? (
                              <BookOpen size={24} aria-hidden="true" />
                            ) : (
                              <Lock size={22} aria-hidden="true" />
                            )}
                          </div>
                          {/* Info */}
                          <div>
                            <div className="font-bold text-sm text-foreground">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {lesson.exerciseCount} exercises · +{lesson.xpReward} XP
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {lessons?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No lessons yet for this language.</p>
            <Button variant="outline" className="mt-4" onClick={() => setLocation("/profile")}>
              Switch Language
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

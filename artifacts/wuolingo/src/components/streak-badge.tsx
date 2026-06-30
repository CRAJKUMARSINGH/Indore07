import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ streak, className, size = "md" }: StreakBadgeProps) {
  const sizes = {
    sm: { icon: 14, text: "text-sm", padding: "px-2 py-0.5" },
    md: { icon: 18, text: "text-base", padding: "px-3 py-1" },
    lg: { icon: 24, text: "text-xl", padding: "px-4 py-2" },
  };
  const s = sizes[size];

  return (
    <div
      data-testid="streak-badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold",
        s.padding,
        streak > 0
          ? "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <Flame
        size={s.icon}
        className={streak > 0 ? "text-orange-500" : "text-muted-foreground"}
        aria-hidden="true"
      />
      <span className={s.text}>{streak}</span>
    </div>
  );
}

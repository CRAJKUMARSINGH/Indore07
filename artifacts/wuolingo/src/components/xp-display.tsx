import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPDisplayProps {
  xp: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function XPDisplay({ xp, className, size = "md", label }: XPDisplayProps) {
  const sizes = {
    sm: { icon: 14, text: "text-sm", padding: "px-2 py-0.5" },
    md: { icon: 18, text: "text-base", padding: "px-3 py-1" },
    lg: { icon: 24, text: "text-xl", padding: "px-4 py-2" },
  };
  const s = sizes[size];

  return (
    <div
      data-testid="xp-display"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
        s.padding,
        className
      )}
    >
      <Zap size={s.icon} className="text-yellow-500" aria-hidden="true" />
      <span className={s.text}>
        {xp.toLocaleString()} {label ?? "XP"}
      </span>
    </div>
  );
}

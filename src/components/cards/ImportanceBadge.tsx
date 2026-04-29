import { cn } from "@/lib/utils";

const importanceConfig = {
  1: { label: "了解", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
  2: { label: "熟悉", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-400" },
  3: { label: "掌握", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400" },
  4: { label: "重点", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  5: { label: "核心", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

interface ImportanceBadgeProps {
  level: number;
  showLabel?: boolean;
  className?: string;
}

export function ImportanceBadge({ level, showLabel = true, className }: ImportanceBadgeProps) {
  const clampedLevel = Math.min(5, Math.max(1, Math.round(level))) as 1 | 2 | 3 | 4 | 5;
  const config = importanceConfig[clampedLevel];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        config.color,
        className
      )}
    >
      <span className={cn("flex gap-0.5", config.dot.includes("red") ? "" : "")} aria-hidden>
        {Array.from({ length: clampedLevel }).map((_, i) => (
          <span key={i} className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
        ))}
      </span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export function getImportanceColor(level: number): string {
  const colors = ["#94a3b8", "#4ade80", "#60a5fa", "#fbbf24", "#ef4444"];
  const clampedLevel = Math.min(5, Math.max(1, Math.round(level)));
  return colors[clampedLevel - 1];
}

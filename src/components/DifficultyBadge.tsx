import type { Difficulty } from "@/types";
import { difficultyLabel } from "@/lib/data";

const styles: Record<Difficulty, string> = {
  easy: "border-val-cyan/50 bg-val-cyan/10 text-val-cyan",
  medium: "border-val-gold/50 bg-val-gold/10 text-val-gold",
  hard: "border-val-red/50 bg-val-red/10 text-val-red",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide ${styles[level]}`}
    >
      {difficultyLabel[level]}
    </span>
  );
}

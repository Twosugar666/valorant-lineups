import type { Difficulty } from "@/types";
import { difficultyLabel } from "@/lib/data";

const styles: Record<Difficulty, string> = {
  easy: "border-val-cyan/40 text-val-cyan",
  medium: "border-val-gold/40 text-val-gold",
  hard: "border-val-red/40 text-val-red",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`rounded border px-2 py-0.5 text-xs font-medium ${styles[level]}`}
    >
      {difficultyLabel[level]}
    </span>
  );
}

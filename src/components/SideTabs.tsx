import Link from "next/link";
import type { Side } from "@/types";
import { sideLabel } from "@/lib/data";

export function SideTabs({
  basePath,
  active,
}: {
  basePath: string;
  active: Side;
}) {
  const sides: Side[] = ["attack", "defense"];
  return (
    <div className="flex gap-2">
      {sides.map((side) => (
        <Link
          key={side}
          href={`${basePath}/${side}`}
          className={`clip-corner px-5 py-2 text-sm font-semibold transition ${
            active === side
              ? "bg-val-red text-white"
              : "border border-val-border bg-val-card text-val-muted hover:border-val-red hover:text-foreground"
          }`}
        >
          {sideLabel[side]}
        </Link>
      ))}
    </div>
  );
}

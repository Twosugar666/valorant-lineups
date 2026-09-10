import Image from "next/image";
import Link from "next/link";
import type { Spot } from "@/types";
import {
  getMap,
  getAgent,
  getAbilityName,
  sideLabel,
} from "@/lib/data";
import { DifficultyBadge } from "./DifficultyBadge";
import { TagBadge } from "./TagBadge";

export function SpotCard({ spot }: { spot: Spot }) {
  const map = getMap(spot.mapId);
  const agent = getAgent(spot.agentId);
  const ability = getAbilityName(spot.agentId, spot.abilityId);

  return (
    <Link
      href={`/spots/${spot.id}`}
      className="card-hover clip-corner group flex flex-col overflow-hidden border border-val-border bg-val-card"
    >
      <div className="relative aspect-video bg-val-elevated">
        <Image
          src={spot.images.landing}
          alt={spot.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute left-2 top-2 flex gap-1">
          <span className="rounded bg-val-bg/80 px-2 py-0.5 text-xs text-val-red">
            {sideLabel[spot.side]}
          </span>
          <span className="rounded bg-val-bg/80 px-2 py-0.5 text-xs">
            {spot.site} 点
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug group-hover:text-val-red">
          {spot.title}
        </h3>
        <p className="text-sm text-val-muted">
          {map?.name} · {agent?.name} · {ability}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <DifficultyBadge level={spot.difficulty} />
          {spot.tags.slice(0, 2).map((t) => (
            <TagBadge key={t}>{t}</TagBadge>
          ))}
        </div>
      </div>
    </Link>
  );
}

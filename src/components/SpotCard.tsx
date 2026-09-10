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
import { SmartImage } from "./SmartImage";

export function SpotCard({ spot }: { spot: Spot }) {
  const map = getMap(spot.mapId);
  const agent = getAgent(spot.agentId);
  const ability = getAbilityName(spot.agentId, spot.abilityId);

  return (
    <Link
      href={`/spots/${spot.id}`}
      className="card-hover glass-card group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden bg-val-elevated">
        <SmartImage
          src={spot.images.landing}
          alt={spot.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-val-bg/80 via-transparent to-transparent opacity-80" />
        <div className="absolute left-2 top-2 flex gap-1.5">
          <span className="rounded-sm bg-val-red/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-lg shadow-val-red/20">
            {sideLabel[spot.side]}
          </span>
          <span className="rounded-sm border border-white/10 bg-val-bg/80 px-2 py-0.5 text-[11px] backdrop-blur">
            {spot.site} 点
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug transition group-hover:text-val-red">
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

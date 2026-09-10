import Link from "next/link";
import type { MapInfo } from "@/types";
import { SmartImage } from "./SmartImage";

export function MapCard({ map }: { map: MapInfo }) {
  return (
    <Link
      href={`/maps/${map.id}`}
      className="card-hover glass-card group block overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-val-elevated">
        <SmartImage
          src={map.image}
          alt={map.name}
          fill
          className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          sizes="(max-width:768px) 100vw, 33vw"
          priority={map.inPool === true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-val-bg via-val-bg/40 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {map.inPool ? (
            <span className="rounded-full border border-val-cyan/40 bg-val-bg/75 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-val-cyan backdrop-blur">
              竞技池
            </span>
          ) : (
            <span className="rounded-full border border-val-border bg-val-bg/75 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-val-muted backdrop-blur">
              图库
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold tracking-wide">{map.name}</h3>
          <p className="text-sm text-val-muted">{map.nameEn}</p>
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-val-red/40 bg-val-bg/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-val-red opacity-0 backdrop-blur transition group-hover:opacity-100">
          进入
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <span className="line-clamp-1 text-val-muted">{map.description}</span>
        <span className="shrink-0 font-medium text-val-red transition group-hover:translate-x-0.5">
          点位 →
        </span>
      </div>
    </Link>
  );
}

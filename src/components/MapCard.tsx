import Image from "next/image";
import Link from "next/link";
import type { MapInfo } from "@/types";

export function MapCard({ map }: { map: MapInfo }) {
  return (
    <Link
      href={`/maps/${map.id}`}
      className="card-hover clip-corner group block overflow-hidden border border-val-border bg-val-card"
    >
      <div className="relative aspect-[16/9] bg-val-elevated">
        <Image
          src={map.image}
          alt={map.name}
          fill
          className="object-cover opacity-90 transition group-hover:opacity-100"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-val-bg to-transparent p-4 pt-12">
          <h3 className="text-lg font-bold">{map.name}</h3>
          <p className="text-sm text-val-muted">{map.nameEn}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <span className="text-val-muted">{map.description}</span>
        <span className="shrink-0 text-val-red">点位 →</span>
      </div>
    </Link>
  );
}

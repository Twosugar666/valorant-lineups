import type { Metadata } from "next";
import { maps } from "@/lib/data";
import { MapCard } from "@/components/MapCard";

export const metadata: Metadata = { title: "地图" };

export default function MapsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title text-2xl">地图</h1>
        <p className="mt-4 text-val-muted">
          选择地图 → 进攻/防守 → 英雄 → 查看点位列表
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>
    </div>
  );
}

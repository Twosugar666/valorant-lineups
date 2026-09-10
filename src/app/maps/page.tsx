import type { Metadata } from "next";
import { maps } from "@/lib/data";
import { MapCard } from "@/components/MapCard";

export const metadata: Metadata = { title: "地图" };

export default function MapsPage() {
  const pool = maps.filter((m) => m.inPool);
  const archive = maps.filter((m) => !m.inPool);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="section-title text-2xl">地图</h1>
        <p className="mt-4 text-val-muted">
          选择地图 → 进攻/防守 → 英雄 → 查看点位列表。封面来自无畏契约官网。
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="section-title text-lg">当前竞技池</h2>
          <span className="text-xs text-val-muted">{pool.length} 张 · Act 导向</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pool.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="section-title text-lg">其他地图</h2>
          <span className="text-xs text-val-muted">{archive.length} 张 · 仍可浏览</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {archive.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { filterSpots } from "@/lib/data";
import type { AbilityType, Difficulty, Side } from "@/types";
import { SpotFilters } from "@/components/SpotFilters";
import { SpotCard } from "@/components/SpotCard";

export const metadata: Metadata = { title: "搜索" };

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const results = filterSpots({
    q: first(sp.q),
    mapId: first(sp.mapId),
    agentId: first(sp.agentId),
    side: (first(sp.side) as Side | undefined) ?? "",
    abilityType: (first(sp.abilityType) as AbilityType | undefined) ?? "",
    site: first(sp.site),
    difficulty: (first(sp.difficulty) as Difficulty | undefined) ?? "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">搜索点位</h1>
        <p className="mt-1 text-val-muted">
          按关键词、地图、特工、攻防、技能类型、包点筛选
        </p>
      </div>

      <Suspense fallback={<div className="h-12 animate-pulse bg-val-elevated" />}>
        <SpotFilters />
      </Suspense>

      <p className="text-sm text-val-muted">找到 {results.length} 条点位</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="py-12 text-center text-val-muted">
          没有匹配结果，试试清空部分筛选条件。
        </p>
      )}
    </div>
  );
}

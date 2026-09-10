import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMap,
  getSpotsByMap,
  agents,
  maps,
  sideLabel,
} from "@/lib/data";
import { SideTabs } from "@/components/SideTabs";
import { SpotCard } from "@/components/SpotCard";
import type { Side } from "@/types";

type Props = { params: Promise<{ mapId: string; side: string }> };

const sides: Side[] = ["attack", "defense"];

export async function generateStaticParams() {
  return maps.flatMap((m) =>
    sides.map((side) => ({ mapId: m.id, side }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mapId, side } = await params;
  const map = getMap(mapId);
  const label = sideLabel[side as Side] ?? side;
  return { title: map ? `${map.name} · ${label}` : "地图" };
}

export default async function MapSidePage({ params }: Props) {
  const { mapId, side: sideRaw } = await params;
  const map = getMap(mapId);
  if (!map || !sides.includes(sideRaw as Side)) notFound();
  const side = sideRaw as Side;

  const filtered = getSpotsByMap(mapId).filter((s) => s.side === side);
  const agentIds = [...new Set(filtered.map((s) => s.agentId))];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-val-muted">
          <Link href="/maps" className="hover:text-val-red">
            地图
          </Link>
          {" / "}
          <Link href={`/maps/${mapId}`} className="hover:text-val-red">
            {map.name}
          </Link>
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          {map.name} · {sideLabel[side]}
        </h1>
      </div>

      <SideTabs basePath={`/maps/${mapId}`} active={side} />

      <section>
        <h2 className="mb-3 text-sm font-medium text-val-muted">选择特工</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {agentIds.map((id) => {
            const agent = agents.find((a) => a.id === id);
            if (!agent) return null;
            const count = filtered.filter((s) => s.agentId === id).length;
            return (
              <Link
                key={id}
                href={`/maps/${mapId}/${side}/${id}`}
                className="card-hover clip-corner border border-val-border bg-val-card p-4"
              >
                <p className="font-semibold" style={{ color: agent.color }}>
                  {agent.name}
                </p>
                <p className="text-sm text-val-muted">{count} 条点位</p>
              </Link>
            );
          })}
        </div>
        {agentIds.length === 0 && (
          <p className="text-val-muted">该侧暂无点位，换一侧或换地图试试。</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">点位列表</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </div>
  );
}

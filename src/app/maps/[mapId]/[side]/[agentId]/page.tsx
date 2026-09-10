import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMap,
  getAgent,
  getSpotsByMapSideAgent,
  maps,
  agents,
  sideLabel,
} from "@/lib/data";
import { SpotCard } from "@/components/SpotCard";
import type { Side } from "@/types";

type Props = {
  params: Promise<{ mapId: string; side: string; agentId: string }>;
};

const sides: Side[] = ["attack", "defense"];

export async function generateStaticParams() {
  const params: { mapId: string; side: string; agentId: string }[] = [];
  for (const map of maps) {
    for (const side of sides) {
      for (const agent of agents) {
        params.push({ mapId: map.id, side, agentId: agent.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mapId, side, agentId } = await params;
  const map = getMap(mapId);
  const agent = getAgent(agentId);
  return {
    title:
      map && agent
        ? `${map.name} · ${sideLabel[side as Side] ?? side} · ${agent.name}`
        : "点位",
  };
}

export default async function MapSideAgentPage({ params }: Props) {
  const { mapId, side: sideRaw, agentId } = await params;
  const map = getMap(mapId);
  const agent = getAgent(agentId);
  if (!map || !agent || !sides.includes(sideRaw as Side)) notFound();
  const side = sideRaw as Side;
  const list = getSpotsByMapSideAgent(mapId, side, agentId);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-val-muted">
          <Link href={`/maps/${mapId}`} className="hover:text-val-red">
            {map.name}
          </Link>
          {" / "}
          <Link
            href={`/maps/${mapId}/${side}`}
            className="hover:text-val-red"
          >
            {sideLabel[side]}
          </Link>
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          <span style={{ color: agent.color }}>{agent.name}</span>
          <span className="text-val-muted"> · </span>
          {map.name} {sideLabel[side]}点位
        </h1>
        <p className="mt-1 text-sm text-val-muted">共 {list.length} 条</p>
      </div>

      {list.length === 0 ? (
        <p className="text-val-muted">暂无该组合点位，欢迎在 data/spots.json 中补充。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </div>
  );
}

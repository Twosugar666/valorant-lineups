import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAgent,
  getMap,
  getSpotsByAgentMap,
  agents,
  maps,
  sideLabel,
} from "@/lib/data";
import { SpotCard } from "@/components/SpotCard";

type Props = { params: Promise<{ agentId: string; mapId: string }> };

export async function generateStaticParams() {
  return agents.flatMap((a) =>
    maps.map((m) => ({ agentId: a.id, mapId: m.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentId, mapId } = await params;
  const agent = getAgent(agentId);
  const map = getMap(mapId);
  return {
    title: agent && map ? `${agent.name} · ${map.name}` : "点位",
  };
}

export default async function AgentMapPage({ params }: Props) {
  const { agentId, mapId } = await params;
  const agent = getAgent(agentId);
  const map = getMap(mapId);
  if (!agent || !map) notFound();

  const list = getSpotsByAgentMap(agentId, mapId);
  const attack = list.filter((s) => s.side === "attack");
  const defense = list.filter((s) => s.side === "defense");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-val-muted">
          <Link href={`/agents/${agentId}`} className="hover:text-val-red">
            {agent.name}
          </Link>
          {" / "}
          {map.name}
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          <span style={{ color: agent.color }}>{agent.name}</span>
          <span className="text-val-muted"> @ </span>
          {map.name}
        </h1>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold">{sideLabel.attack}</h2>
        {attack.length === 0 ? (
          <p className="text-sm text-val-muted">暂无进攻点位</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {attack.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">{sideLabel.defense}</h2>
        {defense.length === 0 ? (
          <p className="text-sm text-val-muted">暂无防守点位</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {defense.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

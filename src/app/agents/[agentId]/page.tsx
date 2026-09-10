import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAgent,
  getSpotsByAgent,
  maps,
  agents,
  abilityTypeLabel,
} from "@/lib/data";
import { SpotCard } from "@/components/SpotCard";

type Props = { params: Promise<{ agentId: string }> };

export async function generateStaticParams() {
  return agents.map((a) => ({ agentId: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  return { title: agent ? agent.name : "特工" };
}

export default async function AgentDetailPage({ params }: Props) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();

  const agentSpots = getSpotsByAgent(agentId);
  const mapIds = [...new Set(agentSpots.map((s) => s.mapId))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row">
        <div
          className="relative h-36 w-36 shrink-0 border border-val-border"
          style={{ borderTopColor: agent.color, borderTopWidth: 3 }}
        >
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            className="object-contain p-2"
          />
        </div>
        <div>
          <p className="text-sm text-val-muted">
            {agent.nameEn} · {agent.role}
          </p>
          <h1 className="text-3xl font-bold" style={{ color: agent.color }}>
            {agent.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {agent.abilities.map((ab) => (
              <span
                key={ab.id}
                className="rounded border border-val-border px-2 py-1 text-xs text-val-muted"
              >
                {ab.name}
                <span className="ml-1 text-val-border">·</span>
                <span className="ml-1">{abilityTypeLabel[ab.type]}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-val-muted">
            共 {agentSpots.length} 条点位
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold">选择地图</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {mapIds.map((id) => {
            const map = maps.find((m) => m.id === id);
            if (!map) return null;
            const count = agentSpots.filter((s) => s.mapId === id).length;
            return (
              <Link
                key={id}
                href={`/agents/${agentId}/${id}`}
                className="card-hover clip-corner border border-val-border bg-val-card p-4"
              >
                <p className="font-semibold">{map.name}</p>
                <p className="text-sm text-val-muted">
                  {map.nameEn} · {count} 条
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">全部点位</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </div>
  );
}

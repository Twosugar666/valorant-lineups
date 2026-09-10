import type { Metadata } from "next";
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
import { SmartImage } from "@/components/SmartImage";

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
      <div className="glass-card flex flex-col items-start gap-6 p-6 sm:flex-row">
        <div
          className="relative h-40 w-40 shrink-0 overflow-hidden border border-val-border bg-val-elevated/50"
          style={{ borderTopColor: agent.color, borderTopWidth: 3 }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${agent.color}33, transparent 65%)`,
            }}
          />
          <SmartImage
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
          <div className="mt-4 flex flex-wrap gap-2">
            {agent.abilities.map((ab) => (
              <span
                key={ab.id}
                className="rounded-sm border border-val-border bg-val-bg/40 px-2.5 py-1 text-xs text-val-muted"
              >
                {ab.name}
                <span className="ml-1 text-val-border">·</span>
                <span className="ml-1">{abilityTypeLabel[ab.type]}</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-val-muted">
            共 {agentSpots.length} 条点位
          </p>
        </div>
      </div>

      <section>
        <h2 className="section-title mb-5 text-lg">选择地图</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {mapIds.map((id) => {
            const map = maps.find((m) => m.id === id);
            if (!map) return null;
            const count = agentSpots.filter((s) => s.mapId === id).length;
            return (
              <Link
                key={id}
                href={`/agents/${agentId}/${id}`}
                className="card-hover glass-card p-4"
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
        <h2 className="section-title mb-5 text-lg">全部点位</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </div>
  );
}

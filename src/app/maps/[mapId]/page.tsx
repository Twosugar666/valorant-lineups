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
import { SpotCard } from "@/components/SpotCard";
import { SmartImage } from "@/components/SmartImage";

type Props = { params: Promise<{ mapId: string }> };

export async function generateStaticParams() {
  return maps.map((m) => ({ mapId: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mapId } = await params;
  const map = getMap(mapId);
  return { title: map ? map.name : "地图" };
}

export default async function MapDetailPage({ params }: Props) {
  const { mapId } = await params;
  const map = getMap(mapId);
  if (!map) notFound();

  const mapSpots = getSpotsByMap(mapId);
  const agentIds = [...new Set(mapSpots.map((s) => s.agentId))];

  return (
    <div className="space-y-8">
      <div className="glass-card flex flex-col gap-6 p-5 md:flex-row md:p-6">
        <div className="relative aspect-video w-full overflow-hidden border border-val-border md:w-96">
          <SmartImage src={map.image} alt={map.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm tracking-wide text-val-muted">{map.nameEn}</p>
          <h1 className="text-3xl font-bold">{map.name}</h1>
          <p className="mt-2 text-val-muted">{map.description}</p>
          <p className="mt-2 text-sm text-val-muted">
            包点：{map.sites.join(" / ")} · 共 {mapSpots.length} 条点位
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/maps/${mapId}/attack`}
              className="clip-corner bg-val-red px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-val-red/20"
            >
              {sideLabel.attack}点位
            </Link>
            <Link
              href={`/maps/${mapId}/defense`}
              className="clip-corner border border-val-border px-5 py-2 text-sm font-semibold transition hover:border-val-cyan"
            >
              {sideLabel.defense}点位
            </Link>
          </div>
        </div>
      </div>

      <section>
        <h2 className="section-title mb-5 text-lg">按特工筛选</h2>
        <div className="flex flex-wrap gap-2">
          {agentIds.map((id) => {
            const agent = agents.find((a) => a.id === id);
            if (!agent) return null;
            return (
              <Link
                key={id}
                href={`/maps/${mapId}/attack/${id}`}
                className="rounded-sm border border-val-border bg-val-card/60 px-3 py-1.5 text-sm transition hover:border-val-red hover:shadow-[0_0_12px_rgba(255,70,85,0.15)]"
                style={{ color: agent.color }}
              >
                {agent.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="section-title mb-5 text-lg">本图全部点位</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mapSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </div>
  );
}

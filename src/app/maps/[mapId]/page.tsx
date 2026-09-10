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
        <div className="w-full md:w-96">
          <div className="relative aspect-video w-full overflow-hidden border border-val-border">
            <SmartImage src={map.image} alt={map.name} fill className="object-cover" priority />
          </div>
          <p className="mt-2 text-xs text-val-muted">
            图片来源：{map.source ?? "无畏契约官网"}
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-sm tracking-wide text-val-muted">{map.nameEn}</p>
            {map.inPool ? (
              <span className="rounded-full border border-val-cyan/40 bg-val-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-val-cyan">
                当前竞技池
              </span>
            ) : (
              <span className="rounded-full border border-val-border px-2 py-0.5 text-[10px] font-semibold text-val-muted">
                非当前竞技池（仍可浏览）
              </span>
            )}
          </div>
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
        <h2 className="section-title mb-5 text-lg">按英雄筛选</h2>
        <div className="flex flex-wrap gap-2">
          {agentIds.length === 0 ? (
            <p className="text-sm text-val-muted">本图暂无收录点位，封面与信息仍可浏览。</p>
          ) : (
            agentIds.map((id) => {
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
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title mb-5 text-lg">本图全部点位</h2>
        {mapSpots.length === 0 ? (
          <p className="text-sm text-val-muted">点位内容建设中，可先查看其他竞技池地图。</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mapSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSpot,
  getMap,
  getAgent,
  getAbilityName,
  spots,
  sideLabel,
  abilityTypeLabel,
} from "@/lib/data";
import { ImageGallery } from "@/components/ImageGallery";
import { StepList } from "@/components/StepList";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { TagBadge } from "@/components/TagBadge";

type Props = { params: Promise<{ spotId: string }> };

export async function generateStaticParams() {
  return spots.map((s) => ({ spotId: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { spotId } = await params;
  const spot = getSpot(spotId);
  return { title: spot ? spot.title : "点位详情" };
}

export default async function SpotDetailPage({ params }: Props) {
  const { spotId } = await params;
  const spot = getSpot(spotId);
  if (!spot) notFound();

  const map = getMap(spot.mapId);
  const agent = getAgent(spot.agentId);
  const ability = getAbilityName(spot.agentId, spot.abilityId);
  const hasStepImages = spot.steps.some((s) => s.image);

  return (
    <article className="space-y-10">
      <header className="glass-card space-y-4 p-6 md:p-8">
        <p className="text-sm text-val-muted">
          <Link href={`/maps/${spot.mapId}`} className="hover:text-val-red">
            {map?.name}
          </Link>
          {" · "}
          <Link
            href={`/agents/${spot.agentId}`}
            className="hover:text-val-red"
            style={{ color: agent?.color }}
          >
            {agent?.name}
          </Link>
          {" · "}
          {sideLabel[spot.side]}
        </p>
        <h1 className="text-3xl font-bold md:text-4xl">{spot.title}</h1>
        <p className="max-w-2xl leading-relaxed text-val-muted">{spot.description}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="rounded-sm bg-val-red/90 px-2.5 py-0.5 text-xs font-semibold text-white shadow shadow-val-red/20">
            {sideLabel[spot.side]}
          </span>
          <span className="rounded-sm border border-val-border bg-val-elevated/60 px-2.5 py-0.5 text-xs">
            {spot.site} 点
          </span>
          <span className="rounded-sm border border-val-border bg-val-elevated/60 px-2.5 py-0.5 text-xs">
            {ability} · {abilityTypeLabel[spot.abilityType]}
          </span>
          <DifficultyBadge level={spot.difficulty} />
          {spot.tags.map((t) => (
            <TagBadge key={t}>{t}</TagBadge>
          ))}
        </div>
      </header>

      <section>
        <h2 className="section-title mb-5 text-lg">图示 · 站位 / 准星 / 落点</h2>
        <ImageGallery images={spot.images} />
        <p className="mt-3 text-xs text-val-muted">
          当前为示意原图（非游戏截图），可将实机截图按 README 说明替换到
          public/placeholders/
        </p>
      </section>

      <section>
        <h2 className="section-title mb-5 text-lg">
          操作步骤{hasStepImages ? "（每步配图）" : ""}
        </h2>
        <div className="glass-card p-5 md:p-7">
          <StepList steps={spot.steps} />
        </div>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href={`/maps/${spot.mapId}/${spot.side}/${spot.agentId}`}
          className="text-val-red transition hover:underline"
        >
          ← 同图同侧同特工更多点位
        </Link>
        <Link
          href={`/agents/${spot.agentId}/${spot.mapId}`}
          className="text-val-muted transition hover:text-val-cyan"
        >
          该特工在本图全部点位
        </Link>
      </div>
    </article>
  );
}

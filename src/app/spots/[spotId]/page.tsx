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
    <article className="space-y-8">
      <header className="space-y-3">
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
        <h1 className="text-3xl font-bold">{spot.title}</h1>
        <p className="max-w-2xl text-val-muted">{spot.description}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="rounded bg-val-red/15 px-2 py-0.5 text-xs text-val-red">
            {sideLabel[spot.side]}
          </span>
          <span className="rounded border border-val-border px-2 py-0.5 text-xs">
            {spot.site} 点
          </span>
          <span className="rounded border border-val-border px-2 py-0.5 text-xs">
            {ability} · {abilityTypeLabel[spot.abilityType]}
          </span>
          <DifficultyBadge level={spot.difficulty} />
          {spot.tags.map((t) => (
            <TagBadge key={t}>{t}</TagBadge>
          ))}
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-bold">图示 · 站位 / 准星 / 落点</h2>
        <ImageGallery images={spot.images} />
        <p className="mt-2 text-xs text-val-muted">
          当前为示意原图（非游戏截图），可将实机截图按 README 说明替换到
          public/placeholders/
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">
          操作步骤{hasStepImages ? "（每步配图）" : ""}
        </h2>
        <div className="border border-val-border bg-val-card p-5">
          <StepList steps={spot.steps} />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href={`/maps/${spot.mapId}/${spot.side}/${spot.agentId}`}
          className="text-val-red hover:underline"
        >
          ← 同图同侧同特工更多点位
        </Link>
        <Link
          href={`/agents/${spot.agentId}/${spot.mapId}`}
          className="text-val-muted hover:text-val-cyan"
        >
          该特工在本图全部点位
        </Link>
      </div>
    </article>
  );
}

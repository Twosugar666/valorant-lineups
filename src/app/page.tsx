import Link from "next/link";
import { maps, agents, getFeaturedSpots, spots } from "@/lib/data";
import { MapCard } from "@/components/MapCard";
import { AgentCard } from "@/components/AgentCard";
import { SpotCard } from "@/components/SpotCard";

export default function HomePage() {
  const featured = getFeaturedSpots();

  return (
    <div className="space-y-16">
      <section className="hero-panel p-8 md:p-14">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rotate-12 bg-val-red/15 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-8 h-32 w-32 rounded-full bg-val-cyan/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 hidden h-24 w-24 border border-val-red/30 md:block" />
        <div className="pointer-events-none absolute right-16 top-16 hidden h-24 w-24 border border-val-border/60 md:block" />

        <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-val-red">
          VALORANT LINEUPS
        </p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl md:leading-[1.15]">
          无畏契约
          <span className="text-val-red">道具点位</span>
          指南
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-val-muted md:text-lg">
          按地图或英雄浏览进攻 / 防守技能线。每条点位含站位、准星、落点图示与逐步说明，方便开黑前速查。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/maps"
            className="clip-corner bg-val-red px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-val-red/25 transition hover:bg-val-red-dim"
          >
            从地图开始
          </Link>
          <Link
            href="/agents"
            className="clip-corner border border-val-border bg-val-bg/40 px-6 py-2.5 text-sm font-semibold backdrop-blur transition hover:border-val-red"
          >
            从英雄开始
          </Link>
          <Link
            href="/search"
            className="clip-corner border border-val-border px-6 py-2.5 text-sm font-semibold text-val-muted transition hover:border-val-cyan hover:text-val-cyan"
          >
            搜索点位
          </Link>
          <Link
            href="/ask"
            className="clip-corner border border-val-cyan/30 px-6 py-2.5 text-sm font-semibold text-val-cyan transition hover:bg-val-cyan/10"
          >
            AI 问答
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="stat-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-val-red" />
            {maps.length} 张地图
          </span>
          <span className="stat-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-val-cyan" />
            {agents.length} 名英雄
          </span>
          <span className="stat-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-val-gold" />
            {spots.length} 条点位
          </span>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="section-title text-xl">精选点位</h2>
          <Link href="/search" className="text-sm text-val-red transition hover:underline">
            查看全部
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="section-title text-xl">地图</h2>
          <Link href="/maps" className="text-sm text-val-red transition hover:underline">
            全部地图
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {maps.filter((m) => m.inPool).map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="section-title text-xl">英雄</h2>
          <Link href="/agents" className="text-sm text-val-red transition hover:underline">
            全部英雄
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
}

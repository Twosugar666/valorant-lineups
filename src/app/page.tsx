import Link from "next/link";
import { maps, agents, getFeaturedSpots, spots } from "@/lib/data";
import { MapCard } from "@/components/MapCard";
import { AgentCard } from "@/components/AgentCard";
import { SpotCard } from "@/components/SpotCard";

export default function HomePage() {
  const featured = getFeaturedSpots();

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden border border-val-border bg-val-card p-8 md:p-12">
        <div className="absolute -right-8 -top-8 h-40 w-40 rotate-12 bg-val-red/20" />
        <p className="mb-2 text-sm font-medium tracking-widest text-val-red">
          VALORANT LINEUPS
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight md:text-4xl">
          瓦罗兰特道具点位指南
        </h1>
        <p className="mt-4 max-w-2xl text-val-muted">
          按地图或特工浏览进攻 / 防守技能线。每条点位含站位、准星、落点图示与逐步说明，方便开黑前速查。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/maps"
            className="clip-corner bg-val-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-val-red-dim"
          >
            从地图开始
          </Link>
          <Link
            href="/agents"
            className="clip-corner border border-val-border px-5 py-2.5 text-sm font-semibold hover:border-val-red"
          >
            从特工开始
          </Link>
          <Link
            href="/search"
            className="clip-corner border border-val-border px-5 py-2.5 text-sm font-semibold text-val-muted hover:border-val-cyan hover:text-val-cyan"
          >
            搜索点位
          </Link>
        </div>
        <p className="mt-6 text-sm text-val-muted">
          已收录 {maps.length} 张地图 · {agents.length} 名特工 · {spots.length}{" "}
          条点位
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold">精选点位</h2>
          <Link href="/search" className="text-sm text-val-red hover:underline">
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
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold">地图</h2>
          <Link href="/maps" className="text-sm text-val-red hover:underline">
            全部地图
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {maps.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold">特工</h2>
          <Link href="/agents" className="text-sm text-val-red hover:underline">
            全部特工
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

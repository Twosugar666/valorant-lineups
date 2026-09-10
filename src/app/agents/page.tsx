import type { Metadata } from "next";
import { agents } from "@/lib/data";
import { AgentCard } from "@/components/AgentCard";

export const metadata: Metadata = { title: "英雄" };

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title text-2xl">英雄</h1>
        <p className="mt-4 text-val-muted">
          选择英雄 → 地图 → 查看该英雄在该图的道具点位
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

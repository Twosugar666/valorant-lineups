import Link from "next/link";
import type { AgentInfo } from "@/types";
import { SmartImage } from "./SmartImage";

export function AgentCard({ agent }: { agent: AgentInfo }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="card-hover glass-card group relative flex flex-col overflow-hidden"
      style={{ borderTopColor: agent.color, borderTopWidth: 3 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${agent.color}22, transparent 60%)`,
        }}
      />
      <div className="relative mx-auto mt-5 h-28 w-28 overflow-hidden rounded-sm border border-val-border/60 bg-val-elevated/40">
        <SmartImage
          src={agent.image}
          alt={agent.name}
          fill
          className="object-cover object-top transition duration-300 group-hover:scale-105"
          sizes="112px"
        />
      </div>
      <div className="relative p-4 text-center">
        <h3 className="font-bold tracking-wide" style={{ color: agent.color }}>
          {agent.name}
        </h3>
        <p className="mt-0.5 text-xs text-val-muted">
          {agent.nameEn} · {agent.role}
        </p>
      </div>
    </Link>
  );
}

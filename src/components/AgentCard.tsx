import Image from "next/image";
import Link from "next/link";
import type { AgentInfo } from "@/types";

export function AgentCard({ agent }: { agent: AgentInfo }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="card-hover clip-corner flex flex-col overflow-hidden border border-val-border bg-val-card"
      style={{ borderTopColor: agent.color, borderTopWidth: 3 }}
    >
      <div className="relative mx-auto mt-4 h-28 w-28">
        <Image
          src={agent.image}
          alt={agent.name}
          fill
          className="object-contain"
          sizes="112px"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold" style={{ color: agent.color }}>
          {agent.name}
        </h3>
        <p className="text-sm text-val-muted">
          {agent.nameEn} · {agent.role}
        </p>
      </div>
    </Link>
  );
}

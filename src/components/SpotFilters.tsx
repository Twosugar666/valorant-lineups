"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { maps, agents, abilityTypeLabel } from "@/lib/data";
import type { AbilityType } from "@/types";

const abilityTypes = Object.keys(abilityTypeLabel) as AbilityType[];

export function SpotFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      startTransition(() => {
        router.push(`/search?${next.toString()}`);
      });
    },
    [params, router]
  );

  const selectClass =
    "rounded border border-val-border bg-val-elevated px-3 py-2 text-sm text-foreground outline-none focus:border-val-red";

  return (
    <div
      className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 ${pending ? "opacity-70" : ""}`}
    >
      <input
        type="search"
        placeholder="搜索点位、特工、标签…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        className={`${selectClass} xl:col-span-2`}
      />
      <select
        value={params.get("mapId") ?? ""}
        onChange={(e) => update("mapId", e.target.value)}
        className={selectClass}
      >
        <option value="">全部地图</option>
        {maps.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <select
        value={params.get("agentId") ?? ""}
        onChange={(e) => update("agentId", e.target.value)}
        className={selectClass}
      >
        <option value="">全部特工</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <select
        value={params.get("side") ?? ""}
        onChange={(e) => update("side", e.target.value)}
        className={selectClass}
      >
        <option value="">攻 / 防</option>
        <option value="attack">进攻</option>
        <option value="defense">防守</option>
      </select>
      <select
        value={params.get("abilityType") ?? ""}
        onChange={(e) => update("abilityType", e.target.value)}
        className={selectClass}
      >
        <option value="">技能类型</option>
        {abilityTypes.map((t) => (
          <option key={t} value={t}>
            {abilityTypeLabel[t]}
          </option>
        ))}
      </select>
      <select
        value={params.get("site") ?? ""}
        onChange={(e) => update("site", e.target.value)}
        className={selectClass}
      >
        <option value="">包点 / 区域</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="中路">中路</option>
      </select>
    </div>
  );
}

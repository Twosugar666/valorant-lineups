import mapsData from "../../data/maps.json";
import agentsData from "../../data/agents.json";
import spotsData from "../../data/spots.json";
import type {
  MapInfo,
  AgentInfo,
  Spot,
  Side,
  AbilityType,
  Difficulty,
} from "@/types";

export const maps = mapsData as MapInfo[];
export const agents = agentsData as AgentInfo[];
export const spots = spotsData as Spot[];

export function getMap(id: string): MapInfo | undefined {
  return maps.find((m) => m.id === id);
}

export function getAgent(id: string): AgentInfo | undefined {
  return agents.find((a) => a.id === id);
}

export function getSpot(id: string): Spot | undefined {
  return spots.find((s) => s.id === id);
}

export function getSpotsByMap(mapId: string): Spot[] {
  return spots.filter((s) => s.mapId === mapId);
}

export function getSpotsByAgent(agentId: string): Spot[] {
  return spots.filter((s) => s.agentId === agentId);
}

export function getSpotsByMapSideAgent(
  mapId: string,
  side: Side,
  agentId: string
): Spot[] {
  return spots.filter(
    (s) => s.mapId === mapId && s.side === side && s.agentId === agentId
  );
}

export function getSpotsByAgentMap(agentId: string, mapId: string): Spot[] {
  return spots.filter((s) => s.agentId === agentId && s.mapId === mapId);
}

export function getFeaturedSpots(): Spot[] {
  return spots.filter((s) => s.featured);
}

export function getAbilityName(agentId: string, abilityId: string): string {
  const agent = getAgent(agentId);
  return agent?.abilities.find((a) => a.id === abilityId)?.name ?? abilityId;
}

export interface SpotFilters {
  q?: string;
  mapId?: string;
  agentId?: string;
  side?: Side | "";
  abilityType?: AbilityType | "";
  site?: string;
  difficulty?: Difficulty | "";
}

export function filterSpots(filters: SpotFilters): Spot[] {
  const q = filters.q?.trim().toLowerCase();
  return spots.filter((s) => {
    if (filters.mapId && s.mapId !== filters.mapId) return false;
    if (filters.agentId && s.agentId !== filters.agentId) return false;
    if (filters.side && s.side !== filters.side) return false;
    if (filters.abilityType && s.abilityType !== filters.abilityType)
      return false;
    if (filters.site && s.site !== filters.site) return false;
    if (filters.difficulty && s.difficulty !== filters.difficulty) return false;
    if (q) {
      const map = getMap(s.mapId);
      const agent = getAgent(s.agentId);
      const hay = [
        s.title,
        s.description,
        s.site,
        ...s.tags,
        map?.name,
        map?.nameEn,
        agent?.name,
        agent?.nameEn,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const sideLabel: Record<Side, string> = {
  attack: "进攻",
  defense: "防守",
};

export const difficultyLabel: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export const abilityTypeLabel: Record<AbilityType, string> = {
  smoke: "烟雾",
  flash: "闪光",
  molly: "燃烧/伤害",
  recon: "侦察",
  wall: "墙/屏障",
  trap: "陷阱/装置",
  other: "其他",
};

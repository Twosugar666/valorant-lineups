export type Side = "attack" | "defense";
export type Difficulty = "easy" | "medium" | "hard";
export type AbilityType =
  | "smoke"
  | "flash"
  | "molly"
  | "recon"
  | "wall"
  | "trap"
  | "other";

export interface MapInfo {
  id: string;
  name: string;
  nameEn: string;
  sites: string[];
  image: string;
  description: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  image: string;
  abilities: { id: string; name: string; type: AbilityType }[];
  color: string;
}

export interface SpotStep {
  order: number;
  text: string;
  tip?: string;
  /** Optional per-step instructional image path */
  image?: string;
}

export interface SpotImages {
  position: string; // 站位
  crosshair: string; // 准星
  landing: string; // 落点
}

export interface Spot {
  id: string;
  title: string;
  mapId: string;
  agentId: string;
  side: Side;
  abilityId: string;
  abilityType: AbilityType;
  site: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  steps: SpotStep[];
  images: SpotImages;
  featured?: boolean;
}

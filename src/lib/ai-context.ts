import { maps, agents, spots, sideLabel } from "@/lib/data";

/** Short site catalog for the system prompt (maps / agents / spot titles). */
export function buildSiteCatalog(): string {
  const mapLines = maps
    .map((m) => `- ${m.name}（${m.nameEn}, id=${m.id}）包点: ${m.sites.join("/")}`)
    .join("\n");

  const agentLines = agents
    .map((a) => {
      const abs = a.abilities.map((x) => `${x.name}(${x.id}/${x.type})`).join("、");
      return `- ${a.name}（${a.nameEn}, id=${a.id}, ${a.role}）技能: ${abs}`;
    })
    .join("\n");

  const spotLines = spots
    .map((s) => {
      const map = maps.find((m) => m.id === s.mapId)?.name ?? s.mapId;
      const agent = agents.find((a) => a.id === s.agentId)?.name ?? s.agentId;
      return `- [${s.id}] ${s.title}｜${map}｜${agent}｜${sideLabel[s.side]}｜${s.site}｜难度${s.difficulty}`;
    })
    .join("\n");

  return [
    "【本站已收录地图】",
    mapLines,
    "",
    "【本站已收录特工】",
    agentLines,
    "",
    "【本站点位目录（可引导用户打开 /spots/{id} 或 /maps、/agents）】",
    spotLines,
  ].join("\n");
}

export const SYSTEM_PROMPT = `你是「瓦罗兰特点位指南」网站的中文道具点位教练助手。

职责：
- 用简洁、实用的中文回答关于瓦罗兰特（Valorant）地图、特工、进攻/防守道具线（lineup）的问题。
- 优先结合本站已收录的地图、特工与点位目录作答；相关时请建议用户浏览站内页面：/maps、/agents、/spots/{spotId}、/search。
- 不确定时明确说明，不要编造精确到准星像素的虚假点位细节当作事实；可给一般思路，并引导用户查看本站图文步骤。
- 不要编造本站不存在的点位 ID；若站内没有精确条目，请如实说明并给通用建议。
- 回答保持简短清晰，分点列出步骤时尽量精炼。

以下是本站数据摘要：
`;

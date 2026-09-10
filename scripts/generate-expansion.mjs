#!/usr/bin/env node
/**
 * Generate expanded maps/agents/spots + original SVG placeholders.
 * All Chinese copy is original; SVGs are schematic instructional diagrams.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");
const PUBLIC = path.join(ROOT, "public");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mapSvg(name, nameEn, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#0f1923"/>
  <rect x="40" y="40" width="560" height="280" fill="#1a2332" stroke="${color}" stroke-width="2"/>
  <text x="320" y="175" text-anchor="middle" fill="${color}" font-family="system-ui,sans-serif" font-size="36" font-weight="700">${escapeXml(name)}</text>
  <text x="320" y="220" text-anchor="middle" fill="#8b9bb4" font-family="system-ui,sans-serif" font-size="20">${escapeXml(nameEn)}</text>
</svg>
`;
}

function agentSvg(name, nameEn, role, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#0f1923"/>
  <circle cx="200" cy="160" r="70" fill="none" stroke="${color}" stroke-width="4"/>
  <circle cx="200" cy="160" r="40" fill="${color}" opacity="0.3"/>
  <text x="200" y="280" text-anchor="middle" fill="${color}" font-family="system-ui,sans-serif" font-size="32" font-weight="700">${escapeXml(name)}</text>
  <text x="200" y="320" text-anchor="middle" fill="#8b9bb4" font-family="system-ui,sans-serif" font-size="16">${escapeXml(nameEn)} · ${escapeXml(role)}</text>
</svg>
`;
}

function placeholderSvg({ kind, title, mapName, agentName, sideLabel, stepLabel, accent }) {
  const kindLabels = {
    position: "站位",
    crosshair: "准星",
    landing: "落点",
    step: stepLabel || "步骤",
  };
  const main = kindLabels[kind] || kind;
  const shapes =
    kind === "crosshair"
      ? `<line x1="480" y1="160" x2="480" y2="280" stroke="${accent}" stroke-width="2"/>
  <line x1="420" y1="220" x2="540" y2="220" stroke="${accent}" stroke-width="2"/>
  <circle cx="480" cy="220" r="36" fill="none" stroke="${accent}" stroke-width="2" opacity="0.7"/>`
      : kind === "landing"
        ? `<ellipse cx="480" cy="250" rx="90" ry="40" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="6 4"/>
  <circle cx="480" cy="250" r="10" fill="${accent}"/>
  <path d="M480 180 L460 230 L500 230 Z" fill="${accent}" opacity="0.85"/>`
        : kind === "step"
          ? `<rect x="360" y="160" width="240" height="140" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="10 6"/>
  <circle cx="480" cy="230" r="28" fill="${accent}" opacity="0.25"/>
  <text x="480" y="238" text-anchor="middle" fill="${accent}" font-family="system-ui,sans-serif" font-size="22" font-weight="700">${escapeXml(stepLabel || "")}</text>`
          : `<circle cx="480" cy="220" r="48" fill="none" stroke="${accent}" stroke-width="3" opacity="0.8"/>
  <circle cx="480" cy="220" r="8" fill="${accent}"/>
  <path d="M480 120 L480 170" stroke="${accent}" stroke-width="3" marker-end="url(#arrow)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1923"/>
      <stop offset="100%" stop-color="#1a2332"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="${accent}"/>
    </marker>
  </defs>
  <rect width="960" height="540" fill="url(#bg)"/>
  <rect x="24" y="24" width="912" height="492" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="8 6" opacity="0.55"/>
  ${shapes}
  <text x="480" y="360" text-anchor="middle" fill="${accent}" font-family="system-ui,sans-serif" font-size="34" font-weight="700">${escapeXml(main)}</text>
  <text x="480" y="400" text-anchor="middle" fill="#8b9bb4" font-family="system-ui,sans-serif" font-size="16">${escapeXml(title)}</text>
  <text x="480" y="432" text-anchor="middle" fill="#5a6a80" font-family="system-ui,sans-serif" font-size="13">${escapeXml(mapName)} · ${escapeXml(agentName)} · ${escapeXml(sideLabel)} · 示意原图</text>
  <text x="480" y="462" text-anchor="middle" fill="#3d4a5c" font-family="system-ui,sans-serif" font-size="12">可替换为实机截图 · 非游戏截图搬运</text>
</svg>
`;
}

const maps = [
  {
    id: "abyss",
    name: "幽邃地窟",
    nameEn: "Abyss",
    sites: ["A", "B"],
    image: "/maps/abyss.svg",
    description: "无边界深渊图，滑索与悬崖决定走位，道具可逼人落崖。",
    color: "#6b8cff",
  },
  {
    id: "ascent",
    name: "亚海悬城",
    nameEn: "Ascent",
    sites: ["A", "B"],
    image: "/maps/ascent.svg",
    description: "中路开阔，门可开关，经典竞技地图。",
    color: "#30c78a",
  },
  {
    id: "haven",
    name: "天堂",
    nameEn: "Haven",
    sites: ["A", "B", "C"],
    image: "/maps/haven.svg",
    description: "三点图，防守需灵活轮换，道具点位极多。",
    color: "#e8a838",
  },
  {
    id: "lotus",
    name: "莲华古城",
    nameEn: "Lotus",
    sites: ["A", "B", "C"],
    image: "/maps/lotus.svg",
    description: "三包点与旋转门，侧路偷袭与转点节奏独特。",
    color: "#c084fc",
  },
  {
    id: "split",
    name: "分裂",
    nameEn: "Split",
    sites: ["A", "B"],
    image: "/maps/split.svg",
    description: "垂直空间丰富，天台与绳索决定控图节奏。",
    color: "#f472b6",
  },
  {
    id: "summit",
    name: "天枢云阙",
    nameEn: "Summit",
    sites: ["A", "B"],
    image: "/maps/summit.svg",
    description: "三路结构与下落门机关，控门与高低差是关键。",
    color: "#38bdf8",
  },
  {
    id: "sunset",
    name: "日落之城",
    nameEn: "Sunset",
    sites: ["A", "B"],
    image: "/maps/sunset.svg",
    description: "城市巷战，中路与侧街交织，执行烟墙要求清晰。",
    color: "#fb923c",
  },
  {
    id: "bind",
    name: "裂变峡谷",
    nameEn: "Bind",
    sites: ["A", "B"],
    image: "/maps/bind.svg",
    description: "双传送门连接 A/B，无中路，适合练习与娱乐排位。",
    color: "#a3e635",
  },
];

const agents = [
  {
    id: "sova",
    name: "索瓦",
    nameEn: "Sova",
    role: "先锋",
    color: "#3d7eff",
    abilities: [
      { id: "recon", name: "侦察箭头", type: "recon" },
      { id: "shock", name: "震荡箭", type: "molly" },
      { id: "drone", name: "Owl 无人机", type: "recon" },
    ],
  },
  {
    id: "fade",
    name: "菲朵",
    nameEn: "Fade",
    role: "先锋",
    color: "#8b5cf6",
    abilities: [
      { id: "haunt", name: "萦绕", type: "recon" },
      { id: "seize", name: "捕获", type: "other" },
      { id: "prowler", name: "潜行者", type: "recon" },
    ],
  },
  {
    id: "gekko",
    name: "壁虎",
    nameEn: "Gekko",
    role: "先锋",
    color: "#84cc16",
    abilities: [
      { id: "dizzy", name: "眩晕球", type: "flash" },
      { id: "mosh", name: "泥潭", type: "molly" },
      { id: "wingman", name: "翼手", type: "other" },
    ],
  },
  {
    id: "kayo",
    name: "KAY/O",
    nameEn: "KAY/O",
    role: "先锋",
    color: "#94a3b8",
    abilities: [
      { id: "knife", name: "抑制刀", type: "other" },
      { id: "flash", name: "闪光弹", type: "flash" },
      { id: "frag", name: "破片手雷", type: "molly" },
    ],
  },
  {
    id: "breach",
    name: "破坏者",
    nameEn: "Breach",
    role: "先锋",
    color: "#f59e0b",
    abilities: [
      { id: "flash", name: "闪光冲击", type: "flash" },
      { id: "faultline", name: "断层线", type: "other" },
      { id: "aftershock", name: "余震", type: "molly" },
    ],
  },
  {
    id: "skye",
    name: "斯凯",
    nameEn: "Skye",
    role: "先锋",
    color: "#22c55e",
    abilities: [
      { id: "flash", name: "引路者", type: "flash" },
      { id: "trailblazer", name: "探路者", type: "recon" },
      { id: "seekers", name: "搜寻者", type: "recon" },
    ],
  },
  {
    id: "tejo",
    name: "钛狐",
    nameEn: "Tejo",
    role: "先锋",
    color: "#ea580c",
    abilities: [
      { id: "drone", name: "潜袭爬虫", type: "recon" },
      { id: "strike", name: "特快专递", type: "molly" },
      { id: "guided", name: "制导打击", type: "other" },
    ],
  },
  {
    id: "viper",
    name: "蝰蛇",
    nameEn: "Viper",
    role: "控场",
    color: "#30c78a",
    abilities: [
      { id: "poison-cloud", name: "毒云", type: "smoke" },
      { id: "snake-bite", name: "蛇咬", type: "molly" },
      { id: "toxic-screen", name: "毒幕", type: "wall" },
    ],
  },
  {
    id: "omen",
    name: "幽影",
    nameEn: "Omen",
    role: "控场",
    color: "#6366f1",
    abilities: [
      { id: "smoke", name: "暗影帷幕", type: "smoke" },
      { id: "paranoia", name: "偏执", type: "flash" },
      { id: "tp", name: "暗影步", type: "other" },
    ],
  },
  {
    id: "brimstone",
    name: "铁臂",
    nameEn: "Brimstone",
    role: "控场",
    color: "#e8a838",
    abilities: [
      { id: "sky-smoke", name: "天空烟雾", type: "smoke" },
      { id: "incendiary", name: "燃烧弹", type: "molly" },
      { id: "stim", name: "激励信标", type: "other" },
    ],
  },
  {
    id: "astra",
    name: "星璇",
    nameEn: "Astra",
    role: "控场",
    color: "#a855f7",
    abilities: [
      { id: "star-smoke", name: "星云", type: "smoke" },
      { id: "pull", name: "引力井", type: "other" },
      { id: "nova", name: "新星脉冲", type: "flash" },
    ],
  },
  {
    id: "harbor",
    name: "海港",
    nameEn: "Harbor",
    role: "控场",
    color: "#0ea5e9",
    abilities: [
      { id: "cove", name: "海湾", type: "smoke" },
      { id: "cascade", name: "瀑布", type: "wall" },
      { id: "high-tide", name: "高潮", type: "wall" },
    ],
  },
  {
    id: "clove",
    name: "丁香",
    nameEn: "Clove",
    role: "控场",
    color: "#ec4899",
    abilities: [
      { id: "smoke", name: "冥烟", type: "smoke" },
      { id: "meddle", name: "搅局", type: "other" },
      { id: "ruse", name: "诈死烟", type: "smoke" },
    ],
  },
  {
    id: "killjoy",
    name: "零",
    nameEn: "Killjoy",
    role: "哨兵",
    color: "#f0d84a",
    abilities: [
      { id: "nanoswarm", name: "纳米群", type: "molly" },
      { id: "alarmbot", name: "报警机器人", type: "trap" },
      { id: "turret", name: "炮台", type: "trap" },
    ],
  },
  {
    id: "cypher",
    name: "赛菲尔特",
    nameEn: "Cypher",
    role: "哨兵",
    color: "#c4b5a0",
    abilities: [
      { id: "cage", name: "陷阱牢笼", type: "smoke" },
      { id: "spycam", name: "间谍摄像头", type: "recon" },
      { id: "tripwire", name: "陷阱线", type: "trap" },
    ],
  },
  {
    id: "chamber",
    name: "尚勃尔",
    nameEn: "Chamber",
    role: "哨兵",
    color: "#fbbf24",
    abilities: [
      { id: "trademark", name: "商标", type: "trap" },
      { id: "tp", name: "会合", type: "other" },
      { id: "headhunter", name: "猎首", type: "other" },
    ],
  },
  {
    id: "sage",
    name: "贤者",
    nameEn: "Sage",
    role: "哨兵",
    color: "#67e8f9",
    abilities: [
      { id: "wall", name: "屏障之球", type: "wall" },
      { id: "slow", name: "减速力场", type: "other" },
      { id: "heal", name: "治疗之珠", type: "other" },
    ],
  },
  {
    id: "deadlock",
    name: "死锁",
    nameEn: "Deadlock",
    role: "哨兵",
    color: "#cbd5e1",
    abilities: [
      { id: "barrier", name: "声波屏障", type: "wall" },
      { id: "gravnet", name: "引力网", type: "trap" },
      { id: "sensor", name: "声波感应", type: "trap" },
    ],
  },
  {
    id: "jett",
    name: "捷风",
    nameEn: "Jett",
    role: "决斗",
    color: "#e0f2fe",
    abilities: [
      { id: "updraft", name: "升腾", type: "other" },
      { id: "dash", name: "顺风", type: "other" },
      { id: "smoke", name: "云雾", type: "smoke" },
    ],
  },
  {
    id: "raze",
    name: "雷兹",
    nameEn: "Raze",
    role: "决斗",
    color: "#f97316",
    abilities: [
      { id: "satchel", name: "爆破包", type: "other" },
      { id: "nade", name: "涂料手雷", type: "molly" },
      { id: "bot", name: "轰击机器人", type: "recon" },
    ],
  },
  {
    id: "neon",
    name: "霓虹",
    nameEn: "Neon",
    role: "决斗",
    color: "#22d3ee",
    abilities: [
      { id: "slide", name: "高速滑行", type: "other" },
      { id: "wall", name: "电墙", type: "wall" },
      { id: "stun", name: "眩光", type: "flash" },
    ],
  },
  {
    id: "yoru",
    name: "夜露",
    nameEn: "Yoru",
    role: "决斗",
    color: "#3b82f6",
    abilities: [
      { id: "tp", name: "次元门", type: "other" },
      { id: "flash", name: "致盲", type: "flash" },
      { id: "clone", name: "分身", type: "recon" },
    ],
  },
  {
    id: "phoenix",
    name: "菲尼克斯",
    nameEn: "Phoenix",
    role: "决斗",
    color: "#ef4444",
    abilities: [
      { id: "flash", name: "曲线闪光", type: "flash" },
      { id: "wall", name: "火墙", type: "wall" },
      { id: "molly", name: "热力灼烧", type: "molly" },
    ],
  },
  {
    id: "reyna",
    name: "蕾娜",
    nameEn: "Reyna",
    role: "决斗",
    color: "#a21caf",
    abilities: [
      { id: "leer", name: "蔑视", type: "flash" },
      { id: "devour", name: "吞噬", type: "other" },
      { id: "dismiss", name: "驱逐", type: "other" },
    ],
  },
  {
    id: "iso",
    name: "壹决",
    nameEn: "Iso",
    role: "决斗",
    color: "#818cf8",
    abilities: [
      { id: "shield", name: "动能护盾", type: "other" },
      { id: "vulnerable", name: "脆弱余波", type: "other" },
      { id: "wall", name: "双重墙", type: "wall" },
    ],
  },
  {
    id: "waylay",
    name: "幻棱",
    nameEn: "Waylay",
    role: "决斗",
    color: "#f472b6",
    abilities: [
      { id: "flash", name: "光棱闪爆", type: "flash" },
      { id: "dash", name: "光速飞跃", type: "other" },
      { id: "recall", name: "溯流回光", type: "other" },
    ],
  },
].map((a) => ({ ...a, image: `/agents/${a.id}.svg` }));

const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));
const mapById = Object.fromEntries(maps.map((m) => [m.id, m]));

function stepsWithImages(spotId, stepDefs) {
  return stepDefs.map((s, i) => {
    const order = s.order ?? i + 1;
    const step = {
      order,
      text: s.text,
      image: `/placeholders/${spotId}-step${order}.svg`,
    };
    if (s.tip) step.tip = s.tip;
    return step;
  });
}

function makeSpot(partial) {
  const id = partial.id;
  const steps = stepsWithImages(id, partial.steps);
  return {
    ...partial,
    steps,
    images: {
      position: `/placeholders/${id}-position.svg`,
      crosshair: `/placeholders/${id}-crosshair.svg`,
      landing: `/placeholders/${id}-landing.svg`,
    },
  };
}

/** Spot definition helpers producing original Chinese instructional copy */
const S = {
  recon(map, site, side, where, aim, land, tip) {
    return {
      abilityId: "recon",
      abilityType: "recon",
      site,
      side,
      difficulty: tip?.diff || "easy",
      tags: tip?.tags || ["信息", "默认"],
      title: tip?.title || `${site} 点侦察箭（${side === "attack" ? "进攻" : "防守"}）`,
      description:
        tip?.desc ||
        `在 ${map.name} 的 ${site} 区域放出侦察箭，扫描常见蹲位与包点角落，为队友提供开局或回防信息。`,
      steps: [
        { text: `移动到${where}，站稳后再掏出侦察箭。`, tip: "先确认侧路无敌人。" },
        { text: `准星对准${aim}。`, tip: tip?.charge || "按充能次数调整弧线。" },
        { text: "确认充能后放出箭头，避免撞到近处遮挡。" },
        { text: `箭头落点应覆盖${land}，根据亮点决定是否强攻或转点。` },
      ],
    };
  },
};

function buildSpots() {
  const spots = [];
  const add = (p) => spots.push(makeSpot(p));

  // ========== Per competitive map: dense coverage ==========
  const competitive = ["abyss", "ascent", "haven", "lotus", "split", "summit", "sunset"];

  // ASPECT templates applied per map with localized place names
  const locales = {
    ascent: {
      aMain: "A 主路入口左侧墙边",
      aHeaven: "A 天堂楼梯口",
      aSite: "A 包点中央与天堂",
      bMain: "B 主入口门框右侧",
      bGreen: "B 绿区与包点角落",
      midCat: "中路猫道出口",
      mid: "中路",
      aShort: "A 短外侧",
      bWindow: "B 窗外侧",
    },
    haven: {
      aMain: "A 长道拐角外墙",
      aHeaven: "A 天堂平台边缘",
      aSite: "A 包点与天堂",
      bMain: "B 窗前掩体后",
      bGreen: "B 窗与包点内侧",
      midCat: "中路车库口",
      mid: "中路",
      aShort: "A 短道入口",
      bWindow: "B 窗外安全位",
      cLong: "C 长道箱体旁",
      cSite: "C 包点与连杆",
    },
    split: {
      aMain: "A 主路斜坡下",
      aHeaven: "A 天堂绳索旁",
      aSite: "A 包点与天堂",
      bMain: "B 主路箱后",
      bGreen: "B 包点与后巷",
      midCat: "中路缝隙口",
      mid: "中路",
      aShort: "A 雨水槽外侧",
      bWindow: "B 天台入口",
    },
    lotus: {
      aMain: "A 主路旋转门外侧",
      aHeaven: "A 高台楼梯",
      aSite: "A 包点与后点",
      bMain: "B 树庭入口",
      bGreen: "B 包点两侧角落",
      midCat: "中路破坏墙旁",
      mid: "中路",
      aShort: "A 侧路窄道",
      bWindow: "B 侧窗",
      cLong: "C 主路拐角",
      cSite: "C 包点与连杆",
    },
    sunset: {
      aMain: "A 主街转角",
      aHeaven: "A 市场二楼口",
      aSite: "A 包点与市场",
      bMain: "B 巷道箱体旁",
      bGreen: "B 包点与后街",
      midCat: "中路餐厅门口",
      mid: "中路",
      aShort: "A 短道入口",
      bWindow: "B 窗位外侧",
    },
    abyss: {
      aMain: "A 主路滑索前平台",
      aHeaven: "A 高台边缘（注意悬崖）",
      aSite: "A 包点与后桥",
      bMain: "B 主路箱后",
      bGreen: "B 包点与侧桥",
      midCat: "中路桥头",
      mid: "中路",
      aShort: "A 侧桥入口",
      bWindow: "B 高台外侧",
    },
    summit: {
      aMain: "A 主路下落门外侧",
      aHeaven: "A 高台楼梯口",
      aSite: "A 包点与后门",
      bMain: "B 主路掩体后",
      bGreen: "B 包点与侧廊",
      midCat: "中路下落门旁",
      mid: "中路",
      aShort: "A 侧廊入口",
      bWindow: "B 高窗外侧",
    },
    bind: {
      aMain: "A 短入口外侧",
      aHeaven: "A 灯位旁墙",
      aSite: "A 包点与天堂",
      bMain: "B 长道拐角",
      bGreen: "B 包点与钩子",
      midCat: "A 传送出口",
      mid: "传送区",
      aShort: "A 短外侧",
      bWindow: "B 窗外侧",
    },
  };

  for (const mapId of [...competitive, "bind"]) {
    const map = mapById[mapId];
    const L = locales[mapId];
    const is3 = map.sites.includes("C");

    // --- SOVA attack A recon ---
    add({
      id: `${mapId}-sova-a-recon-attack`,
      mapId,
      agentId: "sova",
      side: "attack",
      abilityId: "recon",
      abilityType: "recon",
      site: "A",
      difficulty: "easy",
      tags: ["默认", "开局", "信息"],
      featured: mapId === "ascent" || mapId === "haven" || mapId === "lotus",
      title: "A 包点侦察箭（进攻）",
      description: `从进攻方安全位抛出侦察箭，扫清 ${map.name} A 点常见蹲位，适合默认推进前获取信息。`,
      steps: [
        { text: `站在${L.aMain}，背靠掩体站稳。`, tip: "脚尖对齐地砖或墙线。" },
        { text: "准星对准远处屋顶/横梁边缘参照物。", tip: "常用一跳一充或两充不跳。" },
        { text: "确认充能后放出箭头，避免撞到近处门框。" },
        { text: `箭头落点覆盖${L.aSite}，根据亮点决定是否执行。` },
      ],
    });

    // SOVA attack B shock / recon
    add({
      id: `${mapId}-sova-b-shock-attack`,
      mapId,
      agentId: "sova",
      side: "attack",
      abilityId: "shock",
      abilityType: "molly",
      site: "B",
      difficulty: "medium",
      tags: ["清点", "爆发"],
      title: "B 点震荡清点",
      description: `进攻 ${map.name} B 时用震荡箭清理常见角落，逼出防守方。`,
      steps: [
        { text: `靠近${L.bMain}，站在可安全掏箭的位置。` },
        { text: "准星瞄向包点上方参照物，两充或三充按练习调整。", tip: "先在自定义房校准弧线。" },
        { text: "放出后震荡覆盖绿区/角落，队友同步压枪位。" },
        { text: "听脚步决定补第二支震荡或转侦察。" },
      ],
    });

    // SOVA defense mid/A recon
    add({
      id: `${mapId}-sova-mid-recon-defense`,
      mapId,
      agentId: "sova",
      side: "defense",
      abilityId: "recon",
      abilityType: "recon",
      site: L.mid.includes("中") ? "中路" : map.sites[0],
      difficulty: "easy",
      tags: ["防守", "信息", "默认"],
      title: "中路回防侦察箭",
      description: `防守回合用侦察箭扫描 ${map.name} 中路与转点路线，提前发现偷人。`,
      steps: [
        { text: `站在己方出生侧靠近${L.midCat}的安全墙边。` },
        { text: "准星对准中路天花板缝隙或灯管参照。", tip: "一充或两充即可。" },
        { text: "放出后观察亮点，呼叫队友轮换。" },
        { text: "若无信息，改用无人机短侦侧路。" },
      ],
    });

    // FADE attack haunt
    add({
      id: `${mapId}-fade-a-haunt-attack`,
      mapId,
      agentId: "fade",
      side: "attack",
      abilityId: "haunt",
      abilityType: "recon",
      site: "A",
      difficulty: "easy",
      tags: ["信息", "开局"],
      featured: mapId === "haven" || mapId === "sunset",
      title: "A 点萦绕开局",
      description: `进攻 A 前用萦绕标记敌人，配合捕获限制撤离路线。`,
      steps: [
        { text: `站在${L.aMain}外侧，面向包点方向。` },
        { text: "将萦绕抛向包点上方空域，让其下落扫描。", tip: "注意别撞到门楣。" },
        { text: "出现足迹后立刻用捕获封锁出口。" },
        { text: "队友根据标记推进，你补潜行者清角。" },
      ],
    });

    // FADE defense seize
    add({
      id: `${mapId}-fade-b-seize-defense`,
      mapId,
      agentId: "fade",
      side: "defense",
      abilityId: "seize",
      abilityType: "other",
      site: "B",
      difficulty: "medium",
      tags: ["防守", "控制"],
      title: "B 点捕获拖延",
      description: `听到 B 推声后用捕获定住进攻方，方便队友回防。`,
      steps: [
        { text: `预站在可看到${L.bGreen}的防守位，或快速回防途中。` },
        { text: "朝包点入口地面扔出捕获。", tip: "提前预瞄入口地面。" },
        { text: "定住后补潜行者或枪线，逼对方出烟。" },
        { text: "若已下包，捕获用于拖延拆包节奏。" },
      ],
    });

    // GEKKO attack dizzy
    add({
      id: `${mapId}-gekko-a-dizzy-attack`,
      mapId,
      agentId: "gekko",
      side: "attack",
      abilityId: "dizzy",
      abilityType: "flash",
      site: "A",
      difficulty: "easy",
      tags: ["闪光", "执行"],
      title: "A 点眩晕球执行",
      description: `执行进点前用眩晕球晃开防守准星，并记得回收球。`,
      steps: [
        { text: `站在${L.aShort}，队友准备跟枪。` },
        { text: "将眩晕球弹墙或直抛进包点视野区。", tip: "弹墙可避免被秒。" },
        { text: "听到眩晕生效后立刻进点清角。" },
        { text: "安全时捡回球体，准备下一波转点。" },
      ],
    });

    // GEKKO defense mosh
    add({
      id: `${mapId}-gekko-b-mosh-defense`,
      mapId,
      agentId: "gekko",
      side: "defense",
      abilityId: "mosh",
      abilityType: "molly",
      site: "B",
      difficulty: "easy",
      tags: ["保包", "拖延"],
      title: "B 点泥潭保包",
      description: `防守拆包阶段将泥潭覆盖包点，逼进攻方离开。`,
      steps: [
        { text: `回防到${L.bWindow}或包点侧安全位。` },
        { text: "朝包点中心抛出泥潭。", tip: "可先虚晃再实扔。" },
        { text: "泥潭扩散期间用枪线封锁离开路线。" },
        { text: "若未拆完，补翼手或等待队友交叉火力。" },
      ],
    });

    // KAYO attack knife + flash combo conceptually as knife spot
    add({
      id: `${mapId}-kayo-a-knife-attack`,
      mapId,
      agentId: "kayo",
      side: "attack",
      abilityId: "knife",
      abilityType: "other",
      site: "A",
      difficulty: "medium",
      tags: ["抑制", "执行"],
      featured: mapId === "ascent" || mapId === "split",
      title: "A 点抑制刀开团",
      description: `进点前扔抑制刀，切断防守方烟墙与侦察技能。`,
      steps: [
        { text: `站在${L.aMain}，确认侧路安全。` },
        { text: "准星对准包点上空，抛出抑制刀。", tip: "刀落地后有短暂生效窗。" },
        { text: "队友同时放烟/闪光，你补破片手雷清角。" },
        { text: "抑制结束后注意对方可能立刻补烟，准备第二波。" },
      ],
    });

    // KAYO defense flash
    add({
      id: `${mapId}-kayo-mid-flash-defense`,
      mapId,
      agentId: "kayo",
      side: "defense",
      abilityId: "flash",
      abilityType: "flash",
      site: "中路",
      difficulty: "easy",
      tags: ["闪光", "控中"],
      title: "中路弹墙闪",
      description: `防守中路时用弹墙闪光晃开过中敌人。`,
      steps: [
        { text: `站在${L.midCat}己方侧掩体后。` },
        { text: "将闪光弹向侧墙弹出，越过墙角照到对面。", tip: "弹墙比直抛更安全。" },
        { text: "闪光生效瞬间 peek 或让队友 peek。" },
        { text: "若对方强推，补抑制刀拖延。" },
      ],
    });

    // VIPER attack screen
    add({
      id: `${mapId}-viper-a-screen-attack`,
      mapId,
      agentId: "viper",
      side: "attack",
      abilityId: "toxic-screen",
      abilityType: "wall",
      site: "A",
      difficulty: "medium",
      tags: ["墙", "执行"],
      featured: mapId === "bind" || mapId === "abyss" || mapId === "summit",
      title: "A 点毒幕推进",
      description: `用毒幕隔断 A 点关键视线，方便队友沿墙内侧执行。`,
      steps: [
        { text: `站在${L.aShort}，面向包点拉墙。` },
        { text: "毒幕覆盖天堂/灯位等常见枪线。", tip: "墙落地后再开毒，节省毒条。" },
        { text: "队友沿毒幕内侧推进，你负责补毒云或蛇咬。" },
        { text: "下包后用蛇咬拖延拆包，注意毒条管理。" },
      ],
    });

    // VIPER defense molly
    add({
      id: `${mapId}-viper-b-molly-defense`,
      mapId,
      agentId: "viper",
      side: "defense",
      abilityId: "snake-bite",
      abilityType: "molly",
      site: "B",
      difficulty: "easy",
      tags: ["保包", "延迟"],
      title: "B 点蛇咬保包",
      description: `防守 B 拆包时从安全位扔蛇咬覆盖包点。`,
      steps: [
        { text: `站在${L.bWindow}安全位置。` },
        { text: "准星对准包点中心地面扔出蛇咬。", tip: "可预瞄包点标记。" },
        { text: "蛇咬燃烧期间用枪线封锁离开点。" },
        { text: "若有毒云，可叠加封拆。" },
      ],
    });

    // OMEN attack smokes
    add({
      id: `${mapId}-omen-a-smoke-attack`,
      mapId,
      agentId: "omen",
      side: "attack",
      abilityId: "smoke",
      abilityType: "smoke",
      site: "A",
      difficulty: "easy",
      tags: ["烟", "执行", "默认"],
      featured: mapId === "lotus" || mapId === "sunset" || mapId === "summit",
      title: "A 点单手烟执行",
      description: `用暗影帷幕封住 A 点关键枪线，配合偏执进点。`,
      steps: [
        { text: "打开烟技能，从安全位标记天堂/后点等枪线。" },
        { text: "放出烟雾后告知队友「烟好」。", tip: "深烟可贴墙减少被穿。" },
        { text: "用偏执扫过入口，队友同步推点。" },
        { text: "需要时暗影步上高位或假动作骗枪线。" },
      ],
    });

    // OMEN defense smoke retake
    add({
      id: `${mapId}-omen-b-smoke-defense`,
      mapId,
      agentId: "omen",
      side: "defense",
      abilityId: "smoke",
      abilityType: "smoke",
      site: "B",
      difficulty: "easy",
      tags: ["回防", "烟"],
      title: "B 点回防烟",
      description: `回防 B 时用烟隔断包点视野，创造安全落点。`,
      steps: [
        { text: "听到 B 喊点后立刻标记包点入口与后点烟位。" },
        { text: "烟落地后从侧路或传送靠近。", tip: "可配合暗影步绕后。" },
        { text: "偏执扫过烟边缘，再交叉 peek。" },
        { text: "拆包前再补一颗拖延烟。" },
      ],
    });

    // BRIM attack smokes
    add({
      id: `${mapId}-brim-a-smoke-attack`,
      mapId,
      agentId: "brimstone",
      side: "attack",
      abilityId: "sky-smoke",
      abilityType: "smoke",
      site: "A",
      difficulty: "easy",
      tags: ["烟", "执行"],
      title: "A 点天空烟执行",
      description: `用地图技能精准封住 A 点天堂与后点，适合标准执行。`,
      steps: [
        { text: "打开铁臂地图界面，标记天堂与后点烟位。" },
        { text: "确认队友集合后再放出烟雾。", tip: "可留一颗烟应对转点。" },
        { text: "进点后用燃烧弹清常见角落。" },
        { text: "下包阶段燃烧弹拖延拆包。" },
      ],
    });

    // BRIM mid smoke
    add({
      id: `${mapId}-brim-mid-smoke-attack`,
      mapId,
      agentId: "brimstone",
      side: "attack",
      abilityId: "sky-smoke",
      abilityType: "smoke",
      site: "中路",
      difficulty: "easy",
      tags: ["控中", "默认", "烟"],
      title: "中路控图烟",
      description: `用天空烟雾封住中路关键出口，方便默认或转点。`,
      steps: [
        { text: "打开地图技能，在中路出口放置烟雾。" },
        { text: `覆盖${L.midCat}附近枪线。` },
        { text: "队友过中时你用激励信标支援。" },
        { text: "若假打中路，保留燃烧弹给真实执行点。" },
      ],
    });

    // ASTRA stars
    add({
      id: `${mapId}-astra-a-smoke-attack`,
      mapId,
      agentId: "astra",
      side: "attack",
      abilityId: "star-smoke",
      abilityType: "smoke",
      site: "A",
      difficulty: "medium",
      tags: ["烟", "星位"],
      title: "A 点星云执行",
      description: `开局预放星星，执行时一键星云封枪线。`,
      steps: [
        { text: "购买阶段在星界预放天堂与后点星星。" },
        { text: "执行时切换星界激活星云。", tip: "留一颗星做引力井。" },
        { text: "需要时对新星脉冲晃开入口。" },
        { text: "下包后用引力井干扰拆包。" },
      ],
    });

    // CLOVE smoke
    add({
      id: `${mapId}-clove-b-smoke-attack`,
      mapId,
      agentId: "clove",
      side: "attack",
      abilityId: "smoke",
      abilityType: "smoke",
      site: "B",
      difficulty: "easy",
      tags: ["烟", "灵活"],
      title: "B 点冥烟推进",
      description: `用冥烟快速封 B 点枪线，阵亡后仍可补烟续攻。`,
      steps: [
        { text: `站在${L.bMain}安全位放出冥烟。` },
        { text: "烟封住后点与侧路后喊执行。" },
        { text: "用搅局干扰近战防守者。" },
        { text: "若阵亡，立刻用死后烟掩护队友下包。" },
      ],
    });

    // HARBOR wall
    add({
      id: `${mapId}-harbor-a-cascade-attack`,
      mapId,
      agentId: "harbor",
      side: "attack",
      abilityId: "cascade",
      abilityType: "wall",
      site: "A",
      difficulty: "medium",
      tags: ["墙", "执行"],
      title: "A 点瀑布墙推进",
      description: `用水墙隔断视线并缓慢推进，适合配合决斗位进点。`,
      steps: [
        { text: `站在${L.aMain}，沿入口放出瀑布。` },
        { text: "墙体隔断天堂枪线后队友跟墙推进。", tip: "可用海湾给拆包护盾。" },
        { text: "需要时补高潮覆盖更大面积。" },
        { text: "下包后海湾罩住拆包位。" },
      ],
    });

    // KILLJOY defense nano
    add({
      id: `${mapId}-kj-a-nano-defense`,
      mapId,
      agentId: "killjoy",
      side: "defense",
      abilityId: "nanoswarm",
      abilityType: "molly",
      site: "A",
      difficulty: "easy",
      tags: ["后置", "保包", "延迟"],
      featured: mapId === "ascent" || mapId === "haven" || mapId === "lotus",
      title: "A 包点后置纳米群",
      description: `将纳米群藏在包点后墙，敌方下包或拆包时引爆。`,
      steps: [
        { text: `站在${L.aHeaven}附近，面向包点。` },
        { text: "纳米群扔到包点后方箱体与墙角夹缝。", tip: "尽量贴墙，避免被提前发现。" },
        { text: "炮台或报警机器人放在辅路。" },
        { text: "听到下包或拆包音效后立即激活纳米群。" },
      ],
    });

    // KILLJOY turret
    add({
      id: `${mapId}-kj-b-turret-defense`,
      mapId,
      agentId: "killjoy",
      side: "defense",
      abilityId: "turret",
      abilityType: "trap",
      site: "B",
      difficulty: "easy",
      tags: ["信息", "防守"],
      title: "B 点炮台预警",
      description: `炮台覆盖 B 入口，配合报警机器人形成双保险。`,
      steps: [
        { text: "将炮台放在能看到主入口但不被轻易砸掉的位置。" },
        { text: "报警机器人藏在侧路或箱后。", tip: "避免同位置被一颗手雷清掉。" },
        { text: "听到炮台开火立刻回防或呼叫支援。" },
        { text: "纳米群留作保包。" },
      ],
    });

    // CYPHER trip
    add({
      id: `${mapId}-cypher-a-trip-defense`,
      mapId,
      agentId: "cypher",
      side: "defense",
      abilityId: "tripwire",
      abilityType: "trap",
      site: "A",
      difficulty: "easy",
      tags: ["陷阱", "信息"],
      title: "A 点陷阱线封锁",
      description: `用陷阱线封锁 A 侧路，摄像头提供额外信息。`,
      steps: [
        { text: "在侧路或入口低处布置陷阱线。", tip: "高度以绊脚为准，避免过高。" },
        { text: "摄像头放在可看主路的掩体后。" },
        { text: "牢笼预放在包点拐角，触发时启用。" },
        { text: "触线后立刻补枪或呼叫轮换。" },
      ],
    });

    // CYPHER cam
    add({
      id: `${mapId}-cypher-b-cam-defense`,
      mapId,
      agentId: "cypher",
      side: "defense",
      abilityId: "spycam",
      abilityType: "recon",
      site: "B",
      difficulty: "medium",
      tags: ["摄像头", "信息"],
      title: "B 点摄像头盯点",
      description: `摄像头覆盖 B 主路，单守时也能获得信息。`,
      steps: [
        { text: `将摄像头贴在${L.bMain}附近不易被发现的墙面。` },
        { text: "陷阱线封锁辅路，防止绕后。" },
        { text: "开镜观察时保持移动听声，避免被偷。" },
        { text: "发现推点立刻牢笼减速并后撤。" },
      ],
    });

    // CHAMBER trademark
    add({
      id: `${mapId}-chamber-a-trap-defense`,
      mapId,
      agentId: "chamber",
      side: "defense",
      abilityId: "trademark",
      abilityType: "trap",
      site: "A",
      difficulty: "easy",
      tags: ["陷阱", "锚点"],
      title: "A 点商标锚点",
      description: `商标封锁侧路，配合会合传送形成安全锚点。`,
      steps: [
        { text: "商标放在侧路地面，覆盖偷人路线。" },
        { text: "会合锚点放在可撤退的安全掩体后。", tip: "传送后立刻重新架枪。" },
        { text: "听到商标触发，决定对枪或传送撤离。" },
        { text: "残局用猎首远程点杀。" },
      ],
    });

    // SAGE wall
    add({
      id: `${mapId}-sage-a-wall-defense`,
      mapId,
      agentId: "sage",
      side: "defense",
      abilityId: "wall",
      abilityType: "wall",
      site: "A",
      difficulty: "easy",
      tags: ["墙", "拖延"],
      featured: mapId === "split" || mapId === "abyss",
      title: "A 点屏障拖延",
      description: `用屏障封住 A 主路，争取轮转换人时间。`,
      steps: [
        { text: `站在${L.aHeaven}或包点侧，面向主路。` },
        { text: "升起屏障完全封堵主路入口。", tip: "可留缝骗对方浪费技能。" },
        { text: "减速力场放在墙后或侧路。" },
        { text: "墙破后后撤，保留治疗给残局。" },
      ],
    });

    // DEADLOCK barrier
    add({
      id: `${mapId}-deadlock-b-barrier-defense`,
      mapId,
      agentId: "deadlock",
      side: "defense",
      abilityId: "barrier",
      abilityType: "wall",
      site: "B",
      difficulty: "medium",
      tags: ["墙", "防守"],
      title: "B 点声波屏障",
      description: `声波屏障封锁 B 入口，配合引力网抓激进敌人。`,
      steps: [
        { text: "在 B 主入口放置声波屏障。" },
        { text: "引力网预放在可能跳跃越过的位置。", tip: "网住后立刻补枪。" },
        { text: "声波感应覆盖辅路。" },
        { text: "屏障被打破后后撤到第二防守位。" },
      ],
    });

    // JETT attack dash entry
    add({
      id: `${mapId}-jett-a-dash-attack`,
      mapId,
      agentId: "jett",
      side: "attack",
      abilityId: "dash",
      abilityType: "other",
      site: "A",
      difficulty: "medium",
      tags: ["突入", "开点"],
      title: "A 点顺风突入",
      description: `烟落地后顺风进点抢第一枪，升腾可上高位。`,
      steps: [
        { text: "等控场烟封住关键枪线。" },
        { text: "云雾丢向入口，遮挡第一视角。" },
        { text: "顺风冲入包点清最近角落。", tip: "保留升腾用于撤离或上天堂。" },
        { text: "拿下空间后报点，让队友跟枪。" },
      ],
    });

    // RAZE satchel
    add({
      id: `${mapId}-raze-b-satchel-attack`,
      mapId,
      agentId: "raze",
      side: "attack",
      abilityId: "satchel",
      abilityType: "other",
      site: "B",
      difficulty: "hard",
      tags: ["位移", "突入"],
      title: "B 点爆破包进点",
      description: `用爆破包快速位移进 B，涂料手雷清角。`,
      steps: [
        { text: `站在${L.bMain}外，预瞄第一落点。` },
        { text: "扔出爆破包并引爆，飞入包点。", tip: "自定义房练习落点，避免摔死。" },
        { text: "落地立刻涂料手雷清常见角落。" },
        { text: "轰击机器人可清深位，再叫队友跟进。" },
      ],
    });

    // NEON wall
    add({
      id: `${mapId}-neon-a-wall-attack`,
      mapId,
      agentId: "neon",
      side: "attack",
      abilityId: "wall",
      abilityType: "wall",
      site: "A",
      difficulty: "medium",
      tags: ["墙", "突入"],
      title: "A 点电墙冲点",
      description: `电墙隔断枪线后高速滑行进点。`,
      steps: [
        { text: `站在${L.aMain}，放出电墙封天堂视线。` },
        { text: "眩光晃开入口后开启滑行。" },
        { text: "滑入包点优先清近角。", tip: "滑行结束立刻刹停对枪。" },
        { text: "空间打开后报点等队友。" },
      ],
    });

    // YORU flash/tp
    add({
      id: `${mapId}-yoru-a-flash-attack`,
      mapId,
      agentId: "yoru",
      side: "attack",
      abilityId: "flash",
      abilityType: "flash",
      site: "A",
      difficulty: "medium",
      tags: ["闪光", "欺骗"],
      title: "A 点致盲骗枪",
      description: `致盲配合分身或次元门，制造错位开点。`,
      steps: [
        { text: "将致盲弹墙打进包点视野。" },
        { text: "同时放出分身吸引枪声。" },
        { text: "闪光生效后 peek 或次元门绕后。", tip: "传送落地先听声再开枪。" },
        { text: "成功开点后呼叫队友执行。" },
      ],
    });

    // PHOENIX flash
    add({
      id: `${mapId}-phoenix-a-flash-attack`,
      mapId,
      agentId: "phoenix",
      side: "attack",
      abilityId: "flash",
      abilityType: "flash",
      site: "A",
      difficulty: "easy",
      tags: ["闪光", "开点"],
      title: "A 点曲线闪开点",
      description: `曲线闪光绕过墙角，火墙分割包点。`,
      steps: [
        { text: `站在${L.aShort}墙角外。` },
        { text: "曲线闪光弹墙照到防守位。", tip: "闪后立刻 peek，别等太久。" },
        { text: "火墙封住侧路，热力灼烧清角。" },
        { text: "进点后用火墙给自己回血空间。" },
      ],
    });

    // REYNA leer
    add({
      id: `${mapId}-reyna-b-leer-attack`,
      mapId,
      agentId: "reyna",
      side: "attack",
      abilityId: "leer",
      abilityType: "flash",
      site: "B",
      difficulty: "easy",
      tags: ["闪光", "对枪"],
      title: "B 点蔑视对枪",
      description: `蔑视封视野后强peek，击杀掉用吞噬续航。`,
      steps: [
        { text: `靠近${L.bMain}，队友准备补枪。` },
        { text: "朝入口扔出蔑视。", tip: "贴地扔可减少被开枪。" },
        { text: "蔑视生效后立刻对枪最近目标。" },
        { text: "击杀掉后吞噬或驱逐调整位置。" },
      ],
    });

    // ISO wall
    add({
      id: `${mapId}-iso-a-wall-attack`,
      mapId,
      agentId: "iso",
      side: "attack",
      abilityId: "wall",
      abilityType: "wall",
      site: "A",
      difficulty: "medium",
      tags: ["墙", "对枪"],
      title: "A 点双重墙强瞄",
      description: `双重墙分割空间，动能护盾下强行对枪。`,
      steps: [
        { text: "在入口放出双重墙，隔断侧路枪线。" },
        { text: "开启动能护盾准备换人。" },
        { text: "脆弱余波打出后同步 peek。", tip: "打中余波再对枪优势更大。" },
        { text: "清完近角呼叫队友下包。" },
      ],
    });

    // WAYLAY flash
    add({
      id: `${mapId}-waylay-a-flash-attack`,
      mapId,
      agentId: "waylay",
      side: "attack",
      abilityId: "flash",
      abilityType: "flash",
      site: "A",
      difficulty: "medium",
      tags: ["闪光", "位移"],
      title: "A 点光棱闪进点",
      description: `光棱闪爆干扰后光速飞跃进点，不顺可溯流回光。`,
      steps: [
        { text: `站在${L.aMain}准备进点。` },
        { text: "放出光棱闪爆干扰防守准星。" },
        { text: "光速飞跃冲入近角。", tip: "飞跃前确认烟已封远枪线。" },
        { text: "若遇交叉火力，立刻溯流回光撤出。" },
      ],
    });

    // TEJO recon/strike
    add({
      id: `${mapId}-tejo-a-drone-attack`,
      mapId,
      agentId: "tejo",
      side: "attack",
      abilityId: "drone",
      abilityType: "recon",
      site: "A",
      difficulty: "easy",
      tags: ["信息", "压制"],
      title: "A 点潜袭爬虫侦察",
      description: `用潜袭爬虫探路并压制，再接特快专递清角。`,
      steps: [
        { text: `在${L.aMain}放出潜袭爬虫，遥控探入。` },
        { text: "发现敌人后触发脉冲压制。", tip: "别把爬虫送进已知雷区。" },
        { text: "用特快专递打击常见蹲位。" },
        { text: "信息明确后呼叫队友执行。" },
      ],
    });

    // BREACH flash execute
    add({
      id: `${mapId}-breach-a-flash-attack`,
      mapId,
      agentId: "breach",
      side: "attack",
      abilityId: "flash",
      abilityType: "flash",
      site: "A",
      difficulty: "easy",
      tags: ["闪光", "执行"],
      title: "A 点穿墙闪执行",
      description: `穿墙闪光冲击开点，断层线清空近战位。`,
      steps: [
        { text: `站在${L.aMain}墙后，对准包点方向。` },
        { text: "放出闪光冲击，穿墙致盲防守方。", tip: "闪后口头倒数再推。" },
        { text: "断层线扫过入口地面。" },
        { text: "余震清箱后/角落，队友同步进点。" },
      ],
    });

    // SKYE flash
    add({
      id: `${mapId}-skye-b-flash-attack`,
      mapId,
      agentId: "skye",
      side: "attack",
      abilityId: "flash",
      abilityType: "flash",
      site: "B",
      difficulty: "easy",
      tags: ["闪光", "协助"],
      title: "B 点引路者闪光",
      description: `遥控引路者进 B 闪光，探路者清深位。`,
      steps: [
        { text: `站在${L.bMain}外侧放出引路者。` },
        { text: "控制飞入包点后闪光。", tip: "闪光时可自己不看，避免自闪。" },
        { text: "探路者清箱后或侧路。" },
        { text: "确认安全后呼叫执行，保留搜寻者残局。" },
      ],
    });

    // 3-site map extras for C
    if (is3) {
      add({
        id: `${mapId}-sova-c-recon-attack`,
        mapId,
        agentId: "sova",
        side: "attack",
        abilityId: "recon",
        abilityType: "recon",
        site: "C",
        difficulty: "medium",
        tags: ["信息", "C点"],
        featured: mapId === "haven",
        title: "C 点侦察箭（进攻）",
        description: `针对三点图 C 点的侦察箭，扫描包点与连杆常见位。`,
        steps: [
          { text: `站在${L.cLong}，保持身位不被中路看到。` },
          { text: "准星对准 C 点屋顶或立柱边缘。", tip: "充能次数按自定义校准。" },
          { text: "放出箭头覆盖包点与连杆。" },
          { text: "有信息则强攻，无信息可假打转 A/B。" },
        ],
      });
      add({
        id: `${mapId}-kj-c-nano-defense`,
        mapId,
        agentId: "killjoy",
        side: "defense",
        abilityId: "nanoswarm",
        abilityType: "molly",
        site: "C",
        difficulty: "easy",
        tags: ["保包", "C点"],
        featured: mapId === "haven" || mapId === "lotus",
        title: "C 包点纳米群",
        description: `C 点后置纳米群，拖延下包与拆包。`,
        steps: [
          { text: "纳米群藏在 C 包点后墙或箱缝。" },
          { text: "炮台面向主路入口。" },
          { text: "听到推点先报警机器人再决定对枪。" },
          { text: "下包音效出现后激活纳米群。" },
        ],
      });
      add({
        id: `${mapId}-omen-c-smoke-attack`,
        mapId,
        agentId: "omen",
        side: "attack",
        abilityId: "smoke",
        abilityType: "smoke",
        site: "C",
        difficulty: "easy",
        tags: ["烟", "C点"],
        title: "C 点暗影烟",
        description: `封住 C 点连杆与后点，减少交叉火力。`,
        steps: [
          { text: "标记 C 连杆与后点烟位并放出。" },
          { text: "偏执扫过入口。" },
          { text: "队友进点时你可暗影步上高位。" },
          { text: "下包后补烟拖延回防。" },
        ],
      });
      add({
        id: `${mapId}-fade-c-haunt-attack`,
        mapId,
        agentId: "fade",
        side: "attack",
        abilityId: "haunt",
        abilityType: "recon",
        site: "C",
        difficulty: "easy",
        tags: ["信息", "C点"],
        title: "C 点萦绕侦察",
        description: `萦绕扫描 C 点，配合捕获封锁连杆撤退。`,
        steps: [
          { text: `从${L.cLong}外侧抛出萦绕。` },
          { text: "标记出现后捕获封锁连杆。" },
          { text: "潜行者清箱后角落。" },
          { text: "确认人数后决定强攻或转点。" },
        ],
      });
    }
  }

  // Deduplicate by id (in case of overlap with legacy naming)
  const seen = new Set();
  const unique = [];
  for (const s of spots) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    unique.push(s);
  }
  return unique;
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function main() {
  ensureDir(path.join(PUBLIC, "maps"));
  ensureDir(path.join(PUBLIC, "agents"));
  ensureDir(path.join(PUBLIC, "placeholders"));

  // maps without color field in JSON
  const mapsOut = maps.map(({ color, ...rest }) => rest);
  writeJson(path.join(DATA, "maps.json"), mapsOut);
  writeJson(path.join(DATA, "agents.json"), agents);

  const spots = buildSpots();
  writeJson(path.join(DATA, "spots.json"), spots);

  // SVGs for maps
  for (const m of maps) {
    fs.writeFileSync(
      path.join(PUBLIC, "maps", `${m.id}.svg`),
      mapSvg(m.name, m.nameEn, m.color)
    );
  }

  // SVGs for agents
  for (const a of agents) {
    fs.writeFileSync(
      path.join(PUBLIC, "agents", `${a.id}.svg`),
      agentSvg(a.name, a.nameEn, a.role, a.color)
    );
  }

  // Spot placeholders
  let imgCount = 0;
  for (const spot of spots) {
    const map = mapById[spot.mapId];
    const agent = agentById[spot.agentId];
    const sideLabel = spot.side === "attack" ? "进攻" : "防守";
    const accent = agent?.color || "#ff4655";
    const base = {
      title: spot.title,
      mapName: map?.name || spot.mapId,
      agentName: agent?.name || spot.agentId,
      sideLabel,
      accent,
    };
    for (const kind of ["position", "crosshair", "landing"]) {
      const file = path.join(PUBLIC, "placeholders", `${spot.id}-${kind}.svg`);
      fs.writeFileSync(file, placeholderSvg({ ...base, kind }));
      imgCount++;
    }
    for (const step of spot.steps) {
      const file = path.join(
        PUBLIC,
        "placeholders",
        `${spot.id}-step${step.order}.svg`
      );
      fs.writeFileSync(
        file,
        placeholderSvg({
          ...base,
          kind: "step",
          stepLabel: `步骤${step.order}`,
        })
      );
      imgCount++;
    }
  }

  console.log(
    JSON.stringify(
      {
        maps: mapsOut.length,
        agents: agents.length,
        spots: spots.length,
        images: imgCount,
        featured: spots.filter((s) => s.featured).length,
      },
      null,
      2
    )
  );
}

main();

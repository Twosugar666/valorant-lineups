# 瓦罗兰特点位指南（Valorant Lineups）

中文优先的瓦罗兰特（Valorant）地图道具点位图文站：按 **地图 → 攻/防 → 特工** 或 **特工 → 地图** 浏览，每条点位含标题、技能、难度、步骤说明，以及站位 / 准星 / 落点图示槽位。

> 非官方粉丝向内容。Valorant 及相关商标归 Riot Games 所有。

## 在线仓库

https://github.com/Twosugar666/valorant-lineups

## 本地运行

```bash
npm i
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

生产构建：

```bash
npm run build
npm start
```

## 技术栈

- Next.js App Router + TypeScript
- Tailwind CSS
- 内容为 JSON，便于增删点位

## 目录结构

```
data/
  maps.json      # 地图目录
  agents.json    # 特工与技能
  spots.json     # 点位（核心内容）
public/
  maps/          # 地图封面图
  agents/        # 特工头像
  placeholders/  # 点位示意图（站位/准星/落点）
src/
  app/           # 路由页面
  components/    # UI 组件
  lib/data.ts    # 数据读取与筛选
  types/         # TypeScript 类型
```

### 主要路由

| 路径 | 说明 |
|------|------|
| `/` | 首页：精选点位、地图、特工 |
| `/maps` → `/maps/[mapId]/[side]/[agentId]` | 地图浏览流 |
| `/agents` → `/agents/[agentId]/[mapId]` | 特工浏览流 |
| `/spots/[spotId]` | 点位详情 |
| `/search` | 搜索与筛选 |

## 数据 Schema

### `maps.json`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 英文 slug，如 `ascent` |
| `name` | string | 中文名 |
| `nameEn` | string | 英文名 |
| `sites` | string[] | 包点，如 `["A","B"]` |
| `image` | string | 封面路径 |
| `description` | string | 简介 |

### `agents.json`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | slug |
| `name` / `nameEn` | string | 中英文名 |
| `role` | string | 职责（先锋/控场/哨兵等） |
| `image` | string | 头像路径 |
| `color` | string | 主题色 |
| `abilities` | array | `{ id, name, type }`，`type` 见下 |

`ability.type`：`smoke` | `flash` | `molly` | `recon` | `wall` | `trap` | `other`

### `spots.json`（一条点位）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一 ID，建议 `地图-特工-包点-技能-攻防` |
| `title` | string | 标题 |
| `mapId` / `agentId` | string | 关联地图、特工 |
| `side` | `"attack"` \| `"defense"` | 进攻 / 防守 |
| `abilityId` | string | 对应特工 skills 的 id |
| `abilityType` | string | 技能类型（便于筛选） |
| `site` | string | 包点或区域（A/B/C/中路） |
| `difficulty` | `"easy"` \| `"medium"` \| `"hard"` | 难度 |
| `tags` | string[] | 标签 |
| `description` | string | 简述 |
| `steps` | `{ order, text, tip? }[]` | 步骤 |
| `images` | object | `position` / `crosshair` / `landing` 图片路径 |
| `featured` | boolean? | 是否首页精选 |

## 如何新增一条点位

1. 在 `data/spots.json` 追加一个对象（可复制现有条目改字段）。
2. 准备三张截图，放到 `public/placeholders/`，命名建议：

```
{spotId}-position.png   # 站位
{spotId}-crosshair.png  # 准星
{spotId}-landing.png    # 落点
```

3. 把 `images` 三字段改成上述路径（也可继续用 `.svg` 占位）。
4. 若用到新地图或新特工，先在 `maps.json` / `agents.json` 补充。
5. 本地 `npm run dev` 预览，确认搜索与筛选能找到该点位。

### 示例片段

```json
{
  "id": "ascent-sova-a-recon-attack",
  "title": "A 包点侦察箭（进攻）",
  "mapId": "ascent",
  "agentId": "sova",
  "side": "attack",
  "abilityId": "recon",
  "abilityType": "recon",
  "site": "A",
  "difficulty": "easy",
  "tags": ["默认", "开局"],
  "description": "……",
  "steps": [
    { "order": 1, "text": "站在……", "tip": "可选提示" }
  ],
  "images": {
    "position": "/placeholders/ascent-sova-a-recon-attack-position.svg",
    "crosshair": "/placeholders/ascent-sova-a-recon-attack-crosshair.svg",
    "landing": "/placeholders/ascent-sova-a-recon-attack-landing.svg"
  },
  "featured": true
}
```

## 替换占位图

当前 `public/placeholders/`、`public/maps/`、`public/agents/` 均为 **SVG 占位图**，方便先跑通站点。

替换实机截图时：

1. 导出 PNG/WebP（建议 16:9，如 1280×720）。
2. 覆盖同名文件，或更新 JSON 中的路径。
3. 无需改代码；Next.js 会按路径加载静态资源。

请使用你自己录制的游戏截图，勿直接搬运他人受版权保护的图文内容。

## License

内容与代码可供学习与个人使用；游戏素材权益归 Riot Games。

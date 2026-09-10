import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const agents = JSON.parse(fs.readFileSync(path.join(root, "data/agents.json"), "utf8"));
const maps = JSON.parse(fs.readFileSync(path.join(root, "data/maps.json"), "utf8"));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function withAlpha(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** Unique geometric motif per agent (abstract, not game art). */
const motifs = {
  sova: (c) => `
    <polygon points="200,70 260,150 200,140 140,150" fill="none" stroke="${c}" stroke-width="3"/>
    <line x1="200" y1="140" x2="200" y2="250" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="255" r="8" fill="${c}"/>
    <path d="M160 200 Q200 170 240 200" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>`,
  fade: (c) => `
    <path d="M120 220 Q200 60 280 220" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M150 220 Q200 100 250 220" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
    <circle cx="200" cy="180" r="18" fill="${c}" opacity="0.35"/>
    <circle cx="200" cy="180" r="6" fill="${c}"/>`,
  gekko: (c) => `
    <circle cx="200" cy="160" r="55" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="175" cy="150" r="10" fill="${c}"/>
    <circle cx="225" cy="150" r="10" fill="${c}"/>
    <path d="M170 185 Q200 205 230 185" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="200" cy="230" r="14" fill="${c}" opacity="0.4"/>`,
  kayo: (c) => `
    <rect x="145" y="110" width="110" height="110" rx="8" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="165" r="28" fill="none" stroke="${c}" stroke-width="2.5"/>
    <line x1="200" y1="137" x2="200" y2="193" stroke="${c}" stroke-width="2"/>
    <line x1="172" y1="165" x2="228" y2="165" stroke="${c}" stroke-width="2"/>`,
  breach: (c) => `
    <polygon points="200,90 270,220 130,220" fill="none" stroke="${c}" stroke-width="3"/>
    <polygon points="200,120 245,200 155,200" fill="${c}" opacity="0.25"/>
    <line x1="110" y1="250" x2="290" y2="250" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
  skye: (c) => `
    <path d="M200 90 L230 150 L200 140 L170 150 Z" fill="${c}" opacity="0.85"/>
    <path d="M200 140 L245 230 L155 230 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="200" cy="200" r="8" fill="${c}"/>`,
  tejo: (c) => `
    <path d="M140 120 L200 90 L260 120 L240 230 L160 230 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="155" r="22" fill="${c}" opacity="0.3"/>
    <path d="M175 175 L200 200 L225 175" fill="none" stroke="${c}" stroke-width="2.5"/>`,
  viper: (c) => `
    <path d="M200 80 C240 120 250 180 200 250 C150 180 160 120 200 80" fill="none" stroke="${c}" stroke-width="3"/>
    <ellipse cx="200" cy="160" rx="35" ry="55" fill="${c}" opacity="0.2"/>
    <circle cx="200" cy="145" r="10" fill="${c}"/>`,
  omen: (c) => `
    <path d="M140 100 Q200 60 260 100 L240 230 Q200 270 160 230 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <ellipse cx="175" cy="150" rx="12" ry="18" fill="${c}" opacity="0.7"/>
    <ellipse cx="225" cy="150" rx="12" ry="18" fill="${c}" opacity="0.7"/>
    <path d="M170 200 Q200 220 230 200" fill="none" stroke="${c}" stroke-width="2"/>`,
  brimstone: (c) => `
    <circle cx="200" cy="170" r="70" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="8 6"/>
    <circle cx="200" cy="170" r="40" fill="${c}" opacity="0.25"/>
    <circle cx="200" cy="170" r="12" fill="${c}"/>
    <line x1="200" y1="100" x2="200" y2="130" stroke="${c}" stroke-width="3"/>`,
  astra: (c) => `
    <circle cx="200" cy="165" r="8" fill="${c}"/>
    <circle cx="200" cy="165" r="35" fill="none" stroke="${c}" stroke-width="2" opacity="0.8"/>
    <circle cx="200" cy="165" r="60" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
    <circle cx="140" cy="130" r="5" fill="${c}"/><circle cx="260" cy="130" r="5" fill="${c}"/>
    <circle cx="150" cy="210" r="5" fill="${c}"/><circle cx="250" cy="210" r="5" fill="${c}"/>`,
  harbor: (c) => `
    <path d="M110 180 Q155 120 200 180 Q245 120 290 180" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M120 210 Q160 160 200 210 Q240 160 280 210" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
    <rect x="185" y="100" width="30" height="50" fill="none" stroke="${c}" stroke-width="2.5"/>`,
  clove: (c) => `
    <path d="M200 100 C230 130 250 160 200 230 C150 160 170 130 200 100" fill="${c}" opacity="0.3"/>
    <path d="M200 115 C220 140 235 160 200 210 C165 160 180 140 200 115" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="200" cy="155" r="10" fill="${c}"/>`,
  killjoy: (c) => `
    <rect x="150" y="110" width="100" height="100" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="160" r="22" fill="none" stroke="${c}" stroke-width="2.5"/>
    <rect x="190" y="150" width="20" height="20" fill="${c}" opacity="0.7"/>
    <line x1="130" y1="230" x2="270" y2="230" stroke="${c}" stroke-width="2"/>`,
  cypher: (c) => `
    <circle cx="200" cy="155" r="50" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="155" r="22" fill="${c}" opacity="0.35"/>
    <circle cx="200" cy="155" r="8" fill="${c}"/>
    <path d="M150 220 L200 250 L250 220" fill="none" stroke="${c}" stroke-width="2"/>`,
  chamber: (c) => `
    <path d="M160 100 L240 100 L260 160 L200 240 L140 160 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="155" r="18" fill="${c}" opacity="0.35"/>
    <line x1="200" y1="120" x2="200" y2="190" stroke="${c}" stroke-width="2"/>`,
  sage: (c) => `
    <circle cx="200" cy="150" r="45" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M200 115 L200 185 M165 150 L235 150" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M155 210 Q200 240 245 210" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>`,
  deadlock: (c) => `
    <rect x="155" y="115" width="90" height="90" fill="none" stroke="${c}" stroke-width="3" transform="rotate(45 200 160)"/>
    <rect x="175" y="135" width="50" height="50" fill="${c}" opacity="0.2" transform="rotate(45 200 160)"/>
    <circle cx="200" cy="160" r="8" fill="${c}"/>`,
  jett: (c) => `
    <path d="M200 85 L230 160 L200 145 L170 160 Z" fill="${c}"/>
    <path d="M145 175 L200 155 L255 175 L230 240 L170 240 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
    <path d="M175 200 L200 175 L225 200" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>`,
  raze: (c) => `
    <circle cx="200" cy="165" r="55" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="200" cy="165" r="28" fill="${c}" opacity="0.3"/>
    <path d="M200 120 L210 150 L240 150 L216 170 L226 200 L200 182 L174 200 L184 170 L160 150 L190 150 Z" fill="${c}"/>`,
  neon: (c) => `
    <polyline points="160,100 180,160 155,160 190,240 210,170 185,170 220,100" fill="none" stroke="${c}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="130" y1="200" x2="270" y2="130" stroke="${c}" stroke-width="1.5" opacity="0.4"/>`,
  yoru: (c) => `
    <path d="M130 140 L200 90 L270 140 L240 240 L160 240 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M170 150 L200 120 L230 150 L215 200 L185 200 Z" fill="${c}" opacity="0.3"/>
    <circle cx="185" cy="155" r="5" fill="${c}"/><circle cx="215" cy="155" r="5" fill="${c}"/>`,
  phoenix: (c) => `
    <path d="M200 95 L235 150 L200 140 L165 150 Z" fill="${c}"/>
    <path d="M140 160 Q170 130 200 160 Q230 130 260 160 L245 230 Q200 260 155 230 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="200" cy="185" r="14" fill="${c}" opacity="0.4"/>`,
  reyna: (c) => `
    <ellipse cx="200" cy="155" rx="55" ry="70" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M170 140 Q200 110 230 140" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="180" cy="155" r="8" fill="${c}"/><circle cx="220" cy="155" r="8" fill="${c}"/>
    <path d="M175 190 Q200 210 225 190" fill="none" stroke="${c}" stroke-width="2"/>`,
  iso: (c) => `
    <rect x="140" y="110" width="120" height="120" fill="none" stroke="${c}" stroke-width="3"/>
    <rect x="165" y="135" width="70" height="70" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>
    <rect x="185" y="155" width="30" height="30" fill="${c}" opacity="0.45"/>`,
  waylay: (c) => `
    <path d="M120 200 L200 90 L280 200 L240 250 L160 250 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M160 200 L200 130 L240 200" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>
    <circle cx="200" cy="175" r="10" fill="${c}"/>`,
};

function agentSvg(agent) {
  const c = agent.color;
  const motif = (motifs[agent.id] || motifs.iso)(c);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1118"/>
      <stop offset="100%" stop-color="#141e2a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${withAlpha(c, 0.28)}"/>
      <stop offset="100%" stop-color="${withAlpha(c, 0)}"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect width="400" height="400" fill="url(#glow)"/>
  <rect x="18" y="18" width="364" height="364" fill="none" stroke="${withAlpha(c, 0.35)}" stroke-width="1.5"/>
  <polygon points="382,18 382,48 352,18" fill="${c}" opacity="0.85"/>
  ${motif}
  <text x="200" y="310" text-anchor="middle" fill="${c}" font-family="system-ui,sans-serif" font-size="28" font-weight="700">${agent.name}</text>
  <text x="200" y="340" text-anchor="middle" fill="#8b9bb4" font-family="system-ui,sans-serif" font-size="14">${agent.nameEn} · ${agent.role}</text>
</svg>
`;
}

const mapThemes = {
  abyss: { accent: "#7c3aed", motif: "void" },
  ascent: { accent: "#30c78a", motif: "arch" },
  haven: { accent: "#e8a838", motif: "tri" },
  lotus: { accent: "#34d399", motif: "petal" },
  split: { accent: "#f97316", motif: "split" },
  summit: { accent: "#38bdf8", motif: "peak" },
  sunset: { accent: "#fb7185", motif: "sun" },
  bind: { accent: "#fbbf24", motif: "portal" },
};

function mapMotif(kind, accent) {
  switch (kind) {
    case "void":
      return `<circle cx="320" cy="120" r="40" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
        <circle cx="320" cy="120" r="18" fill="${accent}" opacity="0.25"/>
        <path d="M80 280 L200 160 L360 280" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>`;
    case "arch":
      return `<path d="M180 260 Q320 80 460 260" fill="none" stroke="${accent}" stroke-width="3" opacity="0.55"/>
        <rect x="290" y="140" width="60" height="100" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>`;
    case "tri":
      return `<circle cx="200" cy="200" r="28" fill="none" stroke="${accent}" stroke-width="2"/>
        <circle cx="320" cy="200" r="28" fill="none" stroke="${accent}" stroke-width="2"/>
        <circle cx="440" cy="200" r="28" fill="none" stroke="${accent}" stroke-width="2"/>
        <text x="200" y="206" text-anchor="middle" fill="${accent}" font-size="14" font-family="system-ui">A</text>
        <text x="320" y="206" text-anchor="middle" fill="${accent}" font-size="14" font-family="system-ui">B</text>
        <text x="440" y="206" text-anchor="middle" fill="${accent}" font-size="14" font-family="system-ui">C</text>`;
    case "petal":
      return `<ellipse cx="320" cy="160" rx="50" ry="28" fill="none" stroke="${accent}" stroke-width="2" transform="rotate(-30 320 160)"/>
        <ellipse cx="320" cy="160" rx="50" ry="28" fill="none" stroke="${accent}" stroke-width="2" transform="rotate(30 320 160)"/>
        <circle cx="320" cy="160" r="12" fill="${accent}" opacity="0.5"/>`;
    case "split":
      return `<line x1="320" y1="80" x2="320" y2="280" stroke="${accent}" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
        <rect x="200" y="120" width="90" height="120" fill="none" stroke="${accent}" stroke-width="2" opacity="0.45"/>
        <rect x="350" y="120" width="90" height="120" fill="none" stroke="${accent}" stroke-width="2" opacity="0.45"/>`;
    case "peak":
      return `<polygon points="320,90 420,250 220,250" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.55"/>
        <polygon points="320,130 380,230 260,230" fill="${accent}" opacity="0.15"/>`;
    case "sun":
      return `<circle cx="480" cy="100" r="50" fill="${accent}" opacity="0.2"/>
        <circle cx="480" cy="100" r="28" fill="none" stroke="${accent}" stroke-width="2"/>
        <path d="M80 260 Q200 200 320 250 Q440 300 560 230" fill="none" stroke="${accent}" stroke-width="2" opacity="0.45"/>`;
    case "portal":
      return `<ellipse cx="220" cy="180" rx="28" ry="48" fill="none" stroke="${accent}" stroke-width="2.5"/>
        <ellipse cx="420" cy="180" rx="28" ry="48" fill="none" stroke="${accent}" stroke-width="2.5"/>
        <path d="M248 180 C300 140 340 140 392 180" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="5 4" opacity="0.6"/>`;
    default:
      return "";
  }
}

function mapSvg(map) {
  const theme = mapThemes[map.id] || { accent: "#ff4655", motif: "arch" };
  const accent = theme.accent;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="mbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1118"/>
      <stop offset="55%" stop-color="#101a24"/>
      <stop offset="100%" stop-color="#141e2a"/>
    </linearGradient>
    <linearGradient id="accentFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#mbg)"/>
  <rect x="24" y="24" width="592" height="312" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.45"/>
  <polygon points="616,24 616,56 584,24" fill="${accent}" opacity="0.8"/>
  ${mapMotif(theme.motif, accent)}
  <rect x="40" y="300" width="560" height="2" fill="url(#accentFade)"/>
  <text x="320" y="175" text-anchor="middle" fill="${accent}" font-family="system-ui,sans-serif" font-size="34" font-weight="700">${map.name}</text>
  <text x="320" y="210" text-anchor="middle" fill="#8b9bb4" font-family="system-ui,sans-serif" font-size="18">${map.nameEn}</text>
  <text x="320" y="240" text-anchor="middle" fill="#5a6a80" font-family="system-ui,sans-serif" font-size="12">包点 ${map.sites.join(" / ")}</text>
</svg>
`;
}

for (const agent of agents) {
  const out = path.join(root, "public/agents", `${agent.id}.svg`);
  fs.writeFileSync(out, agentSvg(agent));
}
for (const map of maps) {
  const out = path.join(root, "public/maps", `${map.id}.svg`);
  fs.writeFileSync(out, mapSvg(map));
}

// Light-touch: improve contrast on a sample of placeholders by bumping label colors via regex on all files
// Only adjust muted greys to higher contrast — keep geometry; skip if too risky on 2000+ files
let touched = 0;
const phDir = path.join(root, "public/placeholders");
for (const file of fs.readdirSync(phDir)) {
  if (!file.endsWith(".svg")) continue;
  const fp = path.join(phDir, file);
  let s = fs.readFileSync(fp, "utf8");
  const next = s
    .replace(/fill="#5a6a80"/g, 'fill="#9aa8bc"')
    .replace(/fill="#3d4a5c"/g, 'fill="#7a8799"')
    .replace(/fill="#8b9bb4"/g, 'fill="#b0bdd0"');
  if (next !== s) {
    fs.writeFileSync(fp, next);
    touched++;
  }
}

console.log(`Wrote ${agents.length} agent icons, ${maps.length} map icons, improved ${touched} placeholders`);

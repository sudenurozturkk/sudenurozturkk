// Son 12 ayın gerçek katkı takvimini "sismograf" olarak çizer (animasyonlu SVG).
//   GH_USERNAME=sudenurozturkk GH_TOKEN=... node generate-seismo.mjs
//   MOCK=1 node generate-seismo.mjs      # yerelde önizleme
import fs from "node:fs";
import path from "node:path";

const USER = process.env.GH_USERNAME, TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const OUT = process.env.OUTPUT_PATH || "dist/seismo.svg";

async function days() {
  if (process.env.MOCK === "1") {
    return Array.from({ length: 371 }, (_, i) => (Math.random() < 0.5 ? 0 : Math.floor(Math.random() ** 2 * 16)));
  }
  if (!USER || !TOKEN) throw new Error("GH_USERNAME ve GH_TOKEN gerekli (ya da MOCK=1).");
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{weeks{contributionDays{contributionCount}}}}}}`,
      variables: { l: USER },
    }),
  });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error(JSON.stringify(j.errors || j));
  return j.data.user.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount));
}

const W = 1200, H = 200, X0 = 40, X1 = 1160, BASE = 112, MAXH = 74, LOOP = 14;
const BG = "#09060d", DIM = "#7a6b7c", PINK = "#ff7ab8";
const STOPS = [[0, [77, 163, 255]], [.4, [155, 107, 255]], [.75, [255, 122, 184]], [1, [255, 45, 85]]];
const ramp = (t) => {
  for (let i = 1; i < STOPS.length; i++) if (t <= STOPS[i][0]) {
    const [t0, a] = STOPS[i - 1], [t1, b] = STOPS[i], u = (t - t0) / (t1 - t0);
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * u)).join(",")})`;
  }
  return "rgb(255,45,85)";
};

const data = await days();
const max = Math.max(1, ...data), total = data.reduce((a, b) => a + b, 0);
const dx = (X1 - X0) / data.length;
let ticks = "";
data.forEach((c, i) => {
  const x = (X0 + i * dx + dx / 2).toFixed(2);
  const h = c === 0 ? 3 : 8 + Math.sqrt(c / max) * (MAXH - 8);
  ticks += `<line x1="${x}" x2="${x}" y1="${(BASE - h).toFixed(1)}" y2="${(BASE + h * 0.33).toFixed(1)}" stroke="${c === 0 ? "#6b4a8a" : ramp(c / max)}" stroke-width="2" stroke-linecap="round"/>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Katkı sismografı">
<defs>
<clipPath id="sweep"><rect x="0" y="0" width="0" height="${H}"><animate attributeName="width" values="0;${W};${W}" keyTimes="0;.85;1" dur="${LOOP}s" repeatCount="indefinite"/></rect></clipPath>
<g id="t">${ticks}</g>
</defs>
<rect width="${W}" height="${H}" rx="14" fill="${BG}"/>
<line x1="${X0}" x2="${X1}" y1="${BASE}" y2="${BASE}" stroke="#ffffff" stroke-opacity=".12"/>
<use href="#t" opacity=".3"/>
<use href="#t" clip-path="url(#sweep)"/>
<line y1="30" y2="${BASE + 40}" stroke="${PINK}" stroke-width="2"><animate attributeName="x1" values="0;${W};${W}" keyTimes="0;.85;1" dur="${LOOP}s" repeatCount="indefinite"/><animate attributeName="x2" values="0;${W};${W}" keyTimes="0;.85;1" dur="${LOOP}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.84;.86;1" dur="${LOOP}s" repeatCount="indefinite"/></line>
<g font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="14" fill="${DIM}">
<text x="${X0}" y="32">SİSMOGRAF · son 12 ay</text>
<text x="${X1}" y="32" text-anchor="end">${total} katkı · en yoğun gün ${max}</text>
<text x="${X0}" y="${H - 24}">bu neden böyle? peki ya şöyle olursa?</text>
</g></svg>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, svg);
console.log("yazıldı:", OUT, `(${total} katkı)`);

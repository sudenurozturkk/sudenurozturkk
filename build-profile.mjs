// Sudenur Öztürk — GitHub profil SVG seti
// Renkler/fontlar whodenur.com ve sudenurozturk.tr sitelerinden alındı.
// Çalıştır: node build-profile.mjs  → dist/*.svg
import fs from "node:fs";

const OUT = process.argv[2] || "dist";
let LANG = "en";
const dir = () => (LANG === "en" ? OUT : `${OUT}/tr`);
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(`${OUT}/tr`, { recursive: true });

const C = {
  bg: "#05050b", surface: "#0c0c16", border: "#1c1c2c",
  pink: "#f07aa6", violet: "#a78bfa", green: "#4ade80",
  text: "#ececf4", muted: "#8b8ba6", soft: "#a9a9c2", red: "#ff4d6d",
};
const MONO = "'JetBrains Mono','SF Mono',Menlo,Consolas,'DejaVu Sans Mono',monospace";
const SANS = "'Space Grotesk','Inter','Segoe UI',system-ui,sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f1 = (n) => Number(n).toFixed(1);
let uid = 0;
const id = (p) => `${p}${uid++}`;

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">\n<title>${esc(title)}</title>\n${body}\n</svg>\n`;
const write = (name, s, shared = false) => { const d = shared ? OUT : dir(); fs.writeFileSync(`${d}/${name}`, s); console.log("yazıldı:", `${d}/${name}`); };

// Yazı yazma efekti (monospace, adım adım açılan clipPath)
function typed(text, x, y, { begin, per = 0.06, size = 16, fill = C.text, weight = 400 } = {}) {
  const cid = id("ty");
  const cw = size * 0.6;
  const n = [...text].length;
  const vals = Array.from({ length: n + 1 }, (_, i) => f1(i * cw)).join(";");
  return `<clipPath id="${cid}"><rect x="${x}" y="${y - size}" width="0" height="${f1(size * 1.5)}"><animate attributeName="width" values="${vals}" calcMode="discrete" dur="${(n * per).toFixed(2)}s" begin="${begin}s" fill="freeze"/></rect></clipPath>
<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" font-weight="${weight}" fill="${fill}" clip-path="url(#${cid})" xml:space="preserve">${esc(text)}</text>`;
}
const appear = (begin, dur = 0.5) => `<animate attributeName="opacity" from="0" to="1" dur="${dur}s" begin="${begin}s" fill="freeze"/>`;
const blink = (dur = 1.1) => `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="${dur}s" repeatCount="indefinite"/>`;

// Pencere çerçevesi (whodenur.com terminal penceresi tarzı)
function chrome(w, title, { live = true } = {}) {
  return `<rect x="0" y="0" width="${w}" height="40" fill="${C.surface}"/>
<line x1="0" y1="40" x2="${w}" y2="40" stroke="${C.border}"/>
<circle cx="24" cy="20" r="5" fill="${C.pink}"/><circle cx="43" cy="20" r="5" fill="${C.violet}"/><circle cx="62" cy="20" r="5" fill="${C.green}"/>
<text x="${w / 2}" y="24" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${C.muted}">${esc(title)}</text>
${live ? `<circle cx="${w - 64}" cy="20" r="3.5" fill="${C.green}"><animate attributeName="opacity" values="1;0.25;1" dur="2s" repeatCount="indefinite"/></circle>
<text x="${w - 54}" y="24" font-family="${MONO}" font-size="12" fill="${C.green}">live</text>` : ""}`;
}

function ticker(items, w, y, h, { speed = 38, size = 13 } = {}) {
  const sep = "   ✦   ";
  const one = items.join(sep) + sep;
  const tw = Math.round([...one].length * size * 0.6);
  const cid = id("tk");
  const mk = (dx) =>
    `<text x="${dx}" y="${y + h / 2 + 5}" font-family="${MONO}" font-size="${size}" fill="${C.muted}" textLength="${tw}" lengthAdjust="spacing" xml:space="preserve">${esc(one).replace(/✦/g, `<tspan fill="${C.pink}">✦</tspan>`)}</text>`;
  return `<clipPath id="${cid}"><rect x="0" y="${y}" width="${w}" height="${h}"/></clipPath>
<rect x="0" y="${y}" width="${w}" height="${h}" fill="#08080f"/>
<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${C.border}"/>
<g clip-path="url(#${cid})"><g>${mk(0)}${mk(tw)}<animateTransform attributeName="transform" type="translate" from="0 0" to="${-tw} 0" dur="${(tw / speed).toFixed(1)}s" repeatCount="indefinite"/></g></g>`;
}

// ───────────────────────── BANNER ─────────────────────────
function banner() {
  const W = 1000, H = 372;
  const roles = {
    en: ["software engineering student @ Fırat University", "building web · automation · AI products", "cybersecurity · offensive security · AI security", "founder @ Whodenur"],
    tr: ["yazılım mühendisliği öğrencisi @ Fırat Üniversitesi", "web · otomasyon · yapay zekâ ürünleri geliştiriyorum", "siber güvenlik · ofansif güvenlik · AI güvenliği", "kurucu @ Whodenur"],
  }[LANG];
  const motto = LANG === "en" ? "“Why is it like this? And what happens if…?”" : "“Bu neden böyle? Peki ya şöyle olursa ne olur?”";
  const slot = 1 / roles.length;
  const roleEls = roles.map((r, k) => {
    const s = k * slot, e = (k + 1) * slot;
    let pts = [[0, 0], [s, 0], [s + 0.02, 1], [e - 0.02, 1], [e, 0], [1, 0]];
    pts = pts.filter((p, i) => i === 0 || p[0] > pts[i - 1][0]);
    return `<text x="62" y="214" font-family="${MONO}" font-size="19" fill="${k % 2 ? C.violet : C.pink}" opacity="0"><animate attributeName="opacity" values="${pts.map((p) => p[1]).join(";")}" keyTimes="${pts.map((p) => p[0].toFixed(3)).join(";")}" dur="14s" begin="2.2s" repeatCount="indefinite"/>${esc(r)}</text>`;
  }).join("\n");

  const body = `<defs>
<clipPath id="win"><rect width="${W}" height="${H}" rx="18"/></clipPath>
<radialGradient id="glowP" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.pink}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowV" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.violet}" stop-opacity="0.32"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="gname" x1="0" y1="0" x2="1" y2="0" spreadMethod="reflect">
<stop offset="0" stop-color="${C.pink}"/><stop offset="0.5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.green}"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-0.35 0;0.35 0;-0.35 0" dur="9s" repeatCount="indefinite"/></linearGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.035"/></pattern>
</defs>
<g clip-path="url(#win)">
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<ellipse cx="140" cy="40" rx="360" ry="220" fill="url(#glowP)"><animate attributeName="cx" values="140;230;140" dur="14s" repeatCount="indefinite"/></ellipse>
<ellipse cx="880" cy="90" rx="340" ry="230" fill="url(#glowV)"><animate attributeName="cx" values="880;790;880" dur="17s" repeatCount="indefinite"/></ellipse>
${chrome(W, "sudenur@whodenur: ~")}

<text x="34" y="92" font-family="${MONO}" font-size="15" fill="${C.green}" opacity="0"><set attributeName="opacity" to="1" begin="0.2s"/>➜ ~ $</text>
${typed("whoami", 100, 92, { begin: 0.5, size: 15, per: 0.09, fill: C.text })}
<rect x="100" y="79" width="9" height="16" fill="${C.pink}" opacity="0"><set attributeName="opacity" to="1" begin="0.2s"/><animate attributeName="x" values="${Array.from({ length: 7 }, (_, i) => 102 + i * 9).join(";")}" calcMode="discrete" dur="0.54s" begin="0.5s" fill="freeze"/>${blink()}</rect>

<text x="34" y="166" font-family="${SANS}" font-size="62" font-weight="700" fill="url(#gname)" opacity="0">${appear(1.1, 0.7)}<animateTransform attributeName="transform" type="translate" from="0 14" to="0 0" dur="0.7s" begin="1.1s" fill="freeze"/>Sudenur Öztürk</text>

<text x="36" y="214" font-family="${MONO}" font-size="19" fill="${C.pink}" opacity="0">${appear(2.0, 0.3)}➜</text>
${roleEls}

<text x="36" y="262" font-family="${MONO}" font-size="13" fill="${C.muted}" opacity="0">${appear(2.6)}$ echo $MOTTO</text>
<text x="36" y="292" font-family="${SANS}" font-size="19" font-style="italic" fill="${C.text}" opacity="0">${appear(3.0, 0.8)}${esc(motto)}</text>

<g transform="translate(860 176)">
<circle r="104" fill="none" stroke="${C.pink}" stroke-opacity="0.75" stroke-width="1.5" stroke-dasharray="2 9" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="46s" repeatCount="indefinite"/></circle>
<circle r="78" fill="none" stroke="${C.violet}" stroke-opacity="0.8" stroke-width="1.5" stroke-dasharray="1 6" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="32s" repeatCount="indefinite"/></circle>
<circle r="52" fill="none" stroke="${C.green}" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="16 9"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="22s" repeatCount="indefinite"/></circle>
<circle r="26" fill="none" stroke="${C.border}" stroke-width="1.5"/>
<circle r="5" fill="${C.pink}"/>
<circle r="5" fill="none" stroke="${C.pink}" stroke-width="1.5"><animate attributeName="r" values="5;30" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0" dur="2.6s" repeatCount="indefinite"/></circle>
<path d="M-110 26 L-62 -22 L-40 6 L0 -44 L22 -10 L70 -46 L112 -4" fill="none" stroke="${C.red}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="420" stroke-dashoffset="420">
<animate attributeName="stroke-dashoffset" values="420;0;0;0;420" keyTimes="0;0.2;0.7;0.9;1" dur="7s" begin="3s" repeatCount="indefinite"/></path>
</g>

${ticker(["born at hackathons", "ship products that work", "secure by design", "whodenur_", "Fırat Üniversitesi", LANG === "en" ? "Erasmus+ Poland" : "Erasmus+ Polonya", "$ sudo hire whodenur"], W, H - 44, 44)}
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${C.border}"/>`;
  write("banner.svg", svg(W, H, body, LANG === "en" ? "Sudenur Öztürk — software engineering student, founder of Whodenur" : "Sudenur Öztürk — yazılım mühendisliği öğrencisi, Whodenur kurucusu"));
}

// ───────────────────────── SECTION HEADINGS ─────────────────────────
function heading(file, label, title) {
  const W = 1000, H = 74;
  const cid = id("hd");
  const body = `<defs><linearGradient id="${cid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}"/><stop offset="0.5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.green}" stop-opacity="0"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="none"/>
<text x="4" y="22" font-family="${MONO}" font-size="14" fill="${C.pink}">${esc(label)}</text>
<text x="4" y="58" font-family="${SANS}" font-size="32" font-weight="700" fill="${C.text}" opacity="0">${appear(0.1, 0.6)}<animateTransform attributeName="transform" type="translate" from="-14 0" to="0 0" dur="0.6s" begin="0.1s" fill="freeze"/>${esc(title)}</text>
<rect x="4" y="68" width="${W - 8}" height="2" rx="1" fill="${C.border}"/>
<rect x="4" y="68" width="260" height="2" rx="1" fill="url(#${cid})"><animate attributeName="x" values="4;736;4" dur="6s" repeatCount="indefinite"/></rect>`;
  write(file, svg(W, H, body, `${label} ${title}`));
}

// ───────────────────────── PROJECT CARDS ─────────────────────────
const U = "github.com/sudenurozturkk/";
const projects = [
  { slug: "genc-ihh-raporlama", badge: "live", live: "genc-ihh-raporlama-kpjy-iota.vercel.app", stack: ["Next.js 16", "React 19", "Prisma", "Claude"],
    en: { title: "GENÇ İHH Reporting", event: "İHH ATOM Hackathon · Bursa 2026", desc: "AI-assisted field reporting: regional coordinators enter field data, HQ monitors it on a Türkiye map, AI generates scorecards." },
    tr: { title: "GENÇ İHH Raporlama", event: "İHH ATOM Hackathon · Bursa 2026", desc: "AI destekli saha raporlama: il koordinatörleri veri girer, genel merkez Türkiye haritasından izler, yapay zekâ karne puanı üretir." } },
  { slug: "surucep", badge: "live", live: "surucep.vercel.app", stack: ["React", "TypeScript", "PWA", "Offline-first"],
    en: { title: "SürüCep", event: "Erasmus+ ideathon · Muş", desc: "Offline-first PWA for small livestock farmers: voice-based vaccination, birth, treatment and milk records; blocks sale of medicated milk." },
    tr: { title: "SürüCep", event: "Erasmus+ ideathon · Muş", desc: "Küçük besiciler için offline-first PWA: aşı, doğum, tedavi ve süt kayıtları sesle tutulur, ilaçlı sütün satışı engellenir." } },
  { slug: "campaigncell", badge: "src", repo: "campaigncell", stack: ["NestJS", "FastAPI", "RabbitMQ", "scikit-learn"],
    en: { title: "CampaignCell", event: "Turkcell CodeNight All Star Final", desc: "Personalized campaign platform: 4 microservices + API gateway, ML-based subscriber segmentation and conversion prediction." },
    tr: { title: "CampaignCell", event: "Turkcell CodeNight All Star Finali", desc: "Kişiselleştirilmiş kampanya platformu: 4 mikroservis + API Gateway, ML ile abone segmentasyonu ve dönüşüm tahmini." } },
  { slug: "ilac-rehberi", badge: "demo", repo: "ilacasistani", stack: ["Next.js 15", "SQLite", "Foundry Local", "Whisper"],
    en: { title: "Medication Guide Assistant", event: "Microsoft AI Innovators Summer Internship", desc: "Fully offline RAG: hybrid search, enforced source citations, voice questions via Whisper, drug-interaction checks." },
    tr: { title: "İlaç Rehberi Asistanı", event: "Microsoft AI Innovators Yaz Stajı", desc: "Tamamen offline RAG: hibrit arama, zorunlu kaynak atfı, Whisper ile sesli soru, ilaç etkileşimi denetimi." } },
  { slug: "kulupos", badge: "src", repo: "kulupos", stack: ["Gemma", "open model"],
    en: { title: "KulüpOS", event: "Hacktoberfest Elazığ 2026 · solo", desc: "Club management app: entered with no team, built it solo, using the open Gemma model for the AI part." },
    tr: { title: "KulüpOS", event: "Hacktoberfest Elazığ 2026 · solo", desc: "Kulüp yönetim uygulaması: takımsız katılıp tek başıma geliştirdim, yapay zekâ tarafında Gemma açık modelini kullandım." } },
  { slug: "ai-finans-asistani", badge: "src", repo: "KisiselAiFinansAsistani", stack: ["Next.js", "Gemini", "TypeScript"],
    en: { title: "AI Finance Assistant", event: "BTK AI Hackathon 26", desc: "Agentic finance advisor: spending anomaly detection, 30-day forecasting, scenario simulator and tool-calling." },
    tr: { title: "AI Finans Asistanı", event: "BTK AI Hackathon 26", desc: "Agentic finans danışmanı: harcama anomali tespiti, 30 günlük tahmin, senaryo simülatörü ve tool-calling." } },
  { slug: "smartrentvault", badge: "src", repo: "SMARTRENTVAULT", stack: ["Rust", "Soroban", "Stellar", "React"],
    en: { title: "SmartRentVault", event: "HackStellar · 48 hours", desc: "Decentralized rental & deposit dApp built in 48h: Soroban smart contracts, escrow, ratings, Freighter Wallet." },
    tr: { title: "SmartRentVault", event: "HackStellar · 48 saat", desc: "Merkeziyetsiz kira ve depozito dApp'i: Soroban akıllı kontratları, escrow, puanlama sistemi, Freighter Wallet." } },
  { slug: "diyetpro", badge: "src", repo: "DiyetisyenOtomasyonu", stack: ["C#", ".NET 4.8", "DevExpress", "MySQL"],
    en: { title: "DiyetPro", event: "desktop automation", desc: "Dietitian patient-tracking app: layered architecture, hand-built DI container, diet plans, appointments, AI suggestions." },
    tr: { title: "DiyetPro", event: "masaüstü otomasyonu", desc: "Diyetisyen hasta takip uygulaması: katmanlı mimari, kendi yazdığım DI container, diyet planı, randevu ve AI önerileri." } },
  { slug: "fitturkai", badge: "src", full: "github.com/FitTurkAI/FitTurkAI", stack: ["Next.js", "FastAPI", "Hugging Face"],
    en: { title: "FitTurkAI", event: "health & fitness assistant", desc: "Turkish-language health & fitness assistant generating recommendations with a Hugging Face model." },
    tr: { title: "FitTurkAI", event: "sağlık & fitness asistanı", desc: "Türkçe konuşan, Hugging Face modeliyle öneri üreten kişisel sağlık ve fitness takip asistanı." } },
  { slug: "qr-menu", badge: "live", live: "sudenurozturkk.github.io/dortayaklikafe", stack: ["HTML", "CSS", "JavaScript"],
    en: { title: "QR Menu", event: "Turkcell CodeNight · Diyarbakır", desc: "Digital menu site I built voluntarily and put live for a local café in Diyarbakır." },
    tr: { title: "QR Menü", event: "Turkcell CodeNight · Diyarbakır", desc: "Diyarbakır'da bir kafe için gönüllü geliştirdiğim ve yayına aldığım dijital menü sitesi." } },
];

function wrap(text, max) {
  const out = []; let cur = "";
  for (const w of text.split(" ")) {
    if ((cur + " " + w).trim().length > max) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}

function card(p, idx) {
  const W = 440, H = 252;
  const t = p[LANG];
  const en = LANG === "en";
  const b = p.badge === "live" ? { t: en ? "live" : "canlıda", c: C.green, dot: true } : p.badge === "demo" ? { t: en ? "▶ video" : "▶ video", c: C.pink } : { t: en ? "</> source" : "</> kaynak", c: C.violet };
  const bw = Math.round([...b.t].length * 6.6 + (b.dot ? 30 : 20));
  const lines = wrap(t.desc, 52).slice(0, 3);
  let cx = 20;
  const chips = p.stack.slice(0, 4).map((s) => {
    const w = Math.round([...s].length * 6.4 + 18);
    const el = `<rect x="${cx}" y="188" width="${w}" height="22" rx="11" fill="${C.violet}" fill-opacity="0.12" stroke="${C.violet}" stroke-opacity="0.35"/><text x="${cx + w / 2}" y="203" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="${C.violet}" textLength="${w - 18}" lengthAdjust="spacingAndGlyphs">${esc(s)}</text>`;
    cx += w + 8; return el;
  }).join("");
  const status = p.live
    ? `<text x="20" y="236" font-family="${MONO}" font-size="11" fill="${C.green}">✓ ${en ? "live" : "canlıda"} → ${esc(p.live.length > 40 ? p.live.slice(0, 39) + "…" : p.live)}</text>`
    : `<text x="20" y="236" font-family="${MONO}" font-size="11" fill="${C.muted}">↗ ${esc(p.full || U + p.repo)}</text>`;
  const sid = id("sw");
  const body = `<defs><clipPath id="c${sid}"><rect width="${W}" height="${H}" rx="14"/></clipPath>
<linearGradient id="${sid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}" stop-opacity="0"/><stop offset="0.5" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></linearGradient></defs>
<g clip-path="url(#c${sid})" opacity="0">${appear(idx * 0.1, 0.6)}
<rect width="${W}" height="${H}" fill="${C.surface}"/>
<rect x="0" y="0" width="${W}" height="34" fill="#0a0a13"/><line x1="0" y1="34" x2="${W}" y2="34" stroke="${C.border}"/>
<circle cx="18" cy="17" r="4" fill="${C.pink}"/><circle cx="33" cy="17" r="4" fill="${C.violet}"/><circle cx="48" cy="17" r="4" fill="${C.green}"/>
<text x="64" y="21" font-family="${MONO}" font-size="10.5" fill="${C.muted}">~/whodenur/projects/${esc(p.slug)}/README.md</text>
<text x="20" y="72" font-family="${SANS}" font-size="22" font-weight="700" fill="${C.text}">${esc(t.title)}</text>
<rect x="${W - 20 - bw}" y="52" width="${bw}" height="24" rx="12" fill="${b.c}" fill-opacity="0.12" stroke="${b.c}" stroke-opacity="0.4"/>
${b.dot ? `<circle cx="${W - 20 - bw + 14}" cy="64" r="3.5" fill="${b.c}"><animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite"/></circle>` : ""}
<text x="${W - 20 - bw / 2 + (b.dot ? 6 : 0)}" y="68.5" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${b.c}">${esc(b.t)}</text>
<text x="20" y="96" font-family="${MONO}" font-size="11.5" fill="${C.pink}">// ${esc(t.event)}</text>
${lines.map((l, i) => `<text x="20" y="${122 + i * 19}" font-family="${SANS}" font-size="13" fill="${C.soft}">${esc(l)}</text>`).join("\n")}
${chips}
<line x1="20" y1="220" x2="${W - 20}" y2="220" stroke="${C.border}"/>
${status}
<rect x="0" y="0" width="150" height="2" fill="url(#${sid})"><animate attributeName="x" from="-150" to="${W}" dur="3.6s" begin="${-(idx * 0.7).toFixed(1)}s" repeatCount="indefinite"/></rect>
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${C.border}"/>`;
  write(`card-${p.slug}.svg`, svg(W, H, body, `${t.title} — ${t.event}`));
}

// ───────────────────────── JOURNEY LOG ─────────────────────────
function journey() {
  const W = 1000;
  const log = [
    ["2026-10", "Hacktoberfest Elazığ · KulüpOS (solo)", "Hacktoberfest Elazığ · KulüpOS (solo)"],
    ["2026-08", "BTK IT Dept. internship", "BTK Bilgi Teknolojileri Dairesi stajı"],
    ["2026-07", "Microsoft AI Innovators Summer Internship", "Microsoft AI Innovators Yaz Stajı"],
    ["2026-07", "Turkcell CodeNight All Star Final", "Turkcell CodeNight All Star Finali"],
    ["2026-07", "İHH ATOM Hackathon · Bursa", "İHH ATOM Hackathon · Bursa"],
    ["2026-02", "Erasmus+ · Politechnika Częstochowska", "Erasmus+ · Politechnika Częstochowska"],
    ["2025-11", "HackStellar Hackathon · İstanbul", "HackStellar Hackathon · İstanbul"],
    ["2025-10", "Paribu Codex · Gaziantep · 4th place", "Paribu Codex · Gaziantep · 4.'lük"],
    ["2025-10", "CodeNight Diyarbakır · 2nd → All Star", "CodeNight Diyarbakır · 2.'lik → All Star"],
    ["2025-02", "GSB AI & Informatics Winter Camp · finalist", "GSB Yapay Zekâ Kış Kampı · finalist"],
  ];
  const H = 262, D = 18;
  const rows = log.map(([d, te, tt], i) => {
    const t = LANG === "en" ? te : tt;
    const col = i < 5 ? 0 : 1, r = i % 5;
    const x = 30 + col * 490, y = 112 + r * 30;
    const a = (1.2 + i * 0.5) / D;
    const op = `<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${a.toFixed(3)};${(a + 0.012).toFixed(3)};0.95;1" dur="${D}s" repeatCount="indefinite"/>`;
    return `<g opacity="0">${op}<text x="${x}" y="${y}" font-family="${MONO}" font-size="13.5" xml:space="preserve"><tspan fill="${C.muted}">[${d}]</tspan><tspan fill="${C.green}"> ✓ </tspan><tspan fill="${C.text}">${esc(t)}</tspan></text></g>`;
  }).join("\n");
  const body = `<defs><clipPath id="jw"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs>
<g clip-path="url(#jw)"><rect width="${W}" height="${H}" fill="${C.bg}"/>
${chrome(W, "~/sudenur/journey.log")}
<text x="30" y="76" font-family="${MONO}" font-size="14" fill="${C.green}">➜ $</text>
${typed("tail -f sudenur/journey.log", 76, 76, { begin: 0.2, size: 14, per: 0.045 })}
${rows}
<rect x="${30 + 490 * 1 + 0}" y="${112 + 4 * 30 + 18}" width="8" height="14" fill="${C.pink}">${blink()}</rect>
</g><rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${C.border}"/>`;
  write("journey.svg", svg(W, H, body, LANG === "en" ? "Journey: internships, hackathons, competitions" : "Yolculuk: stajlar, hackathonlar, yarışmalar"));
}

// ───────────────────────── STACK TICKER ─────────────────────────
function stack() {
  const W = 1000, H = 64;
  const items = ["React", "Next.js", "TypeScript", "Tailwind", "Python", "FastAPI", "NestJS", "PostgreSQL", "Prisma", "Docker", "Java", "C# / .NET", "Rust", "RAG / LLM", "Hugging Face", "Claude", "Gemini", "OWASP", "CTF"];
  const cols = [C.pink, C.violet, C.green];
  let x = 0;
  const chips = items.map((s, i) => {
    const w = Math.round([...s].length * 8.2 + 44);
    const col = cols[i % 3];
    const el = `<g transform="translate(${x} 12)"><rect width="${w}" height="40" rx="20" fill="${C.surface}" stroke="${C.border}"/><circle cx="20" cy="20" r="4" fill="${col}"/><text x="32" y="25" font-family="${MONO}" font-size="13.5" fill="${C.text}" textLength="${w - 46}" lengthAdjust="spacingAndGlyphs">${esc(s)}</text></g>`;
    x += w + 12; return el;
  });
  const total = x;
  const gid = id("sf");
  const body = `<defs><clipPath id="${gid}c"><rect width="${W}" height="${H}"/></clipPath>
<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.bg}"/><stop offset="0.08" stop-color="${C.bg}" stop-opacity="0"/><stop offset="0.92" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<g clip-path="url(#${gid}c)"><g>${chips.join("")}<g transform="translate(${total} 0)">${chips.join("")}</g>
<animateTransform attributeName="transform" type="translate" from="0 0" to="${-total} 0" dur="${(total / 42).toFixed(1)}s" repeatCount="indefinite"/></g></g>
<rect width="${W}" height="${H}" fill="url(#${gid})"/>`;
  write("stack.svg", svg(W, H, body, "Tools and stack"), true);
}

// ───────────────────────── CONTACT PILLS ─────────────────────────
function pill(file, label, color) {
  const w = Math.round([...label].length * 8.4 + 58), H = 44;
  const gid = id("pl");
  const body = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0" spreadMethod="reflect"><stop offset="0" stop-color="${C.pink}"/><stop offset="0.5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.green}"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-0.4 0;0.4 0;-0.4 0" dur="6s" repeatCount="indefinite"/></linearGradient></defs>
<rect x="1" y="1" width="${w - 2}" height="${H - 2}" rx="${(H - 2) / 2}" fill="${C.surface}" stroke="url(#${gid})" stroke-width="1.6"/>
<circle cx="22" cy="22" r="4" fill="${color}"><animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite"/></circle>
<text x="36" y="27" font-family="${MONO}" font-size="14" fill="${C.text}" textLength="${w - 54}" lengthAdjust="spacingAndGlyphs">${esc(label)}</text>`;
  write(file, svg(w, H, body, label), true);
  return w;
}

const HEADS = {
  en: [["h-about.svg", "// 01 — about", "Who am I?"], ["h-projects.svg", "// 02 — projects", "Selected work"], ["h-journey.svg", "// 03 — journey", "From hackathon nights to internships"], ["h-stack.svg", "// 04 — stack", "Tools I ship with"], ["h-contact.svg", "// 05 — contact", "Let's build something together"]],
  tr: [["h-about.svg", "// 01 — hakkımda", "Ben kimim?"], ["h-projects.svg", "// 02 — projeler", "Seçilmiş işler"], ["h-journey.svg", "// 03 — yolculuk", "Hackathon gecelerinden stajlara"], ["h-stack.svg", "// 04 — araçlar", "Elimin altındakiler"], ["h-contact.svg", "// 05 — iletişim", "Bir şey birlikte yapalım"]],
};

for (const lang of ["en", "tr"]) {
  LANG = lang;
  banner();
  HEADS[lang].forEach(([f, l, t]) => heading(f, l, t));
  projects.forEach(card);
  journey();
}
LANG = "en";
stack();
pill("btn-portfolio.svg", "sudenurozturk.tr", C.pink);
pill("btn-whodenur.svg", "whodenur.com", C.violet);
pill("btn-linkedin.svg", "linkedin/sudenurozturk", C.green);
pill("btn-mail.svg", "whodenur@gmail.com", C.pink);


// ───────────────────────── README (EN varsayılan, TR ayrı dosya) ─────────────────────────
const link = (p) => (p.live ? `https://${p.live}${p.slug === "genc-ihh-raporlama" ? "/login" : "/"}` : `https://${p.full || U + p.repo}`);

function readme(lang) {
  const en = lang === "en";
  const d = en ? "dist" : "dist/tr";
  const cards = projects.map((p) => `  <a href="${link(p)}"><img src="${d}/card-${p.slug}.svg" alt="${p[lang].title}" width="49%"></a>`).join("\n");
  const switcher = en
    ? `<p align="right"><b>EN</b> · <a href="README.tr.md">TR</a></p>`
    : `<p align="right"><a href="README.md">EN</a> · <b>TR</b></p>`;
  const about = en
    ? `I'm a software engineering student at Fırat University. I build AI products and dig into cybersecurity; I'm curious how systems actually work and **where they break**. I solved my first CTF with SQL injection.

**Right now:** building my software studio [Whodenur](https://www.whodenur.com) · working on AI and security`
    : `Yazılım mühendisliği öğrencisiyim (Fırat Üniversitesi). Yapay zekâ ürünleri geliştiriyorum, siber güvenlikle uğraşıyorum; sistemlerin nasıl çalıştığıyla ve **nerede kırıldığıyla** ilgileniyorum. İlk CTF'imi SQL injection ile çözdüm.

**Şu an:** yazılım stüdyom [Whodenur](https://www.whodenur.com)'u kuruyorum · yapay zekâ ve güvenlik üzerine çalışıyorum`;
  const H = HEADS[lang];
  const pills = `  <a href="https://www.sudenurozturk.tr"><img src="dist/btn-portfolio.svg" alt="sudenurozturk.tr"></a>
  <a href="https://www.whodenur.com"><img src="dist/btn-whodenur.svg" alt="whodenur.com"></a>
  <a href="https://linkedin.com/in/sudenurozturk"><img src="dist/btn-linkedin.svg" alt="LinkedIn"></a>`;
  return `${switcher}

<p align="center">
  <img src="${d}/banner.svg" alt="Sudenur Öztürk — whoami" width="100%">
</p>

<p align="center">
  <img src="${d}/seismo.svg" alt="${en ? "Contribution seismograph" : "Katkı sismografı"}" width="100%">
</p>

<p align="center">
${pills}
</p>

<img src="${d}/${H[0][0]}" alt="${H[0][1]}" width="100%">

${about}

<img src="${d}/${H[1][0]}" alt="${H[1][1]}" width="100%">

<p align="center">
${cards}
</p>

<img src="${d}/${H[2][0]}" alt="${H[2][1]}" width="100%">

<p align="center">
  <img src="${d}/journey.svg" alt="${en ? "Journey: internships, hackathons, competitions" : "Yolculuk: stajlar, hackathonlar, yarışmalar"}" width="100%">
</p>

<img src="${d}/${H[3][0]}" alt="${H[3][1]}" width="100%">

<p align="center">
  <img src="dist/stack.svg" alt="TypeScript, Next.js, React, Python, Java, C#, Rust, PostgreSQL, Docker, RAG/LLM, OWASP, CTF" width="100%">
</p>

<img src="${d}/${H[4][0]}" alt="${H[4][1]}" width="100%">

<p align="center">
${pills}
  <a href="mailto:whodenur@gmail.com"><img src="dist/btn-mail.svg" alt="whodenur@gmail.com"></a>
</p>
`;
}
fs.writeFileSync("README.md", readme("en"));
fs.writeFileSync("README.tr.md", readme("tr"));
console.log("yazıldı: README.md (EN), README.tr.md (TR)");

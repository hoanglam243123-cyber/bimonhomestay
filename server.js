// Bimon Homestay website: trang giới thiệu, trang phòng, "Ăn gì quanh Bimon", đánh giá, kiểm tra phòng trống.
const fs = require("fs");
const path = require("path");
const express = require("express");
const compression = require("compression");

loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const SITE_URL = (process.env.SITE_URL || "").replace(/\/+$/, "");
const PUBLIC_DIR = path.join(__dirname, "public");

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(compression());
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    // Chỉ cho chạy script/CSS/ảnh từ chính website (và font Google), chặn nhúng script lạ
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  });
  // Bắt buộc HTTPS cho các lần truy cập sau (chỉ gửi khi đang chạy HTTPS thật)
  if (req.secure) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// ---------- Trang HTML ----------
// Đọc sẵn vào bộ nhớ, thay __SITE_URL__ bằng tên miền thật lúc trả về.
const pages = {
  "/": fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8"),
  "/an-gi": fs.readFileSync(path.join(PUBLIC_DIR, "an-gi.html"), "utf8"),
};
const GA_ID = /^G-[A-Z0-9]{4,15}$/.test(process.env.GA_MEASUREMENT_ID || "") ? process.env.GA_MEASUREMENT_ID : "";
const GA_TAG = GA_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}");</script>
` : "";
const withAnalytics = (html) => (GA_TAG ? html.replace("</head>", GA_TAG + "</head>") : html);
const baseUrl = (req) => SITE_URL || `${req.protocol}://${req.get("host")}`;

for (const [route, html] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    res.set("Cache-Control", "public, max-age=300");
    res.type("html").send(withAnalytics(html.replaceAll("__SITE_URL__", baseUrl(req))));
  });
}
// ---------- Trang chi tiết phòng: /phong/bi, /phong/mun, /phong/moon ----------
// Thông tin trong content/rooms.json, ảnh tự lấy từ public/img/phong/<phòng>/ (sắp theo tên file).
const ROOMS_FILE = path.join(__dirname, "content", "rooms.json");
const ROOM_IMG_DIR = path.join(PUBLIC_DIR, "img", "phong");
const escHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Dùng lại menu, khối liên hệ, chân trang và nút liên hệ nổi của trang chủ để hai nơi luôn giống nhau.
const homeHtml = pages["/"];
const pick = (re) => (homeHtml.match(re) || [""])[0];
const shell = {
  nav: pick(/<header class="nav"[\s\S]*?<\/header>/).replace(/href="#/g, 'href="/#'),
  contact: pick(/<section class="wrap sec" id="dat-phong">[\s\S]*?<\/section>/),
  foot: pick(/<footer class="foot">[\s\S]*?<\/footer>/).replace('href="#top"', 'href="/"'),
  fab: pick(/<div class="fab" id="fab">[\s\S]*?\n<\/div>/),
  css: pick(/\/css\/home\.css\?v=\d+/),
};

const vnd = (n) => n.toLocaleString("vi-VN") + "đ";

function roomPhotos(slug) {
  try {
    return fs.readdirSync(path.join(ROOM_IMG_DIR, slug))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/img/phong/${slug}/${encodeURIComponent(f)}`);
  } catch { return []; }
}

function renderRoom(slug, rooms, req) {
  const r = rooms[slug];
  const site = baseUrl(req);
  const photos = [r.cover, ...roomPhotos(slug)].filter(Boolean);
  const en = { [`${slug}_t`]: r.name.en, [`${slug}_d`]: r.desc.en };
  if (r.price) Object.assign(en, { rp_from: `From ${r.price.week.toLocaleString("en-US")}₫/night`, rp_wk: `Fri & Sat: ${r.price.weekend.toLocaleString("en-US")}₫` });
  const t = (key, v) => { en[key] = v.en; return `data-i="${key}">${escHtml(v.vi)}`; };
  const tags = r.tags.map((v, i) => `<li ${t(`tag${i}`, v)}</li>`).join("");
  const amen = r.amenities.map((v, i) => `<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span ${t(`am${i}`, v)}</span></li>`).join("");
  const vid = r.video ? `<figure class="rp-video"><video src="${escHtml(r.video.src)}" poster="${escHtml(r.video.poster)}" controls playsinline muted loop preload="metadata" aria-label="${escHtml(r.video.vi)}"></video></figure>` : "";
  const gal = photos.map((src, i) => `<button type="button" data-full="${escHtml(src)}"${i === 0 ? ' class="first"' : ""}><img src="${escHtml(src)}" alt="${escHtml(r.name.vi)}, ảnh ${i + 1}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></button>`).join("");
  const others = Object.entries(rooms).filter(([k]) => k !== slug && !k.startsWith("_")).map(([k, o]) => {
    en[`${k}_t`] = o.name.en;
    return `<a class="rp-card" href="/phong/${k}"><img src="${escHtml(o.cover)}" alt="" loading="lazy"><span><b data-i="${k}_t">${escHtml(o.name.vi)}</b><small data-i="rp_view">Xem phòng</small></span></a>`;
  }).join("");
  const title = `${r.name.vi} | Bimon Homestay Hải Phòng`;
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<script>try{var t=localStorage.getItem("bimon-theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}</script>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(r.desc.vi)}">
<link rel="canonical" href="${site}/phong/${slug}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escHtml(title)}">
<meta property="og:description" content="${escHtml(r.desc.vi)}">
<meta property="og:image" content="${site}${escHtml(r.cover)}">
<meta property="og:url" content="${site}/phong/${slug}">
<meta property="og:locale" content="vi_VN">
<meta name="theme-color" content="#4A5D3A">
<link rel="icon" href="/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="${shell.css}">
</head>
<body>
<a class="skip" href="#main" data-i="skip">Bỏ qua tới nội dung</a>
${shell.nav}

<main id="main">
  <div class="wrap rp">
    <a class="rp-back" href="/#cac-phong"><span aria-hidden="true">←</span> <span data-i="rp_back">Tất cả phòng</span></a>
    <div class="rp-head">
      <h1 data-i="${slug}_t">${escHtml(r.name.vi)}</h1>
      <ul class="tags">${tags}</ul>
      <p class="lead" data-i="${slug}_d">${escHtml(r.desc.vi)}</p>
      ${r.price ? `<p class="price"><b data-i="rp_from">Từ ${vnd(r.price.week)}/đêm</b><span data-i="rp_wk">Thứ 6, thứ 7: ${vnd(r.price.weekend)}</span></p>` : ""}
    </div>
    <h2 class="sr-only" data-i="rp_photos">Ảnh phòng</h2>
    ${vid}
    <div class="rp-gal${photos.length === 1 ? " one" : ""}">${gal}</div>
    <section class="rp-amen">
      <h2 data-i="rp_amen">Tiện nghi trong phòng</h2>
      <ul>${amen}</ul>
    </section>
  </div>

  ${shell.contact}

  <section class="sec tint">
    <div class="wrap">
      <h2 data-i="rp_other">Phòng khác</h2>
      <div class="rp-others">${others}</div>
    </div>
  </section>
</main>

${shell.foot}

<dialog class="lb" id="lb" aria-label="Ảnh phòng">
  <img id="lbImg" alt="">
  <button class="lb-btn lb-close" id="lbClose" type="button" aria-label="Đóng">✕</button>
  <button class="lb-btn lb-prev" id="lbPrev" type="button" aria-label="Ảnh trước">‹</button>
  <button class="lb-btn lb-next" id="lbNext" type="button" aria-label="Ảnh sau">›</button>
  <p class="lb-pos" id="lbPos"></p>
</dialog>

${shell.fab}

<script type="application/json" id="room-i18n">${JSON.stringify(en).replace(/</g, "\\u003c")}</script>
<script src="/js/theme.js?v=1" defer></script>
<script src="/js/fab.js?v=1" defer></script>
<script src="/js/phong.js?v=1" defer></script>
</body>
</html>`;
}

function readRooms() {
  try { return JSON.parse(fs.readFileSync(ROOMS_FILE, "utf8")); }
  catch (err) { console.error("[rooms] content/rooms.json lỗi:", err.message); return {}; }
}
const roomSlugs = Object.keys(readRooms()).filter((k) => !k.startsWith("_"));

app.get("/phong/:slug", (req, res, next) => {
  const rooms = readRooms();
  if (req.params.slug.startsWith("_") || !rooms[req.params.slug]) return next();
  // Không cho trình duyệt giữ bản cũ: sửa rooms.json hay thêm ảnh là thấy ngay.
  res.set("Cache-Control", "no-cache");
  res.type("html").send(withAnalytics(renderRoom(req.params.slug, rooms, req)));
});

app.get(["/index.html", "/an-gi.html"], (req, res) =>
  res.redirect(301, req.path === "/index.html" ? "/" : "/an-gi")
);

app.get("/robots.txt", (req, res) =>
  res.type("text/plain").send(`User-agent: *\nDisallow: /api/\nSitemap: ${baseUrl(req)}/sitemap.xml\n`)
);
app.get("/sitemap.xml", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [...Object.keys(pages), ...roomSlugs.map((s) => `/phong/${s}`)]
    .map((p) => `<url><loc>${baseUrl(req)}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join("");
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  );
});
app.get("/healthz", (req, res) => res.json({ ok: true }));

app.use(
  express.static(PUBLIC_DIR, {
    index: false,
    maxAge: "7d",
    setHeaders: (res, file) => {
      if (file.endsWith(".html")) res.set("Cache-Control", "public, max-age=300");
    },
  })
);

const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));

// ---------- Đánh giá Google ----------
// Ưu tiên lấy trực tiếp từ Google Places API (tối đa 5 đánh giá Google trả về), lưu tạm 12 giờ.
// Không có API key thì đọc file content/reviews.json (chủ nhà tự dán đánh giá vào).
const REVIEWS_FILE = path.join(__dirname, "content", "reviews.json");
const MAPS_URL = process.env.GOOGLE_MAPS_URL || "https://share.google/xh4tSK7Lf7EP9lr3K";
let reviewsCache = { at: 0, data: null };

async function fetchGoogleReviews() {
  const key = process.env.GOOGLE_PLACES_API_KEY, placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;
  const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=vi`, {
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
  });
  if (!r.ok) throw new Error(`Places API ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const p = await r.json();
  return {
    source: "google",
    rating: p.rating || null,
    count: p.userRatingCount || 0,
    url: p.googleMapsUri || MAPS_URL,
    reviews: (p.reviews || []).map((v) => ({
      author: v.authorAttribution?.displayName || "Khách Google",
      photo: v.authorAttribution?.photoUri || "",
      rating: v.rating || 5,
      text: v.originalText?.text || v.text?.text || "",
      time: v.relativePublishTimeDescription || "",
    })),
  };
}

function readManualReviews() {
  if (!fs.existsSync(REVIEWS_FILE)) return null;
  try {
    const d = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf8"));
    return { source: "manual", rating: d.rating || null, count: d.count || 0, url: d.url || MAPS_URL, reviews: (d.reviews || []).filter((v) => v.text) };
  } catch (err) {
    console.error("[reviews] content/reviews.json lỗi:", err.message);
    return null;
  }
}

app.get(["/api/reviews", "/reviews.json"], async (req, res) => {
  if (!reviewsCache.data || Date.now() - reviewsCache.at > 12 * 3600 * 1000) {
    let data = null;
    try { data = await fetchGoogleReviews(); } catch (err) { console.error("[reviews]", err.message); }
    reviewsCache = { at: Date.now(), data: data || readManualReviews() || { source: "none", rating: null, count: 0, url: MAPS_URL, reviews: [] } };
  }
  res.set("Cache-Control", "public, max-age=3600").json(reviewsCache.data);
});

// ---------- Phòng trống: đọc lịch màu trong Google Sheet ----------
// Google Apps Script trong bảng tính (scripts/google-apps-script.gs) trả về các trang lịch "T10/2026"...
// gồm chữ và màu từng ô. Ô ngày có màu = đêm đó đã có khách; đỏ = khách giờ; trắng = trống.
const AVAILABILITY_URL = process.env.AVAILABILITY_URL || "";
const FLOOR_ROOM = { 2: "bi", 3: "moon", 4: "mun" };
let calCache = { at: 0, data: null };

function colorStatus(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex || "").trim());
  if (!m) return "free";
  const [r, g, b] = m.slice(1).map((h) => parseInt(h, 16));
  if (r >= 235 && g >= 235 && b >= 235) return "free"; // trắng
  if (r > 150 && g < 120 && r - g > 60 && r - b > 60) return "hourly"; // đỏ: khách giờ
  return "booked"; // vàng/cam hoặc màu khác: đã book
}

// Đọc một trang "T10/2026": tìm nhãn "Tầng 2/3/4", lịch 7 cột nằm ngay dưới hàng thứ (T2...CN).
// Trả về { "2026-10-03": { bi: "booked", moon: "hourly", mun: "free" }, ... }
function parseMonthSheet(name, values, colors) {
  const nm = /^T(\d{1,2})\/(\d{4})$/.exec(name);
  if (!nm) return {};
  const month = Number(nm[1]), year = Number(nm[2]);
  const days = {};
  values.forEach((row, r) => row.forEach((cell, c) => {
    const fm = /Tầng\s*(\d)/i.exec(String(cell));
    const room = fm && FLOOR_ROOM[fm[1]];
    if (!room) return;
    const head = values[r + 1] || [];
    let c0 = -1;
    for (let k = Math.max(0, c - 3); k <= c + 1; k++) if (String(head[k] || "").trim().toUpperCase() === "T2") { c0 = k; break; }
    if (c0 < 0) return;
    for (let rr = r + 2; rr < Math.min(values.length, r + 9); rr++) {
      for (let k = c0; k < c0 + 7; k++) {
        const d = Number(String((values[rr] || [])[k] || "").trim());
        if (!Number.isInteger(d) || d < 1 || d > 31) continue;
        const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        (days[key] ||= {})[room] = colorStatus((colors[rr] || [])[k]);
      }
    }
  }));
  return days;
}

async function loadCalendar() {
  if (!AVAILABILITY_URL) return null;
  if (calCache.data && Date.now() - calCache.at < 5 * 60 * 1000) return calCache.data;
  try {
    const r = await fetch(AVAILABILITY_URL, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    const days = {};
    for (const [name, s] of Object.entries(j.sheets || {})) Object.assign(days, parseMonthSheet(name, s.values || [], s.colors || []));
    calCache = { at: Date.now(), data: days };
  } catch (err) {
    console.error("[phong-trong]", err.message);
    if (calCache.data) calCache.at = Date.now() - 4 * 60 * 1000; // lỗi tạm: dùng bản cũ, thử lại sau 1 phút
  }
  return calCache.data;
}

// Giới hạn 60 lần / phút / IP cho API kiểm tra phòng (chống spam)
const apiHits = new Map();
setInterval(() => apiHits.clear(), 60 * 1000).unref();
function apiLimit(req, res, next) {
  const n = (apiHits.get(req.ip) || 0) + 1;
  apiHits.set(req.ip, n);
  if (n > 60) return res.status(429).json({ error: "too_many" });
  next();
}

app.get("/api/phong-trong", apiLimit, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const { den, di } = req.query;
  if (!isDate(den) || !isDate(di) || di <= den) return res.status(400).json({ error: "dates" });
  const nights = [];
  for (let d = new Date(den + "T00:00:00Z"); d < new Date(di + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) nights.push(d.toISOString().slice(0, 10));
  if (nights.length > 31) return res.status(400).json({ error: "range" });
  const cal = await loadCalendar();
  if (!cal) return res.json({ ready: false });
  const rooms = {};
  for (const room of Object.values(FLOOR_ROOM)) {
    const st = nights.map((n) => cal[n]?.[room] || "unknown");
    rooms[room] = st.includes("booked") ? "booked" : st.every((s) => s === "free") ? "free" : "ask";
  }
  res.json({ ready: true, nights: nights.length, rooms });
});

app.use((req, res) => res.status(404).type("html").send(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Không tìm thấy trang</title>
<body style="font-family:system-ui;background:#f3efe3;color:#1f2a1c;display:grid;place-items:center;min-height:90vh;text-align:center;padding:16px">
<div><h1 style="color:#4a5d3a">Lạc đường rồi!</h1><p>Trang này không tồn tại.</p><p><a href="/" style="color:#4a5d3a;font-weight:700">Về Bimon Homestay</a></p></div></body>`
));

app.listen(PORT, () => console.log(`Bimon Homestay chạy tại http://localhost:${PORT}`));

// Đọc file .env đơn giản (Hostinger thì khai báo biến môi trường trong hPanel).
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

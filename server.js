// Bimon Homestay website: trang giới thiệu, trang "Ăn gì quanh Bimon", nhận yêu cầu đặt phòng.
const fs = require("fs");
const path = require("path");
const express = require("express");
const compression = require("compression");
const nodemailer = require("nodemailer");

loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const SITE_URL = (process.env.SITE_URL || "").replace(/\/+$/, "");
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.jsonl");
const PUBLIC_DIR = path.join(__dirname, "public");

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(compression());
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
});

// ---------- Trang HTML ----------
// Đọc sẵn vào bộ nhớ, thay __SITE_URL__ bằng tên miền thật lúc trả về.
const pages = {
  "/": fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8"),
  "/an-gi": fs.readFileSync(path.join(PUBLIC_DIR, "an-gi.html"), "utf8"),
};
const baseUrl = (req) => SITE_URL || `${req.protocol}://${req.get("host")}`;

for (const [route, html] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    res.set("Cache-Control", "public, max-age=300");
    res.type("html").send(html.replaceAll("__SITE_URL__", baseUrl(req)));
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
  const t = (key, v) => { en[key] = v.en; return `data-i="${key}">${escHtml(v.vi)}`; };
  const tags = r.tags.map((v, i) => `<li ${t(`tag${i}`, v)}</li>`).join("");
  const amen = r.amenities.map((v, i) => `<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span ${t(`am${i}`, v)}</span></li>`).join("");
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
    </div>
    <h2 class="sr-only" data-i="rp_photos">Ảnh phòng</h2>
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
  res.type("html").send(renderRoom(req.params.slug, rooms, req));
});

app.get(["/index.html", "/an-gi.html"], (req, res) =>
  res.redirect(301, req.path === "/index.html" ? "/" : "/an-gi")
);

app.get("/robots.txt", (req, res) =>
  res.type("text/plain").send(`User-agent: *\nDisallow: /admin\nDisallow: /api/\nSitemap: ${baseUrl(req)}/sitemap.xml\n`)
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

// ---------- Nhận yêu cầu đặt phòng ----------
const hits = new Map(); // giới hạn 5 yêu cầu / 10 phút / IP
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const ROOMS = ["Phòng Bi", "Phòng Mun", "Phòng Moon", "Phòng nào cũng được"];
const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const vnDate = (v) => v.split("-").reverse().join("/");

app.post("/api/dat-phong", express.json({ limit: "10kb" }), async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // bẫy bot (ô ẩn)
  if (rateLimited(req.ip)) return res.status(429).json({ ok: false, error: "Bạn gửi quá nhiều lần, thử lại sau ít phút." });

  const booking = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    ten: clean(b.ten, 80),
    sdt: clean(b.sdt, 20),
    den: clean(b.den, 10),
    di: clean(b.di, 10),
    phong: ROOMS.includes(b.phong) ? b.phong : "Phòng nào cũng được",
    khach: clean(b.khach, 2),
    ghichu: clean(b.ghichu, 1000),
    lang: b.lang === "en" ? "en" : "vi",
    ip: req.ip,
  };
  const errors = [];
  if (!booking.ten) errors.push("Thiếu tên");
  if (!/^[+0-9 .()-]{8,20}$/.test(booking.sdt)) errors.push("Số điện thoại không hợp lệ");
  if (!isDate(booking.den) || !isDate(booking.di) || booking.di <= booking.den) errors.push("Ngày không hợp lệ");
  if (errors.length) return res.status(400).json({ ok: false, error: errors.join(", ") });

  fs.appendFileSync(BOOKINGS_FILE, JSON.stringify(booking) + "\n");
  res.json({ ok: true, id: booking.id });

  // Báo cho chủ nhà qua Zalo / email (không chặn phản hồi cho khách)
  notify(booking).catch((err) => console.error("[notify]", err.message));
});

function summary(k) {
  const nights = Math.round((Date.parse(k.di) - Date.parse(k.den)) / 864e5);
  return [
    "🏠 YÊU CẦU ĐẶT PHÒNG MỚI - Bimon Homestay",
    `Tên: ${k.ten}`,
    `SĐT: ${k.sdt}`,
    `Phòng: ${k.phong}`,
    `Nhận: ${vnDate(k.den)} · Trả: ${vnDate(k.di)} (${nights} đêm)`,
    `Số khách: ${k.khach === "5" ? "5+" : k.khach}`,
    k.ghichu ? `Ghi chú: ${k.ghichu}` : null,
    k.lang === "en" ? "Khách dùng tiếng Anh" : null,
  ].filter(Boolean).join("\n");
}

let mailer = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function notify(k) {
  const text = summary(k);
  const jobs = [];
  if (mailer && process.env.NOTIFY_EMAIL) {
    jobs.push(
      mailer.sendMail({
        from: `"Bimon Website" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: `Đặt phòng: ${k.ten} · ${vnDate(k.den)} → ${vnDate(k.di)}`,
        text,
      })
    );
  }
  if (process.env.ZALO_BOT_TOKEN && process.env.ZALO_CHAT_ID) {
    jobs.push(
      fetch(`https://bot-api.zaloplatforms.com/bot${process.env.ZALO_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.ZALO_CHAT_ID, text }),
      }).then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok || body.ok === false) throw new Error(`Zalo ${r.status} ${JSON.stringify(body)}`);
      })
    );
  }
  const results = await Promise.allSettled(jobs);
  results.filter((r) => r.status === "rejected").forEach((r) => console.error("[notify]", r.reason?.message || r.reason));
}

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

app.get("/api/reviews", async (req, res) => {
  if (!reviewsCache.data || Date.now() - reviewsCache.at > 12 * 3600 * 1000) {
    let data = null;
    try { data = await fetchGoogleReviews(); } catch (err) { console.error("[reviews]", err.message); }
    reviewsCache = { at: Date.now(), data: data || readManualReviews() || { source: "none", rating: null, count: 0, url: MAPS_URL, reviews: [] } };
  }
  res.set("Cache-Control", "public, max-age=3600").json(reviewsCache.data);
});

// ---------- Trang quản trị: xem yêu cầu đặt phòng ----------
function requireAdmin(req, res, next) {
  const user = process.env.ADMIN_USER, pass = process.env.ADMIN_PASS;
  if (!user || !pass) return res.status(503).send("Chưa cấu hình ADMIN_USER / ADMIN_PASS.");
  const [type, token] = (req.get("authorization") || "").split(" ");
  const [u, p] = type === "Basic" && token ? Buffer.from(token, "base64").toString().split(/:(.*)/s) : [];
  if (u === user && p === pass) return next();
  res.set("WWW-Authenticate", 'Basic realm="Bimon admin", charset="UTF-8"').status(401).send("Cần đăng nhập.");
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function readBookings() {
  if (!fs.existsSync(BOOKINGS_FILE)) return [];
  return fs.readFileSync(BOOKINGS_FILE, "utf8").split("\n").filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean).reverse();
}

app.get("/admin", requireAdmin, (req, res) => {
  const rows = readBookings().map((k) => `<tr>
    <td>${esc(new Date(k.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }))}</td>
    <td>${esc(k.ten)}</td><td><a href="tel:${esc(k.sdt.replace(/[^+0-9]/g, ""))}">${esc(k.sdt)}</a></td>
    <td>${esc(k.phong)}</td><td>${esc(vnDate(k.den))} → ${esc(vnDate(k.di))}</td><td>${esc(k.khach)}</td><td>${esc(k.ghichu)}</td></tr>`).join("");
  res.set("Cache-Control", "no-store").type("html").send(`<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Bimon · Yêu cầu đặt phòng</title>
<style>body{font-family:system-ui,sans-serif;background:#f3efe3;color:#1f2a1c;margin:0;padding:16px}h1{color:#4a5d3a;font-size:1.3rem}
.t{overflow-x:auto}table{border-collapse:collapse;width:100%;background:#fbf8f0;font-size:.9rem}th,td{padding:8px 10px;border-bottom:1px solid #d8d2bf;text-align:left;vertical-align:top}
th{background:#4a5d3a;color:#fff;white-space:nowrap}a{color:#4a5d3a;font-weight:600}</style></head><body>
<h1>Yêu cầu đặt phòng (${readBookings().length})</h1><p><a href="/admin/bookings.csv">Tải file CSV</a></p>
<div class="t"><table><thead><tr><th>Gửi lúc</th><th>Tên</th><th>SĐT</th><th>Phòng</th><th>Ngày</th><th>Khách</th><th>Ghi chú</th></tr></thead>
<tbody>${rows || '<tr><td colspan="7">Chưa có yêu cầu nào.</td></tr>'}</tbody></table></div></body></html>`);
});

app.get("/admin/bookings.csv", requireAdmin, (req, res) => {
  const cols = ["createdAt", "ten", "sdt", "phong", "den", "di", "khach", "ghichu"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...readBookings().map((k) => cols.map((c) => q(k[c])).join(","))].join("\n");
  res.set("Content-Disposition", 'attachment; filename="bimon-dat-phong.csv"').type("text/csv").send("﻿" + csv);
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

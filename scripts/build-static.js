// Xuất website thành file tĩnh vào thư mục dist/ để đưa lên hosting không có Node.js
// (Hostinger Premium, Cloudflare Pages...). Cách làm: chạy server.js tạm trên máy,
// tải từng trang về rồi lưu thành file, nên bản tĩnh luôn giống hệt bản đang chạy.
//
//   npm run build:static                                  (dùng SITE_URL trong .env nếu có)
//   SITE_URL=https://bimonhomestay.com npm run build:static
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");
const PORT = 4000 + Math.floor(Math.random() * 1000);
const LOCAL = `http://localhost:${PORT}`;

// SITE_URL: tên miền thật, dùng cho link chia sẻ Facebook/Zalo và Google.
let SITE_URL = process.env.SITE_URL || "";
if (!SITE_URL && fs.existsSync(path.join(ROOT, ".env"))) {
  const m = fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^\s*SITE_URL\s*=\s*(.+?)\s*$/m);
  if (m) SITE_URL = m[1].replace(/^["']|["']$/g, "");
}
SITE_URL = SITE_URL.replace(/\/+$/, "");

async function main() {
  const rooms = Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, "content", "rooms.json"), "utf8"))).filter((k) => !k.startsWith("_"));

  const server = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), SITE_URL: SITE_URL || LOCAL, DATA_DIR: path.join(ROOT, "data") },
    stdio: ["ignore", "ignore", "inherit"],
  });
  try {
    await waitForServer();
    fs.rmSync(DIST, { recursive: true, force: true });

    // Ảnh, CSS, JS: chép nguyên (bỏ file .html vì trang sẽ được tải từ server).
    fs.cpSync(PUBLIC, DIST, { recursive: true, filter: (src) => !src.endsWith(".html") && !src.endsWith(".gitkeep") });

    // Trang: /an-gi lưu thành an-gi/index.html để đường dẫn giữ nguyên trên mọi hosting.
    const pages = { "/": "index.html", "/an-gi": "an-gi/index.html" };
    for (const r of rooms) pages[`/phong/${r}`] = `phong/${r}/index.html`;
    for (const [url, file] of Object.entries(pages)) await save(url, file);
    await save("/reviews.json", "reviews.json");
    await save("/sitemap.xml", "sitemap.xml");
    await save("/robots.txt", "robots.txt");
    await save("/khong-co-trang-nay", "404.html", 404);
    fs.writeFileSync(path.join(DIST, ".htaccess"), HTACCESS);

    console.log(`\nXong! Website tĩnh nằm trong thư mục dist/ (${Object.keys(pages).length} trang).`);
    if (makeZip()) console.log("Đã đóng gói: bimon-website-static.zip (tải file này lên Hostinger rồi giải nén vào public_html).");
    if (!SITE_URL) console.log("Lưu ý: chưa có SITE_URL. Khi có tên miền, chạy lại: SITE_URL=https://ten-mien-cua-ban npm run build:static");
  } finally {
    server.kill();
  }
}

async function save(url, file, expectStatus = 200) {
  const res = await fetch(LOCAL + url);
  if (res.status !== expectStatus) throw new Error(`${url} trả về ${res.status}`);
  let body = await res.text();
  // Chưa có tên miền thì dùng đường dẫn tương đối thay cho localhost.
  if (!SITE_URL) body = body.replaceAll(LOCAL, "");
  const out = path.join(DIST, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, body);
  console.log("  ✓", url, "→", file);
}

// Nén dist/ thành zip (đường dẫn dùng "/" để giải nén đúng trên hosting Linux).
function makeZip() {
  const zip = path.join(ROOT, "bimon-website-static.zip");
  fs.rmSync(zip, { force: true });
  const tar = process.platform === "win32" ? path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe") : null;
  const r = tar
    ? require("child_process").spawnSync(tar, ["-a", "-cf", zip, "."], { cwd: DIST })
    : require("child_process").spawnSync("zip", ["-qr", zip, "."], { cwd: DIST });
  return r.status === 0;
}

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(LOCAL + "/healthz")).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Không khởi động được server.js");
}

// Cho hosting Apache/LiteSpeed (Hostinger): trang 404, nén, và cache giống server.js.
const HTACCESS = `DirectoryIndex index.html
ErrorDocument 404 /404.html
Options -Indexes

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/plain application/xml
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  <FilesMatch "\\.(webp|png|jpe?g|css|js)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
  <FilesMatch "\\.(html|json)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;

main().catch((err) => { console.error("\nLỗi:", err.message); process.exit(1); });

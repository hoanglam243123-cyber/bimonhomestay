// Tìm GOOGLE_PLACE_ID của Bimon trên Google Maps để website lấy đánh giá tự động.
// Cách dùng: GOOGLE_PLACES_API_KEY=xxx npm run google:place-id
const fs = require("fs");
const path = require("path");
const envFile = path.join(__dirname, "..", ".env");
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
}
const key = process.env.GOOGLE_PLACES_API_KEY;
const query = process.argv.slice(2).join(" ") || "Bimon Homestay 141 Cầu Đất Hải Phòng";
if (!key) { console.error("Thiếu GOOGLE_PLACES_API_KEY"); process.exit(1); }

(async () => {
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount" },
    body: JSON.stringify({ textQuery: query, languageCode: "vi" }),
  });
  const body = await r.json();
  if (!r.ok) { console.error(JSON.stringify(body, null, 2)); process.exit(1); }
  for (const p of body.places || []) console.log(`${p.displayName?.text} | ${p.formattedAddress} | ${p.rating ?? "-"}★ (${p.userRatingCount ?? 0})\n  GOOGLE_PLACE_ID=${p.id}\n`);
  if (!body.places?.length) console.log("Không tìm thấy. Thử: npm run google:place-id \"tên trên Google Maps\"");
})().catch((e) => { console.error(e.message); process.exit(1); });

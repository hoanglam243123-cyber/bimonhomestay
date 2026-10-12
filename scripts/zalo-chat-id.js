// Lấy mã chat Zalo của chủ nhà để bot gửi thông báo đặt phòng.
// Cách dùng: nhắn 1 tin bất kỳ cho bot trên Zalo, rồi chạy:  ZALO_BOT_TOKEN=xxx npm run zalo:chat-id
const fs = require("fs");
const path = require("path");
const envFile = path.join(__dirname, "..", ".env");
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
}
const token = process.env.ZALO_BOT_TOKEN;
if (!token) { console.error("Thiếu ZALO_BOT_TOKEN (khai báo trong .env hoặc chạy ZALO_BOT_TOKEN=... npm run zalo:chat-id)"); process.exit(1); }

(async () => {
  console.log("Đang chờ tin nhắn gửi tới bot (tối đa 30 giây)... Hãy nhắn 1 tin cho bot trên Zalo nếu chưa nhắn.");
  const r = await fetch(`https://bot-api.zaloplatforms.com/bot${token}/getUpdates`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ timeout: "30" }),
  });
  const body = await r.json().catch(() => ({}));
  const updates = [].concat(body.result || []);
  const chats = updates.map((u) => u.message?.chat?.id || u.message?.from?.id).filter(Boolean);
  if (!chats.length) { console.log("Chưa thấy tin nhắn nào. Phản hồi từ Zalo:", JSON.stringify(body, null, 2)); process.exit(1); }
  for (const id of new Set(chats)) console.log(`\nZALO_CHAT_ID=${id}`);
  console.log("\nDán dòng trên vào .env (hoặc biến môi trường trên Hostinger).");
})().catch((e) => { console.error(e.message); process.exit(1); });

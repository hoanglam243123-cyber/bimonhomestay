// Bimon Homestay – trang chi tiết phòng: song ngữ, xem ảnh phóng to.
const $ = (id) => document.getElementById(id);

// ---------- Ngôn ngữ ----------
const EN = {
  skip: "Skip to content", n_rooms: "Rooms", n_amen: "Amenities", n_rev: "Reviews", n_loc: "Location", n_food: "Food", book: "Book now",
  rp_back: "All rooms", rp_photos: "Photos", rp_amen: "In the room", rp_other: "Other rooms", rp_view: "View room",
  b_eye: "Booking", b_title: "Call or text Bimon", b_lead: "Bimon checks availability and sends you a quote right away.", c_msg: "Message us on Messenger",
  foot: "At Bimon you don't just rent a room, you join a family of travellers.",
};
const ZH = {
  skip: "跳到主要内容", n_rooms: "房间", n_amen: "设施", n_rev: "评价", n_loc: "位置", n_food: "美食", book: "立即预订",
  rp_back: "全部房间", rp_photos: "照片", rp_amen: "房内设施", rp_other: "其他房间", rp_view: "查看房间",
  b_eye: "预订", b_title: "给 Bimon 打电话或发消息", b_lead: "Bimon 会马上查看空房并给你报价。", c_msg: "通过 Messenger 联系",
  foot: "在 Bimon，你不只是租一个房间，而是加入一个旅行者的大家庭。",
};
// Dữ liệu phòng do server gửi kèm: { en: {...}, zh: {...} }
const ROOM = JSON.parse($("room-i18n").textContent);
Object.assign(EN, ROOM.en || ROOM);
Object.assign(ZH, ROOM.zh || {});
const VI = {};
document.querySelectorAll("[data-i]").forEach((el) => { if (!(el.dataset.i in VI)) VI[el.dataset.i] = el.textContent; });
function setLang(l) {
  const word = (k) => (l === "en" ? EN[k] : l === "zh" ? ZH[k] || EN[k] : VI[k]);
  document.querySelectorAll("[data-i]").forEach((el) => { const v = word(el.dataset.i); if (v) el.textContent = v; });
  document.documentElement.lang = l === "zh" ? "zh-Hans" : l;
  $("l-vi").setAttribute("aria-pressed", l === "vi");
  $("l-en").setAttribute("aria-pressed", l === "en");
  $("l-zh").setAttribute("aria-pressed", l === "zh");
  try { localStorage.setItem("bimon-lang", l); } catch (e) {}
}
$("l-vi").onclick = () => setLang("vi");
$("l-en").onclick = () => setLang("en");
$("l-zh").onclick = () => setLang("zh");
try { const l = localStorage.getItem("bimon-lang"); if (l === "en" || l === "zh") setLang(l); } catch (e) {}

// ---------- Xem ảnh phóng to ----------
const shots = [...document.querySelectorAll(".rp-gal button")];
const lb = $("lb"), lbImg = $("lbImg");
let cur = 0;
function show(i) {
  cur = (i + shots.length) % shots.length;
  const img = shots[cur].querySelector("img");
  lbImg.src = shots[cur].dataset.full; lbImg.alt = img.alt;
  $("lbPos").textContent = `${cur + 1} / ${shots.length}`;
}
shots.forEach((b, i) => b.addEventListener("click", () => { show(i); lb.showModal(); }));
$("lbPrev").onclick = () => show(cur - 1);
$("lbNext").onclick = () => show(cur + 1);
$("lbClose").onclick = () => lb.close();
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
let x0 = null;
lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0; x0 = null;
  if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
});
if (shots.length < 2) { $("lbPrev").hidden = true; $("lbNext").hidden = true; }

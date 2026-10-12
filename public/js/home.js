// Bimon Homestay – trang chủ: song ngữ, thanh tìm phòng, form đặt phòng, đánh giá Google.
const $ = (id) => document.getElementById(id);

const EN = {
  skip: "Skip to content", n_rooms: "Rooms", n_amen: "Amenities", n_rev: "Reviews", n_loc: "Location", n_food: "Food", book: "Book now", call: "Call",
  h_eye: "Homestay · Hai Phong", h_title: "In the middle of Hai Phong's food streets, 3 minutes' walk from the station",
  h_sub: "3 private rooms, en-suite bathrooms, self check-in. Step off the train, walk home, drop your bags and go eat.",
  f_in: "Check-in", f_out: "Check-out", f_guests: "Guests", find: "Check availability",
  t1: "walk to Hai Phong station", t2: "private rooms with en-suite", t3: "self check-in", t4: "eateries within 3 km",
  s_eye: "Our story", s_title: "Not a hotel. A home for people who travel to eat.",
  s_body1: "On a Hai Phong food trip, staying far from the centre means half the day goes on getting around. Big hotels are noisy, pricey and short on local flavour.",
  s_body2: "Bimon sits in lane 141 off Cau Dat street, between the Cau Dat and Luong Khanh Thien food streets. With only 3 rooms the house stays quiet and clean, and your host has time to point you to the good places.",
  s_link: "See 27 favourite eateries nearby",
  r_eye: "Rooms", r_title: "Choose a space of your own", r_lead: "Every room has air-conditioning, Wi-Fi and its own bathroom. Send a request for rates on your dates.",
  bi_t: "Bi room", mun_t: "Mun room", moon_t: "Moon room", bed1: "1 double bed", bed2: "2 double beds", wc: "Private bathroom", fit12: "1–2 guests", fit34: "3–4 guests",
  moon_badge: "Great for groups",
  bi_d: "Warm wood tones, soft lighting, a large wardrobe and a small vanity.", mun_d: "Neat and bright in soft beige, with a bench and a reading lamp.", moon_d: "Our largest room, two big beds, ideal for a group of friends on a food trip.",
  bi_b: "Book Bi", mun_b: "Book Mun", moon_b: "Book Moon",
  a_eye: "Amenities", a_title: "Every small detail looked after", a1: "Air-conditioning", a1d: "In every room", a2d: "Free, whole house",
  a3: "En-suite bathroom", a3d: "Private to each room, LED mirror", a4: "Shared kitchen", a4d: "Fridge, sink, dining table, basic cookware",
  a5: "Self check-in", a5d: "Arrive at any hour", a6: "Near the station, easy food tours", a6d: "Food streets at the end of the lane",
  g_eye: "Photos", g_title: "What you see is what you get",
  v_eye: "Google reviews", v_title: "What guests say about Bimon", v_empty: "Read real reviews from Bimon guests on Google Maps.", v_all: "See all reviews on Google Maps",
  l_eye: "Location", l_lead: "A quiet lane opening onto the Cau Dat and Luong Khanh Thien food streets.",
  p1: "Hai Phong Railway Station", p1t: "~3 min walk", p2: "Ba Cu crab noodle soup", p2t: "~2 min walk", p3: "Luong Van Can snack market", p3t: "~10 min walk",
  p4: "Opera House, Tam Bac walking street", p4t: "~5 min ride", p5: "Cat Bi Airport", p5t: "~20–30 min taxi",
  l_hint: "Times are estimates. Coming by train from Hanoi, you can walk from the station.", l_map: "Open Google Maps", l_food: "What to eat nearby",
  b_eye: "Booking", b_title: "Send a request and Bimon will quote and hold your room", b_lead: "Leave your name, phone and dates. Bimon gets your request right away and calls back with a quote.",
  f_name: "Your name", f_phone: "Phone", f_room: "Room", any: "Any room", f_note: "Notes (arrival time, requests...)", f_go: "Send booking request",
  f_hint: "Free, no obligation. Bimon only uses your number to send you a quote.", copy_msg: "Copy message",
  c_eye: "Contact", c_title: "Call or text Bimon",
  foot: "At Bimon you don't just rent a room, you join a family of travellers.",
};
const T = {
  vi: { need: "Chọn ngày nhận và ngày trả phòng để Bimon kiểm tra phòng trống.", order: "Ngày trả phòng cần sau ngày nhận phòng.", who: "Cho Bimon xin tên và số điện thoại để gọi lại báo giá nhé.", bad: "Số điện thoại chưa đúng, bạn kiểm tra lại giúp Bimon.", sending: "Đang gửi...", okT: "Bimon đã nhận yêu cầu!", okD: "Bimon sẽ gọi lại báo giá sớm. Bạn có thể sao chép tin nhắn dưới đây để nhắn thêm.", failT: "Chưa gửi được yêu cầu", failD: "Bạn sao chép tin nhắn dưới đây và nhắn cho Bimon, hoặc gọi số bên dưới nhé.", copied: "Đã sao chép", reviews: "đánh giá", of: "/" },
  en: { need: "Pick check-in and check-out dates so Bimon can check availability.", order: "Check-out must be after check-in.", who: "Please leave your name and phone so Bimon can call you back.", bad: "That phone number doesn't look right.", sending: "Sending...", okT: "Bimon has your request!", okD: "We'll call you back with a quote soon. You can also copy the message below.", failT: "Couldn't send your request", failD: "Copy the message below and text it to Bimon, or call the numbers below.", copied: "Copied", reviews: "reviews", of: "/" },
};

// ---------- Ngôn ngữ ----------
const VI = {};
document.querySelectorAll("[data-i]").forEach((el) => { if (!(el.dataset.i in VI)) VI[el.dataset.i] = el.textContent; });
let lang = "vi";
function setLang(l) {
  lang = l;
  const dict = l === "en" ? EN : VI;
  document.querySelectorAll("[data-i]").forEach((el) => { const v = dict[el.dataset.i]; if (v) el.textContent = v; });
  document.documentElement.lang = l;
  $("l-vi").setAttribute("aria-pressed", l === "vi");
  $("l-en").setAttribute("aria-pressed", l === "en");
  try { localStorage.setItem("bimon-lang", l); } catch (e) {}
  if (reviewsData) renderReviews();
}
$("l-vi").onclick = () => setLang("vi");
$("l-en").onclick = () => setLang("en");

// ---------- Ngày ----------
const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const plus1 = (v) => { const [y, m, d] = v.split("-").map(Number); return iso(new Date(y, m - 1, d + 1)); };
const today = iso(new Date());
["s-den", "den"].forEach((id) => ($(id).min = today));
["s-di", "di"].forEach((id) => ($(id).min = plus1(today)));
[["s-den", "s-di"], ["den", "di"]].forEach(([a, b]) => $(a).addEventListener("change", () => {
  const v = $(a).value; if (!v) return;
  $(b).min = plus1(v);
  if (!$(b).value || $(b).value <= v) $(b).value = plus1(v);
}));
const vnDate = (v) => v.split("-").reverse().join("/");

// ---------- Thanh tìm phòng ----------
$("search").addEventListener("submit", (e) => {
  e.preventDefault();
  $("den").value = $("s-den").value; $("di").value = $("s-di").value; $("khach").value = $("s-khach").value;
  if ($("s-den").value) $("di").min = plus1($("s-den").value);
  const g = Number($("s-khach").value);
  document.querySelectorAll(".room").forEach((r) => r.classList.toggle("dim", g > Number(r.dataset.max)));
  if (g > 2) $("phong").value = "Phòng Moon";
  $("cac-phong").scrollIntoView();
});
document.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => {
  $("phong").value = b.dataset.pick;
  if (b.dataset.pick === "Phòng Moon" && Number($("khach").value) < 3) $("khach").value = "4";
  $("dat-phong").scrollIntoView();
  setTimeout(() => $("ten").focus({ preventScroll: true }), 450);
}));

// ---------- Form đặt phòng ----------
function fieldError(el, msg) {
  $("err").textContent = msg;
  if (el) { el.setAttribute("aria-invalid", "true"); el.focus(); el.addEventListener("input", () => el.removeAttribute("aria-invalid"), { once: true }); }
}
$("f").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("err").textContent = "";
  const den = $("den").value, di = $("di").value, ten = $("ten").value.trim(), sdt = $("sdt").value.trim();
  if (!ten) return fieldError($("ten"), T[lang].who);
  if (!sdt) return fieldError($("sdt"), T[lang].who);
  if (!/^[+0-9 .()-]{8,20}$/.test(sdt)) return fieldError($("sdt"), T[lang].bad);
  if (!den) return fieldError($("den"), T[lang].need);
  if (!di) return fieldError($("di"), T[lang].need);
  if (di <= den) return fieldError($("di"), T[lang].order);

  const nights = Math.round((new Date(di) - new Date(den)) / 864e5);
  const room = $("phong").value === "any" ? "Phòng nào cũng được" : $("phong").value;
  const guests = $("khach").value === "5" ? "5 người trở lên" : $("khach").value + " người";
  const note = $("note").value.trim();
  const msg = ["Chào Bimon, mình muốn đặt phòng:", `• Phòng: ${room}`, `• Nhận phòng: ${vnDate(den)} · Trả phòng: ${vnDate(di)} (${nights} đêm)`,
    `• Số khách: ${guests}`, `• Tên: ${ten}`, `• SĐT: ${sdt}`, note ? `• Ghi chú: ${note}` : null, "Bimon báo giá và giữ phòng giúp mình nhé!"].filter(Boolean).join("\n");

  const btn = $("f").querySelector("button[type=submit]");
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = T[lang].sending;
  let ok = false;
  try {
    const r = await fetch("/api/dat-phong", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ten, sdt, den, di, phong: room, khach: $("khach").value, ghichu: note, website: $("hp").value, lang }),
    });
    ok = r.ok;
  } catch (err) {}
  btn.disabled = false; btn.textContent = label;

  $("ok").hidden = false;
  $("ok").style.borderLeftColor = ok ? "" : "var(--danger)";
  $("okT").textContent = ok ? T[lang].okT : T[lang].failT;
  $("okT").style.color = ok ? "" : "var(--danger)";
  $("okD").textContent = ok ? T[lang].okD : T[lang].failD;
  $("msg").textContent = msg; $("msg").hidden = false; $("copy").hidden = false;
  $("ok").scrollIntoView({ block: "nearest" });
  if (ok) $("f").reset();
});
$("copy").addEventListener("click", async () => {
  const b = $("copy"), old = b.textContent;
  try { await navigator.clipboard.writeText($("msg").textContent); b.textContent = T[lang].copied; }
  catch (e) { const r = document.createRange(); r.selectNodeContents($("msg")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  setTimeout(() => (b.textContent = old), 1600);
});

// ---------- Thanh đặt phòng dưới đáy (mobile) ----------
const mbar = $("mbar");
const io = new IntersectionObserver((entries) => {
  const visible = new Set(entries.filter((x) => x.isIntersecting).map((x) => x.target.id));
  entries.forEach((x) => { mbar.dataset[x.target.id === "top" ? "hero" : "book"] = x.isIntersecting ? "1" : ""; });
  mbar.classList.toggle("show", !mbar.dataset.hero && !mbar.dataset.book);
}, { threshold: 0.15 });
io.observe($("top")); io.observe($("dat-phong"));

// ---------- Đánh giá Google ----------
let reviewsData = null, revIndex = 0;
const stars = (n) => "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderReviews() {
  const d = reviewsData;
  if (d.rating) {
    const score = `<b>${d.rating.toFixed(1)}</b><div><span class="stars" aria-hidden="true">${stars(d.rating)}</span><small>${d.count || ""} ${T[lang].reviews} · Google</small></div>`;
    $("revScore").innerHTML = score; $("revScore").hidden = false;
    $("revScore").setAttribute("aria-label", `${d.rating.toFixed(1)} / 5, ${d.count || ""} ${T[lang].reviews}`);
    $("heroRating").innerHTML = `<span class="stars" aria-hidden="true">★</span> ${d.rating.toFixed(1)} · ${d.count || ""} ${T[lang].reviews} Google`;
    $("heroRating").hidden = false;
  }
  if (d.url) $("revLink").href = d.url;
  const list = (d.reviews || []).filter((r) => r.text);
  if (!list.length) return;
  $("revEmpty").hidden = true; $("revWrap").hidden = false;
  $("revList").innerHTML = list.map((r) => `<article class="rev">
    <div class="rev-top">${r.photo ? `<img src="${esc(r.photo)}" alt="" width="44" height="44" loading="lazy" referrerpolicy="no-referrer">` : `<span class="av" aria-hidden="true">${esc((r.author || "?").trim()[0] || "?")}</span>`}
      <div><b>${esc(r.author)}</b><small>${esc(r.time || "")}</small></div></div>
    <span class="stars" aria-label="${r.rating} / 5">${stars(r.rating)}</span>
    <p>${esc(r.text)}</p></article>`).join("");
  updatePos();
}
function updatePos() {
  const n = $("revList").children.length;
  $("revPos").textContent = `${revIndex + 1} / ${n}`;
}
function goReview(step) {
  const items = $("revList").children; if (!items.length) return;
  revIndex = Math.max(0, Math.min(items.length - 1, revIndex + step));
  $("revList").scrollTo({ left: items[revIndex].offsetLeft - $("revList").offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  updatePos();
}
$("revPrev").onclick = () => goReview(-1);
$("revNext").onclick = () => goReview(1);
$("revList").addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") goReview(-1); if (e.key === "ArrowRight") goReview(1); });
$("revList").addEventListener("scroll", () => {
  const items = [...$("revList").children]; const x = $("revList").scrollLeft;
  let best = 0; items.forEach((it, i) => { if (Math.abs(it.offsetLeft - $("revList").offsetLeft - x) < Math.abs(items[best].offsetLeft - $("revList").offsetLeft - x)) best = i; });
  revIndex = best; updatePos();
}, { passive: true });

fetch("/api/reviews").then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) { reviewsData = d; renderReviews(); } }).catch(() => {});

try { if (localStorage.getItem("bimon-lang") === "en") setLang("en"); } catch (e) {}

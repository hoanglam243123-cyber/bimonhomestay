// Bimon Homestay – trang chủ: song ngữ, đánh giá Google.
const $ = (id) => document.getElementById(id);

const EN = {
  skip: "Skip to content", n_rooms: "Rooms", n_amen: "Amenities", n_rev: "Reviews", n_loc: "Location", n_food: "Food",
  h_eye: "Homestay · Hai Phong", h_title: "Slow living in the heart of Hai Phong's old quarter",
  h_sub: "3 private rooms, en-suite bathrooms, self check-in. Step off the train, walk home, drop your bags and go eat.",
  f_in: "Check-in", f_out: "Check-out", f_guests: "Guests",
  t1: "walk to Hai Phong station", t2: "private rooms with en-suite", t3: "self check-in", t4: "eateries within 3 km",
  s_eye: "Our story", s_title: "Not a hotel. A home for people who travel to eat.",
  s_body1: "On a Hai Phong food trip, staying far from the centre means half the day goes on getting around. Big hotels are noisy, pricey and short on local flavour.",
  s_body2: "Bimon sits in lane 141 off Cau Dat street, between the Cau Dat and Luong Khanh Thien food streets. With only 3 rooms the house stays quiet and clean, and your host has time to point you to the good places.",
  s_link: "See 34 favourite eateries nearby",
  c_go: "Check availability",
  r_eye: "Rooms", r_title: "Choose a space of your own", r_lead: "Every room has air-conditioning, Wi-Fi and its own bathroom. Send a request for rates on your dates.",
  bi_t: "Bi room", mun_t: "Mun room", moon_t: "Moon room", bed1: "1 double bed", bed2: "2 double beds", wc: "Private bathroom", fit12: "1–2 guests", fit34: "3–4 guests", proj: "Netflix projector", tv: "Netflix TV", xbed: "Extra bed available", xbed: "Extra bed available",
  moon_badge: "Great for groups",
  q_eye: "FAQ", q_title: "Frequently asked questions",
  q1: "What are the check-in and check-out times?", q1a: "Check-in is from 14:00 and check-out is before 12:00. Self check-in means you can arrive late and still get in. For early check-in or late check-out, message Bimon in advance.",
  q2: "Is breakfast included?", q2a: "Breakfast is not included. The Cau Dat food street is right at the end of the lane; see breakfast picks under Food in the menu.",
  q3: "Can I book the whole house?", q3a: "Yes. You can book all 3 rooms for a group of up to 12 at a better rate than booking each room separately. Send a request or call Bimon for a quote.",
  q4: "What is the cancellation policy?", q4a: "Bimon takes a 30% deposit to hold your room. The deposit is non-refundable if you cancel, but you can move your booking to other dates if Bimon has availability.",
  q5: "What payment methods do you accept?", q5a: "Bank transfer, cash or e-wallet. Pay a 30% deposit when booking and the rest at check-in.",
  q6: "Is there parking?", q6a: "Motorbikes can be parked on the ground floor, inside the house. Cars can park at a lot about 100 m away for 50,000 VND per night.",
  bi_d: "Warm wood tones, soft lighting, a large wardrobe and a small vanity.", mun_d: "Neat and bright in soft beige, with a bench and a reading lamp.", moon_d: "Our largest room, two big beds, ideal for a group of friends on a food trip.",
  room_b: "View room details",
  a_eye: "Amenities & perks", a_title: "Every small detail looked after",
  perk1: "Reliable WiFi", perk1d: "Work remotely and stay in touch throughout your stay",
  perk2: "A 5-star experience", perk2d: "Beds, towels, amenities and housekeeping checked after every stay",
  perk3: "Prime location", perk3d: "Easy access to the train station, the City Opera House and the downtown walking streets",
  perk4: "A local team", perk4d: "Tips on food, itineraries and things to do around town",
  a3: "En-suite bathroom", a4: "Shared kitchen",
 
  g_eye: "Photos", g_title: "What you see is what you get",
  v_eye: "Google reviews", v_title: "What guests say about Bimon", v_empty: "Read real reviews from Bimon guests on Google Maps.", v_all: "See all reviews on Google Maps",
  l_eye: "Location", l_lead: "A quiet lane opening onto the Cau Dat and Luong Khanh Thien food streets.",
  p1: "Hai Phong Railway Station", p1t: "~3 min walk", p2: "Ba Cu crab noodle soup", p2t: "~2 min walk", p3: "Luong Van Can snack market", p3t: "~10 min walk",
  p4: "Opera House, Tam Bac walking street", p4t: "~5 min ride", p5: "Cat Bi Airport", p5t: "~20–30 min taxi",
  l_hint: "Times are estimates. Coming by train from Hanoi, you can walk from the station.", l_map: "Open Google Maps", l_food: "What's around Bimon",
  b_eye: "Booking", b_title: "Call or text Bimon", b_lead: "Bimon checks availability and sends you a quote right away.",
  c_msg: "Message us on Messenger",
  foot: "At Bimon you don't just rent a room, you join a family of travellers.",
};
const T = {
  vi: { reviews: "đánh giá", of: "/", need: "Chọn ngày nhận và ngày trả phòng nhé.", order: "Ngày trả phòng cần sau ngày nhận phòng.", long: "Ở trên 30 đêm, bạn nhắn Bimon để có giá tốt nhé.", checking: "Đang kiểm tra...",
    free: "Còn trống", booked: "Đã kín", ask: "Liên hệ để hỏi", view: "Xem phòng", upto: "Tối đa {n} người",
    sumFree: "{x} phòng còn trống cho {n} đêm ({a} – {b}). Nhắn Bimon để giữ phòng:", sumNone: "Ngày bạn chọn đã kín phòng. Nhắn Bimon để được gợi ý ngày gần nhất:", sumAsk: "Bimon cần xác nhận lại lịch cho ngày này. Nhắn Bimon để hỏi nhanh:",
    off: "Chưa xem được lịch tự động lúc này. Bạn nhắn Bimon để hỏi phòng trống nhé:", group: "Nhóm từ 5 người: đặt nhiều phòng hoặc thuê nguyên căn (tối đa 12 người).", call: "Gọi" },
  en: { reviews: "reviews", of: "/", need: "Please pick check-in and check-out dates.", order: "Check-out must be after check-in.", long: "For stays over 30 nights, message Bimon for the best rate.", checking: "Checking...",
    free: "Available", booked: "Fully booked", ask: "Contact us to check", view: "View room", upto: "Up to {n} guests",
    sumFree: "{x} room(s) available for {n} night(s) ({a} – {b}). Message Bimon to hold it:", sumNone: "Those dates are fully booked. Message Bimon for the nearest free dates:", sumAsk: "Bimon needs to double-check these dates. Message us for a quick answer:",
    off: "Live availability isn't available right now. Message Bimon to check:", group: "Groups of 5+: book several rooms or the whole house (up to 12 guests).", call: "Call" },
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
  if (lastCheck) renderCheck();
}
$("l-vi").onclick = () => setLang("vi");
$("l-en").onclick = () => setLang("en");

// ---------- Kiểm tra phòng trống (lịch đọc từ Google Sheet, xem server.js) ----------
const ROOMS = [{ id: "bi", max: 2 }, { id: "moon", max: 4 }, { id: "mun", max: 2 }];
const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const plus1 = (v) => { const [y, m, d] = v.split("-").map(Number); return iso(new Date(y, m - 1, d + 1)); };
const dmy = (v) => v.split("-").reverse().slice(0, 2).join("/");
const fill = (str, o) => str.replace(/\{(\w)\}/g, (_, k) => o[k]);
const today = iso(new Date());
$("c-den").min = today; $("c-di").min = plus1(today);
$("c-den").addEventListener("change", () => {
  const v = $("c-den").value; if (!v) return;
  $("c-di").min = plus1(v);
  if (!$("c-di").value || $("c-di").value <= v) $("c-di").value = plus1(v);
});
let lastCheck = null;
function renderCheck() {
  const t = T[lang], box = $("checkRes"), c = lastCheck;
  box.hidden = false;
  if (c.msg) { box.innerHTML = `<p class="check-err">${t[c.msg]}</p>`; return; }
  if (c.loading) { box.innerHTML = `<p>${t.checking}</p>`; return; }
  const name = (id) => (lang === "en" ? EN : VI)[id + "_t"];
  let html = "";
  if (!c.data || !c.data.ready) html = `<p class="check-sum">${t.off}</p>`;
  else {
    const order = { free: 0, ask: 1, booked: 2 };
    const rooms = ROOMS.map((r) => ({ ...r, st: c.data.rooms[r.id] }))
      .sort((a, b) => order[a.st] - order[b.st] || (b.max >= c.g) - (a.max >= c.g));
    const nFree = rooms.filter((r) => r.st === "free").length;
    html = `<ul class="check-list">${rooms.map((r) => `<li class="${r.st}"><div><b>${name(r.id)}</b><small>${fill(t.upto, { n: r.max })}</small></div><span class="st">${t[r.st]}</span><a href="/phong/${r.id}">${t.view}</a></li>`).join("")}</ul>`;
    const sum = nFree ? fill(t.sumFree, { x: nFree, n: c.data.nights, a: dmy(c.den), b: dmy(c.di) })
      : rooms.some((r) => r.st === "ask") ? t.sumAsk : t.sumNone;
    html += `<p class="check-sum">${sum}</p>`;
  }
  if (c.g >= 5) html += `<p class="check-note">${t.group}</p>`;
  html += `<div class="check-cta"><a class="btn gold" href="https://zalo.me/0934504439" target="_blank" rel="noopener">Zalo</a><a class="btn outline" href="https://m.me/61589770299091" target="_blank" rel="noopener">Messenger</a><a class="btn outline" href="tel:0934504439">${t.call}</a></div>`;
  box.innerHTML = html;
}
$("check").addEventListener("submit", async (e) => {
  e.preventDefault();
  const den = $("c-den").value, di = $("c-di").value, g = Number($("c-khach").value);
  const show = (o) => { lastCheck = o; renderCheck(); };
  if (!den || !di) return show({ msg: "need" });
  if (di <= den) return show({ msg: "order" });
  if ((new Date(di) - new Date(den)) / 864e5 > 30) return show({ msg: "long" });
  show({ loading: true });
  let data = null;
  try { const r = await fetch(`/api/phong-trong?den=${den}&di=${di}`); if (r.ok) data = await r.json(); } catch (err) {}
  show({ den, di, g, data });
});

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

fetch("/reviews.json").then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) { reviewsData = d; renderReviews(); } }).catch(() => {});

try { if (localStorage.getItem("bimon-lang") === "en") setLang("en"); } catch (e) {}

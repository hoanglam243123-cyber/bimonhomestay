// Bimon Homestay – trang chủ: song ngữ, đánh giá Google.
const $ = (id) => document.getElementById(id);

const EN = {
  skip: "Skip to content", n_rooms: "Rooms", n_amen: "Amenities", n_rev: "Reviews", n_loc: "Location", n_food: "Food", book: "Book now",
  h_eye: "Homestay · Hai Phong", h_title: "Slow living in the heart of Hai Phong's old quarter",
  h_sub: "3 private rooms, en-suite bathrooms, self check-in. Step off the train, walk home, drop your bags and go eat.",
  f_in: "Check-in", f_out: "Check-out", f_guests: "Guests",
  t1: "3 min by bike to Hai Phong station", t2: "private rooms with en-suite", t3: "self check-in", t4: "eateries within 3 km",
  s_eye: "Our story", s_title: "Not a hotel. A home for people who travel to eat.",
  s_body1: "On a Hai Phong food trip, staying far from the centre means half the day goes on getting around. Big hotels are noisy, pricey and short on local flavour.",
  s_body2: "Bimon sits in lane 141 off Cau Dat street, between the Cau Dat and Luong Khanh Thien food streets. With only 3 rooms the house stays quiet and clean, and your host has time to point you to the good places.",
  s_link: "See 44 favourite eateries nearby",
  c_go: "Check availability",
  r_eye: "Rooms", r_title: "Choose a space of your own", r_lead: "Every room has air-conditioning, Wi-Fi and its own bathroom.",
  bi_t: "Bi room", mun_t: "Mun room", moon_t: "Moon room", bed1: "1 double bed", bed2: "2 beds (1.8 m & 1.2 m)", wc: "Private bathroom", fit12: "1–2 guests", fit34: "3–4 guests", proj: "Netflix projector", tv: "Netflix TV", xbed: "Extra bed available", xbed34: "Extra bed, up to 3–4 guests", xbed: "Extra bed available",
  moon_badge: "Great for groups",
  h2_eye: "House rules", h2_title: "Bimon house rules", h2_lead: "Three rooms share one roof, so we ask for a few small things to keep everyone's stay pleasant.",
  r1: "Check-in and check-out", r1d: "Check-in from 14:00, check-out before 12:00.",
  r2: "ID documents", r2d: "Each guest sends a photo of their ID card or passport so Bimon can register your stay as required by law.",
  r3: "No smoking", r3d: "No smoking, including e-cigarettes, anywhere in the house.",
  r4: "No pets", r4d: "Sorry, Bimon can't host four-legged friends yet.",
  r5: "Quiet hours 22:00 – 7:00", r5d: "Keep voices, speakers and TV low so you don't disturb the room next door.",
  r6: "No strong-smelling food", r6d: "Please don't bring durian, shrimp paste or other strong-smelling food inside. Clean up the shared kitchen after use.",
  r7: "Take care of the room", r7d: "Guests pay for anything damaged or lost in the room at its actual value.",
  q_eye: "FAQ", q_title: "Frequently asked questions",
  q1: "What are the check-in and check-out times?", q1a: "Check-in is from 14:00 and check-out is before 12:00. Self check-in means you can arrive late and still get in. For early check-in or late check-out, message Bimon in advance.",
  q2: "Is breakfast included?", q2a: "Breakfast is not included. The Cau Dat food street is right at the end of the lane; see breakfast picks under Food in the menu.",
  q3: "Can I book the whole house?", q3a: "Yes. You can book all 3 rooms for a group of up to 12 at a better rate than booking each room separately. Call or message Bimon for a quote.",
  q4: "What is the cancellation policy?", q4a: "Bimon takes a 30% deposit to hold your room. The deposit is non-refundable if you cancel, but you can move your booking to other dates if Bimon has availability.",
  q5: "What payment methods do you accept?", q5a: "Bank transfer, cash or e-wallet. Pay a 30% deposit when booking and the rest at check-in.",
  q6: "Is there parking?", q6a: "Motorbikes can be parked on the ground floor, inside the house. Cars can park at a lot about 100 m away for 50,000 VND per night.",
  bi_d: "Warm wood tones, soft lighting, a large wardrobe and a small vanity.", mun_d: "Neat and bright in soft beige, with a bench and a reading lamp.", moon_d: "Our largest room, two beds, ideal for a group of friends on a food trip.",
  room_b: "View room details",
  bi_p: "From 490,000₫/night", bi_w: "Fri & Sat: 590,000₫", mun_p: "From 490,000₫/night", mun_w: "Fri & Sat: 590,000₫",
  moon_p: "From 590,000₫/night", moon_w: "Fri & Sat: 690,000₫",
  a_eye: "Amenities & perks", a_title: "Every small detail looked after",
  perk1: "Reliable WiFi", perk1d: "Work remotely and stay in touch throughout your stay",
  perk2: "A 5-star experience", perk2d: "Beds, towels, amenities and housekeeping checked after every stay",
  perk3: "Prime location", perk3d: "Easy access to the train station, the City Opera House and the downtown walking streets",
  perk4: "A local team", perk4d: "Tips on food, itineraries and things to do around town",
  a3: "En-suite bathroom", a4: "Shared kitchen",
 
  g_eye: "Photos", g_title: "What you see is what you get",
  v_eye: "Google reviews", v_title: "What guests say about Bimon", v_empty: "Read real reviews from Bimon guests on Google Maps.", v_all: "See all reviews on Google Maps",
  l_eye: "Location", l_lead: "A quiet lane opening onto the Cau Dat and Luong Khanh Thien food streets.",
  p1: "Hai Phong Railway Station", p1t: "~3 min by bike", p2: "Ba Cu crab noodle soup", p2t: "~2 min walk", p3: "Luong Van Can snack market", p3t: "~10 min walk",
  p4: "Opera House, Tam Bac walking street", p4t: "~5 min ride", p5: "Cat Bi Airport", p5t: "~20–30 min taxi",
  l_hint: "Times are estimates. Coming by train from Hanoi, you can walk from the station.", l_map: "Open Google Maps", l_food: "What's around Bimon",
  b_eye: "Booking", b_title: "Call or text Bimon", b_lead: "Bimon checks availability and sends you a quote right away.",
  c_msg: "Message us on Messenger",
  foot: "At Bimon you don't just rent a room, you join a family of travellers.",
};
// 简体中文 (tiếng Trung giản thể). Thiếu khoá nào thì tự dùng tiếng Anh.
const ZH = {
  skip: "跳到主要内容", n_rooms: "房间", n_amen: "设施", n_rev: "评价", n_loc: "位置", n_food: "美食", book: "立即预订",
  h_eye: "民宿 · 海防", h_title: "在海防老城中心慢慢生活",
  h_sub: "3 间独立房间，独立卫浴，自助入住。下了火车走回家，放下行李就去吃。",
  f_in: "入住", f_out: "退房", f_guests: "人数",
  t1: "骑车 3 分钟到海防火车站", t2: "独立房间，独立卫浴", t3: "自助入住", t4: "3 公里内的小吃店",
  s_eye: "我们的故事", s_title: "不是酒店，是给爱吃之人的家。",
  s_body1: "来海防吃美食，如果住得离市中心远，半天时间都花在路上。大酒店又吵又贵，也少了本地味道。",
  s_body2: "Bimon 位于 Cầu Đất 街 141 巷，就在 Cầu Đất 和 Lương Khánh Thiện 两条美食街之间。全屋只有 3 间房，安静干净，房东也有时间给你推荐好吃的地方。",
  s_link: "看看附近 44 家好吃的店",
  c_go: "查询空房",
  r_eye: "房间", r_title: "选一个属于你的角落", r_lead: "每间房都有空调、WiFi 和独立卫生间。",
  bi_t: "Bi 房", mun_t: "Mun 房", moon_t: "Moon 房", bed1: "1 张双人床", bed2: "2 张床（1.8 米和 1.2 米）", wc: "独立卫生间", fit12: "1–2 人", fit34: "3–4 人", proj: "Netflix 投影仪", tv: "Netflix 电视", xbed34: "可加床，最多 3–4 人", xbed: "可加床",
  moon_badge: "适合朋友结伴",
  h2_eye: "入住须知", h2_title: "Bimon 入住须知", h2_lead: "三间房同在一个屋檐下，请大家注意以下几点，让每个人都住得舒心。",
  r1: "入住和退房时间", r1d: "14:00 起可入住，12:00 前退房。",
  r2: "身份证件", r2d: "每位客人请发送身份证或护照照片，Bimon 需按规定为您办理住宿登记。",
  r3: "禁止吸烟", r3d: "屋内任何地方都禁止吸烟，包括电子烟。",
  r4: "不接待宠物", r4d: "很抱歉，Bimon 暂时无法接待四条腿的朋友。",
  r5: "22:00 – 7:00 请保持安静", r5d: "请小声说话，调低音箱和电视音量，以免打扰隔壁房间。",
  r6: "请勿带入气味浓烈的食物", r6d: "请勿将榴莲、虾酱等气味浓烈的食物带进屋内。使用公共厨房后请收拾干净。",
  r7: "爱护屋内物品", r7d: "如损坏或丢失房内物品，客人需按实际价值赔偿。",
  q_eye: "问答", q_title: "常见问题",
  q1: "入住和退房时间是几点？", q1a: "14:00 起可入住，12:00 前退房。Bimon 支持自助入住，晚到也能进门。如需提前入住或延迟退房，请提前联系 Bimon。",
  q2: "房费包含早餐吗？", q2a: "房费不含早餐。巷口就是 Cầu Đất 美食街，可在菜单“美食”里查看早餐推荐。",
  q3: "可以包下整栋房子吗？", q3a: "可以。最多 12 人的团体可以包下全部 3 间房，价格比单独订每间更优惠。请致电或发消息给 Bimon 询价。",
  q4: "取消政策是怎样的？", q4a: "Bimon 收取 30% 房费作为订金。取消预订时订金不退，但如果 Bimon 有空房，可以改到其他日期。",
  q5: "可以用哪些方式付款？", q5a: "银行转账、现金或电子钱包。预订时支付 30% 订金，余款在入住时付清。",
  q6: "有停车位吗？", q6a: "摩托车可停在一楼屋内。汽车可停在离家约 100 米的停车场，每晚 50,000 越南盾。",
  bi_d: "温暖的木色调，柔和的灯光，配有大衣柜和小梳妆台。", mun_d: "整洁明亮的浅米色调，配有长凳和阅读落地灯。", moon_d: "全屋最大的房间，两张床，适合结伴来吃美食的朋友。",
  room_b: "查看房间详情",
  bi_p: "490,000₫/晚起", bi_w: "周五、周六：590,000₫", mun_p: "490,000₫/晚起", mun_w: "周五、周六：590,000₫",
  moon_p: "590,000₫/晚起", moon_w: "周五、周六：690,000₫",
  a_eye: "设施与优待", a_title: "用心照顾每个小细节",
  perk1: "稳定的 WiFi", perk1d: "住宿期间可以安心远程办公、随时保持联系",
  perk2: "五星级体验", perk2d: "每位客人退房后，床品、毛巾、用品和清洁流程都会重新检查",
  perk3: "绝佳位置", perk3d: "去火车站、海防大剧院和市中心步行街都很方便",
  perk4: "本地团队", perk4d: "为你推荐美食、行程和城里好玩的地方",
  a3: "独立卫浴", a4: "公共厨房",
  g_eye: "照片", g_title: "照片什么样，住起来就什么样",
  v_eye: "Google 评价", v_title: "客人怎么说 Bimon", v_empty: "在 Google 地图上查看住过 Bimon 的客人的真实评价。", v_all: "在 Google 地图查看全部评价",
  l_eye: "位置", l_lead: "安静的小巷，走到巷口就是 Cầu Đất 和 Lương Khánh Thiện 美食街。",
  p1: "海防火车站", p1t: "骑车约 3 分钟", p2: "Bà Cụ 蟹汤粉", p2t: "步行约 2 分钟", p3: "Lương Văn Can 小吃市场", p3t: "步行约 10 分钟",
  p4: "海防大剧院、Tam Bạc 步行街", p4t: "骑车约 5 分钟", p5: "吉碑机场", p5t: "打车约 20–30 分钟",
  l_hint: "时间为估算。从河内坐火车来，下车就能走回家。", l_map: "打开 Google 地图", l_food: "Bimon 附近有什么？",
  b_eye: "预订", b_title: "给 Bimon 打电话或发消息", b_lead: "Bimon 会马上查看空房并给你报价。",
  c_msg: "通过 Messenger 联系",
  foot: "在 Bimon，你不只是租一个房间，而是加入一个旅行者的大家庭。",
};
const T = {
  vi: { reviews: "đánh giá", of: "/", need: "Chọn ngày nhận và ngày trả phòng nhé.", order: "Ngày trả phòng cần sau ngày nhận phòng.", long: "Ở trên 30 đêm, bạn nhắn Bimon để có giá tốt nhé.", checking: "Đang kiểm tra...",
    free: "Còn trống", booked: "Đã kín", ask: "Liên hệ để hỏi", view: "Xem phòng", upto: "Tối đa {n} người", uptoX: "1–{b} người, tới {n} người khi kê giường phụ", est: "~{p} / {n} đêm",
    sumFree: "{x} phòng còn trống cho {n} đêm ({a} – {b}). Nhắn Bimon để giữ phòng:", sumNone: "Ngày bạn chọn đã kín phòng. Nhắn Bimon để được gợi ý ngày gần nhất:", sumAsk: "Bimon cần xác nhận lại lịch cho ngày này. Nhắn Bimon để hỏi nhanh:",
    off: "Chưa xem được lịch tự động lúc này. Bạn nhắn Bimon để hỏi phòng trống nhé:", group: "Nhóm từ 5 người: đặt nhiều phòng hoặc thuê nguyên căn (tối đa 12 người).", call: "Gọi" },
  en: { reviews: "reviews", of: "/", need: "Please pick check-in and check-out dates.", order: "Check-out must be after check-in.", long: "For stays over 30 nights, message Bimon for the best rate.", checking: "Checking...",
    free: "Available", booked: "Fully booked", ask: "Contact us to check", view: "View room", upto: "Up to {n} guests", uptoX: "1–{b} guests, up to {n} with an extra bed", est: "~{p} / {n} night(s)",
    sumFree: "{x} room(s) available for {n} night(s) ({a} – {b}). Message Bimon to hold it:", sumNone: "Those dates are fully booked. Message Bimon for the nearest free dates:", sumAsk: "Bimon needs to double-check these dates. Message us for a quick answer:",
    off: "Live availability isn't available right now. Message Bimon to check:", group: "Groups of 5+: book several rooms or the whole house (up to 12 guests).", call: "Call" },
  zh: { reviews: "条评价", of: "/", need: "请选择入住和退房日期。", order: "退房日期需晚于入住日期。", long: "住 30 晚以上，请联系 Bimon 获取优惠价。", checking: "正在查询...",
    free: "有空房", booked: "已满", ask: "请联系询问", view: "查看房间", upto: "最多 {n} 人", uptoX: "1–{b} 人，加床最多 {n} 人", est: "约 {p} / {n} 晚",
    sumFree: "{n} 晚（{a} – {b}）有 {x} 间空房。给 Bimon 发消息留房：", sumNone: "所选日期已满房。给 Bimon 发消息，推荐最近的空房日期：", sumAsk: "Bimon 需要再确认这些日期。发消息给我们，马上回复：",
    off: "暂时无法自动查询空房。请给 Bimon 发消息询问：", group: "5 人以上：可以订多间房或包下整栋（最多 12 人）。", call: "打电话" },
};

// ---------- Ngôn ngữ ----------
const VI = {};
document.querySelectorAll("[data-i]").forEach((el) => { if (!(el.dataset.i in VI)) VI[el.dataset.i] = el.textContent; });
let lang = "vi";
// Chữ theo ngôn ngữ đang chọn; tiếng Trung thiếu khoá thì dùng tiếng Anh
const word = (k) => (lang === "en" ? EN[k] : lang === "zh" ? ZH[k] || EN[k] : VI[k]);
function setLang(l) {
  lang = l;
  document.querySelectorAll("[data-i]").forEach((el) => { const v = word(el.dataset.i); if (v) el.textContent = v; });
  document.documentElement.lang = l === "zh" ? "zh-Hans" : l;
  $("l-vi").setAttribute("aria-pressed", l === "vi");
  $("l-en").setAttribute("aria-pressed", l === "en");
  $("l-zh").setAttribute("aria-pressed", l === "zh");
  try { localStorage.setItem("bimon-lang", l); } catch (e) {}
  if (reviewsData) renderReviews();
  if (lastCheck) renderCheck();
}
$("l-vi").onclick = () => setLang("vi");
$("l-en").onclick = () => setLang("en");
$("l-zh").onclick = () => setLang("zh");

// ---------- Ảnh nền đầu trang chạy slide ----------
(() => {
  const imgs = [...document.querySelectorAll("#heroSlides .hero-img")];
  if (imgs.length < 2) return;
  // Máy bật "giảm chuyển động": vẫn đổi ảnh (chỉ mờ dần, không phóng to), đổi chậm hơn
  const every = matchMedia("(prefers-reduced-motion: reduce)").matches ? 8000 : 6500;
  let i = 0, timer = null;
  const count = document.getElementById("heroCount");
  const load = (img) => { if (img.dataset.src) { if (img.dataset.srcset) img.srcset = img.dataset.srcset; img.src = img.dataset.src; delete img.dataset.src; } };
  const next = () => {
    const n = (i + 1) % imgs.length, img = imgs[n];
    load(img);
    const show = () => {
      const old = imgs[i];
      imgs.forEach((x) => x !== old && x !== img && x.classList.remove("prev"));
      old.classList.replace("on", "prev"); // ảnh cũ nằm dưới, vẫn rõ
      img.classList.add("on");              // ảnh mới hiện dần đè lên
      setTimeout(() => old.classList.remove("prev"), 1800);
      i = n; load(imgs[(n + 1) % imgs.length]);
      if (count) count.innerHTML = `<b>${String(n + 1).padStart(2, "0")}</b> / ${String(imgs.length).padStart(2, "0")}`;
    };
    // Giải mã ảnh trước rồi mới chuyển, tránh khựng hình
    (img.decode ? img.decode() : Promise.resolve()).then(show, show);
  };
  const start = () => { if (!timer) timer = setInterval(next, every); };
  const stop = () => { clearInterval(timer); timer = null; };
  // Tải ảnh thứ 2 sau khi trang hiện xong, rồi mới bắt đầu chạy
  addEventListener("load", () => { load(imgs[1]); start(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
})();

// ---------- Kiểm tra phòng trống (lịch đọc từ Google Sheet, xem server.js) ----------
// Giá/đêm: ngày thường (w) và đêm thứ 6, thứ 7 (e)
// fit: số người phù hợp; max: tối đa khi kê thêm giường phụ
const ROOMS = [{ id: "bi", fit: 2, max: 4, w: 490000, e: 590000 }, { id: "moon", fit: 4, max: 4, w: 590000, e: 690000 }, { id: "mun", fit: 2, max: 4, w: 490000, e: 590000 }];
const vnd = (n) => n.toLocaleString("vi-VN") + "đ";
function stayCost(r, den, di) {
  let sum = 0;
  for (let d = new Date(den + "T00:00:00"); d < new Date(di + "T00:00:00"); d.setDate(d.getDate() + 1)) sum += [5, 6].includes(d.getDay()) ? r.e : r.w;
  return sum;
}
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
  const name = (id) => word(id + "_t");
  let html = "";
  if (!c.data || !c.data.ready) html = `<p class="check-sum">${t.off}</p>`;
  else {
    const order = { free: 0, ask: 1, booked: 2 };
    const rooms = ROOMS.map((r) => ({ ...r, st: c.data.rooms[r.id] }))
      .sort((a, b) => order[a.st] - order[b.st] || (b.max >= c.g) - (a.max >= c.g));
    const nFree = rooms.filter((r) => r.st === "free").length;
    html = `<ul class="check-list">${rooms.map((r) => `<li class="${r.st}"><div><b>${name(r.id)}</b><small>${r.fit < r.max ? fill(t.uptoX, { b: r.fit, n: r.max }) : fill(t.upto, { n: r.max })}${r.st === "free" ? " · " + fill(t.est, { p: vnd(stayCost(r, c.den, c.di)), n: c.data.nights }) : ""}</small></div><span class="st">${t[r.st]}</span><a href="/phong/${r.id}">${t.view}</a></li>`).join("")}</ul>`;
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

try { const l = localStorage.getItem("bimon-lang"); if (l === "en" || l === "zh") setLang(l); } catch (e) {}

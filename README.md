# Bimon Homestay – Website

Website Node.js (Express) cho Bimon Homestay, 5/141 Cầu Đất, Gia Viên, Hải Phòng.

## Có gì

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang giới thiệu: phòng Bi / Mun / Moon, tiện nghi, ảnh, vị trí, form đặt phòng (VN/EN) |
| `/an-gi` | 27 quán ăn + 8 điểm nên đi quanh nhà, lọc theo khoảng cách, giờ mở cửa, chỉ đường |
| `POST /api/dat-phong` | Nhận yêu cầu đặt phòng, lưu vào `data/bookings.jsonl`, báo cho chủ nhà qua Zalo (và email nếu bật) |
| `/api/reviews` | Đánh giá Google Maps cho mục "Khách nói gì" |
| `/admin` | Xem danh sách yêu cầu đặt phòng, tải CSV (cần đăng nhập) |
| `/sitemap.xml`, `/robots.txt` | SEO |

Giao diện theo design system của ui-ux-pro-max (Hotel/Hospitality): xanh navy + vàng gold, font Playfair Display + Be Vietnam Pro.

Không hiện giá phòng công khai: khách để lại tên, SĐT, ngày ở và Bimon gọi lại báo giá.

## Chạy trên máy

```bash
npm install
cp .env.example .env   # rồi sửa ADMIN_PASS, email...
npm start              # http://localhost:3000
```

## Đưa lên GitHub

```bash
git remote add origin https://github.com/<tai-khoan>/bimon-website.git
git branch -M main
git push -u origin main
```

## Deploy lên Hostinger

Khi mua gói: chọn gói có **Node.js** (Business Web Hosting trở lên). Gói trả theo năm thường kèm tên miền miễn phí năm đầu, kiểm tra lại lúc thanh toán. Có tên miền rồi thì điền vào `SITE_URL`.


### Cách 1: Business / Cloud Hosting (dễ nhất, tự deploy khi push GitHub)

1. hPanel → **Websites** → **Add website** → chọn **Node.js Apps**.
2. Chọn **Import Git repository**, kết nối GitHub và chọn repo `bimon-website`, nhánh `main`.
   (Hoặc chọn upload file `.zip` của thư mục này, bỏ `node_modules`.)
3. Cấu hình build:
   - Framework: **Express** (hoặc Other)
   - Node version: **20** hoặc **22**
   - Entry file: `server.js`
   - Build command: để trống · Install: `npm install`
4. **Environment variables**: thêm các biến trong `.env.example` (ít nhất `SITE_URL`, `ADMIN_USER`, `ADMIN_PASS`).
5. Deploy, rồi trỏ tên miền vào app và bật SSL miễn phí.
6. Từ nay mỗi lần `git push` lên `main`, Hostinger tự deploy lại.

### Cách 2: VPS Hostinger

```bash
git clone https://github.com/<tai-khoan>/bimon-website.git && cd bimon-website
npm install --omit=dev
cp .env.example .env && nano .env
npm i -g pm2 && pm2 start server.js --name bimon && pm2 save && pm2 startup
```
Sau đó cấu hình Nginx reverse proxy tên miền → `localhost:3000` và cài SSL bằng Certbot.

## Báo đặt phòng qua Zalo

1. Vào https://bot.zapps.me, đăng nhập Zalo của chủ nhà, tạo bot và lấy **Bot Token**.
2. Mở Zalo, tìm bot vừa tạo và nhắn cho bot 1 tin bất kỳ.
3. Trên máy: điền `ZALO_BOT_TOKEN` vào `.env`, chạy `npm run zalo:chat-id`, chép dòng `ZALO_CHAT_ID=...` vào `.env`.
4. Trên Hostinger: thêm 2 biến `ZALO_BOT_TOKEN`, `ZALO_CHAT_ID` vào Environment variables.

Mỗi khi khách gửi form, Zalo của chủ nhà nhận tin có tên, SĐT, phòng, ngày ở. Danh sách đầy đủ xem ở `/admin`.
(Có thể bật thêm email dự phòng bằng các biến `SMTP_*`.)

Lưu ý: file `data/bookings.jsonl` nằm trên server, có thể bị xoá khi deploy lại, nên Zalo là kênh chính.

## Đánh giá Google Maps

Mục "Khách nói gì về Bimon" tự lấy đánh giá theo 1 trong 2 cách:

**Cách A – tự động (nên dùng):**
1. Vào Google Cloud Console, bật **Places API (New)**, tạo API key (giới hạn key chỉ cho Places API).
2. Điền `GOOGLE_PLACES_API_KEY` vào `.env`, chạy `npm run google:place-id` để lấy `GOOGLE_PLACE_ID`.
3. Thêm 2 biến này vào Hostinger. Website lấy điểm trung bình, số lượt và tối đa 5 đánh giá Google trả về, lưu tạm 12 giờ (rất ít lượt gọi API).

**Cách B – thủ công:** đổi tên `content/reviews.example.json` thành `content/reviews.json` và dán nguyên văn đánh giá thật từ Google Maps.

Chưa cấu hình cách nào thì mục này hiện nút "Xem tất cả đánh giá trên Google Maps".

## Sửa nội dung

- Chữ, phòng, tiện nghi, SĐT: `public/index.html`; bản tiếng Anh trong biến `EN` của `public/js/home.js`.
- Màu sắc, font: biến ở đầu `public/css/home.css`.
- Danh sách quán ăn: mảng `P` trong `public/an-gi.html`.
- Ảnh: `public/img/` (giữ tên file hoặc sửa đường dẫn trong HTML).

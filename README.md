# Bimon Homestay – Website

Website Node.js (Express) cho Bimon Homestay, 5/141 Cầu Đất, Gia Viên, Hải Phòng.

## Có gì

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang giới thiệu: phòng Bi / Mun / Moon, tiện nghi, ảnh, vị trí, form đặt phòng (VN/EN) |
| `/an-gi` | 27 quán ăn + 8 điểm nên đi quanh nhà, lọc theo khoảng cách, giờ mở cửa, chỉ đường |
| `POST /api/dat-phong` | Nhận yêu cầu đặt phòng, lưu vào `data/bookings.jsonl`, báo cho chủ nhà qua email và/hoặc Telegram |
| `/admin` | Xem danh sách yêu cầu đặt phòng, tải CSV (cần đăng nhập) |
| `/sitemap.xml`, `/robots.txt` | SEO |

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

Cần gói có hỗ trợ **Node.js** (Business Web Hosting, Cloud, hoặc VPS). Gói Single/Premium không chạy được Node.js.

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

## Nhận thông báo đặt phòng

- **Email**: tạo hộp thư tên miền trong hPanel (ví dụ `datphong@tenmien.com`), điền `SMTP_*` và `NOTIFY_EMAIL`.
- **Telegram**: tạo bot với @BotFather lấy `TELEGRAM_BOT_TOKEN`, nhắn cho bot một tin, rồi mở
  `https://api.telegram.org/bot<TOKEN>/getUpdates` để lấy `chat.id` điền vào `TELEGRAM_CHAT_ID`.

Lưu ý: file `data/bookings.jsonl` nằm trên server; khi redeploy trên gói Node.js Apps có thể bị xoá.
Nên bật ít nhất một kênh email/Telegram để không mất yêu cầu nào.

## Sửa nội dung

- Chữ, phòng, tiện nghi, SĐT: `public/index.html` (bản tiếng Anh nằm trong biến `EN` cuối file).
- Danh sách quán ăn: mảng `P` trong `public/an-gi.html`.
- Ảnh: `public/img/` (giữ tên file hoặc sửa đường dẫn trong HTML).

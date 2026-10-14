# Bimon Homestay – Website

Website Node.js (Express) cho Bimon Homestay, 5/141 Cầu Đất, Gia Viên, Hải Phòng.

## Có gì

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang giới thiệu: phòng Bi / Mun / Moon, tiện nghi, ảnh, vị trí, form đặt phòng (VN/EN) |
| `/an-gi` | 41 quán ăn + 4 điểm nên đi quanh nhà, lọc theo khoảng cách, giờ mở cửa, chỉ đường |
| `/phong/bi`, `/phong/mun`, `/phong/moon` | Trang chi tiết từng phòng: ảnh, tiện nghi trong phòng |
| `/api/reviews` | Đánh giá Google Maps cho mục "Khách nói gì" |
| `/sitemap.xml`, `/robots.txt` | SEO |

Giao diện theo design system của ui-ux-pro-max (Hotel/Hospitality): xanh navy + vàng gold, font Playfair Display + Be Vietnam Pro.

Không hiện giá phòng công khai: khách để lại tên, SĐT, ngày ở và Bimon gọi lại báo giá.

## Chạy trên máy

```bash
npm install
cp .env.example .env   # rồi điền SITE_URL, AVAILABILITY_URL...
npm start              # http://localhost:3000
```

## Đưa lên GitHub

```bash
git remote add origin https://github.com/hoanglam243123-cyber/bimonhomestay.git
git branch -M main
git push -u origin main
```

## Đưa lên Hostinger Premium (website tĩnh, không cần Node.js)

Gói Premium không chạy Node.js, nên xuất website thành file HTML tĩnh rồi tải lên:

1. Chạy `npm run build:static`. Lệnh tạo thư mục `dist/` và file `bimon-website-static.zip`.
   Khi đã có tên miền, build kèm tên miền để link chia sẻ Facebook/Zalo và Google đúng:
   `SITE_URL=https://ten-mien-cua-ban npm run build:static` (hoặc ghi `SITE_URL=...` vào file `.env`).
2. hPanel → **Websites** → chọn website → **File Manager** → mở `public_html`.
3. Xoá file mặc định của Hostinger (`default.php`, `index.php` nếu có), tải `bimon-website-static.zip` lên, chuột phải → **Extract** ngay trong `public_html`, rồi xoá file zip.
4. Bật SSL miễn phí cho tên miền.

**Sau này sửa nội dung:** sửa file như bình thường → `npm run build:static` → tải zip mới lên và giải nén đè vào `public_html`.

Bản tĩnh không có: nút kiểm tra phòng trống và tự lấy đánh giá qua Google API (đánh giá nhập tay trong `content/reviews.json` vẫn hiện bình thường).

## Deploy lên Hostinger (gói có Node.js)

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
4. **Environment variables**: thêm các biến trong `.env.example` (ít nhất `SITE_URL`, `AVAILABILITY_URL`).
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

## Trang chi tiết phòng

- **Thêm ảnh:** thả file `.jpg`, `.png` hoặc `.webp` vào `public/img/phong/bi/` (hoặc `mun/`, `moon/`). Ảnh hiện theo thứ tự tên file, nên đặt tên `01.jpg`, `02.jpg`... Ảnh đầu tiên của trang luôn là ảnh đại diện phòng ở trang chủ. Nên nén ảnh dưới ~500 KB (cạnh dài ~1600px) để trang tải nhanh.
- **Sửa tiện nghi, mô tả, nhãn:** trong `content/rooms.json`, mỗi dòng có bản tiếng Việt (`vi`) và tiếng Anh (`en`).
- Không cần khởi động lại server: trang đọc ảnh và `rooms.json` mỗi lần có người mở (chỉ cần tải lại trang).

## Kiểm tra phòng trống (đọc từ Google Sheet)

Nút "Kiểm tra phòng trống" ở đầu trang chủ đọc lịch màu trong Google Sheet "BiMon Homestay" (các trang `T10/2026`, `T11/2026`...): ô trắng = trống, vàng/cam = đã book, đỏ = khách giờ (website báo "Liên hệ để hỏi"). Tầng 2 = Bi, tầng 3 = Moon, tầng 4 = Mun. Tháng chưa có trang lịch thì website cũng báo "Liên hệ để hỏi".

Cài một lần:
1. Mở Google Sheet → **Tiện ích mở rộng → Apps Script**, xoá code mẫu, dán toàn bộ `scripts/google-apps-script.gs`, bấm Lưu.
2. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**: Thực thi dưới dạng *Tôi*, Ai có quyền truy cập *Bất kỳ ai* → Triển khai → cấp quyền → copy **URL ứng dụng web**.
3. Thêm biến môi trường `AVAILABILITY_URL` = URL đó (Hostinger → app Node.js → Biến môi trường), rồi triển khai lại.

Script chỉ gửi các trang lịch màu, không gửi các trang "Đặt lịch..." có tên/số điện thoại khách. Website cập nhật theo bảng tính sau tối đa 5 phút. Mỗi tháng mới, tạo trang lịch đặt tên đúng dạng `T12/2026` với bố cục như các tháng trước.

## Đo lượt truy cập (Google Analytics)

1. Vào https://analytics.google.com bằng tài khoản Google → **Bắt đầu đo lường** → tạo tài khoản và thuộc tính "Bimon Homestay" (múi giờ Việt Nam, tiền VND).
2. Chọn nền tảng **Web**, nhập `https://bimonhomestay.com` → tạo luồng → copy **Mã đo lường** (dạng `G-XXXXXXXXXX`).
3. Hostinger → app Node.js → **Biến môi trường**: thêm `GA_MEASUREMENT_ID` = mã đó → triển khai lại.

Để trống biến này thì website không gắn Google Analytics.

## Giá phòng

Giá hiện ở thẻ phòng trang chủ (`public/index.html` + bản tiếng Anh trong `public/js/home.js`), trang chi tiết phòng (`price` trong `content/rooms.json`) và phần ước tính tiền của nút kiểm tra phòng trống (`ROOMS` trong `public/js/home.js`). Đổi giá thì sửa cả ba chỗ.

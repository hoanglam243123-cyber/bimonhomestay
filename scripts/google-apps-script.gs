/**
 * Bimon Homestay – gửi lịch phòng (màu ô) cho website.
 *
 * Cách cài (làm 1 lần):
 * 1. Mở Google Sheet "BiMon Homestay" → Tiện ích mở rộng → Apps Script.
 * 2. Xoá hết code mẫu, dán toàn bộ file này vào, bấm Lưu.
 * 3. Bấm Triển khai → Tùy chọn triển khai mới → loại "Ứng dụng web":
 *      - Thực thi dưới dạng: Tôi
 *      - Người có quyền truy cập: Bất kỳ ai
 *    → Triển khai → cấp quyền → copy "URL ứng dụng web" (dạng https://script.google.com/macros/s/.../exec).
 * 4. Dán URL đó vào biến môi trường AVAILABILITY_URL của website trên Hostinger.
 *
 * Chỉ gửi các trang lịch tên dạng "T10/2026" (số ngày + màu ô).
 * KHÔNG gửi các trang "Đặt lịch..." có tên và số điện thoại khách.
 */
function doGet() {
  var sheets = {};
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(function (sh) {
    var name = sh.getName().trim();
    if (!/^T\d{1,2}\/\d{4}$/.test(name)) return;
    var rows = Math.min(Math.max(sh.getLastRow(), 1), 60);
    var cols = Math.min(Math.max(sh.getLastColumn(), 1), 26);
    var range = sh.getRange(1, 1, rows, cols);
    sheets[name] = { values: range.getDisplayValues(), colors: range.getBackgrounds() };
  });
  return ContentService
    .createTextOutput(JSON.stringify({ updated: new Date().toISOString(), sheets: sheets }))
    .setMimeType(ContentService.MimeType.JSON);
}

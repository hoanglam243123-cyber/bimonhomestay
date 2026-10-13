// Bimon Homestay – nút đổi sáng/tối. Mặc định theo cài đặt máy của khách; bấm nút thì ghi nhớ lựa chọn.
// (Đoạn đặt data-theme lúc tải trang nằm ngay trong <head> để không bị nháy màu.)
(() => {
  const btn = document.getElementById("themeBtn");
  if (!btn) return;
  const root = document.documentElement;
  const sysDark = matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : sysDark.matches;
  const sync = () => {
    const dark = isDark();
    btn.setAttribute("aria-pressed", dark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#12160F" : "#4A5D3A";
  };
  btn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("bimon-theme", root.dataset.theme); } catch (e) {}
    sync();
  });
  sysDark.addEventListener("change", sync);
  sync();
})();

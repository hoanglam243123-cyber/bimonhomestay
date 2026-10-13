// Bimon Homestay – nút liên hệ nổi (gọi, WhatsApp, Zalo, Messenger), dùng chung cho mọi trang.
(() => {
  const $ = (id) => document.getElementById(id);
  const fab = $("fab");
  if (!fab) return;
  const LABEL = { vi: { hide: "Thu gọn liên hệ", show: "Mở liên hệ" }, en: { hide: "Hide contact options", show: "Show contact options" } };
  const pops = [...fab.querySelectorAll(".fab-item > button")];
  const closePops = (except) => pops.forEach((b) => { if (b !== except) { b.setAttribute("aria-expanded", "false"); $(b.getAttribute("aria-controls")).hidden = true; } });
  pops.forEach((b) => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    closePops(b);
    b.setAttribute("aria-expanded", open); $(b.getAttribute("aria-controls")).hidden = !open;
  }));
  function setFab(open) {
    fab.classList.toggle("closed", !open);
    $("fabToggle").setAttribute("aria-expanded", open);
    $("fabToggle").setAttribute("aria-label", (LABEL[document.documentElement.lang] || LABEL.vi)[open ? "hide" : "show"]);
    if (!open) closePops();
  }
  $("fabToggle").addEventListener("click", () => setFab(fab.classList.contains("closed")));
  // Màn hình nhỏ: thu gọn sẵn để không che nội dung
  if (matchMedia("(max-width: 767px)").matches) setFab(false);
  document.addEventListener("click", (e) => { if (!e.target.closest(".fab-item")) closePops(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePops(); });
})();

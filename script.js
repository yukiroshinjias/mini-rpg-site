// Последний релиз с GitHub: прямая ссылка на архив, версия и размер
(async () => {
  try {
    const res = await fetch("https://api.github.com/repos/yukiroshinjias/mini-rpg-releases/releases/latest");
    if (!res.ok) return;
    const rel = await res.json();
    const zip = (rel.assets || []).find(a => a.name.toLowerCase().endsWith(".zip"));
    if (zip) {
      document.querySelectorAll(".js-download").forEach(a => (a.href = zip.browser_download_url));
      const mb = Math.round(zip.size / 1024 / 1024);
      document.querySelectorAll(".js-size").forEach(e => (e.textContent = mb + " МБ"));
    }
    document.querySelectorAll(".js-version").forEach(e => (e.textContent = "Версия " + rel.tag_name.replace(/^v/, "")));
    document.querySelectorAll(".js-version-plain").forEach(e => (e.textContent = rel.tag_name.replace(/^v/, "")));
  } catch (e) {
    // без сети остаются ссылки на страницу релизов
  }
})();

// Галерея: снимок крупно по клику, закрыть — клик или Esc
const box = document.getElementById("lightbox");
const boxImg = box.querySelector("img");
document.querySelectorAll(".gallery button").forEach(b =>
  b.addEventListener("click", () => {
    const img = b.querySelector("img");
    boxImg.src = img.src;
    boxImg.alt = img.alt;
    box.classList.add("open");
  })
);
box.addEventListener("click", () => box.classList.remove("open"));
document.addEventListener("keydown", e => { if (e.key === "Escape") box.classList.remove("open"); });

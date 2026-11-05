// Скачивание — только последняя версия. Ссылка берётся с GitHub при открытии страницы,
// обновляется каждые 5 минут и проверяется ещё раз в момент нажатия «Скачать».
const API = "https://api.github.com/repos/yukiroshinjias/mini-rpg-releases/releases/latest";
const FALLBACK = "https://github.com/yukiroshinjias/mini-rpg-releases/releases/latest";
let latest = null;

async function fetchLatest() {
  const res = await fetch(API, { cache: "no-store", headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error("GitHub " + res.status);
  const rel = await res.json();
  const zip = (rel.assets || []).find(a => a.name.toLowerCase().endsWith(".zip"));
  if (!zip) throw new Error("в релизе нет архива");
  return { version: rel.tag_name.replace(/^v/, ""), url: zip.browser_download_url, size: zip.size };
}

function show(info) {
  latest = info;
  document.querySelectorAll(".js-download").forEach(a => (a.href = info.url));
  document.querySelectorAll(".js-version").forEach(e => (e.textContent = "Версия " + info.version));
  document.querySelectorAll(".js-version-plain").forEach(e => (e.textContent = info.version));
  document.querySelectorAll(".js-size").forEach(e => (e.textContent = Math.round(info.size / 1024 / 1024) + " МБ"));
}

async function refresh() {
  try { show(await fetchLatest()); } catch (e) { /* без ответа GitHub остаётся прежняя ссылка */ }
}

refresh();
setInterval(refresh, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });

// Нажали «Скачать» — ещё раз спрашиваем GitHub, вдруг вышла новая версия
document.querySelectorAll(".js-download").forEach(a =>
  a.addEventListener("click", async e => {
    e.preventDefault();
    const label = a.textContent;
    a.textContent = "Проверяю версию…";
    let url = latest ? latest.url : FALLBACK;
    try {
      const info = await fetchLatest();
      show(info);
      url = info.url;
    } catch (err) { /* GitHub не ответил — качаем то, что знаем */ }
    a.textContent = label;
    window.location.href = url;
  })
);

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

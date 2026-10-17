// Shared by every page: footer year, navigation menu, share button
document.getElementById("y").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
const toggle = nav.querySelector(".nav-toggle");
const subs = [...nav.querySelectorAll(".has-sub")];

function setMenu(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
}
function setSub(li, open) {
  li.classList.toggle("open", open);
  li.querySelector(".sub-toggle").setAttribute("aria-expanded", String(open));
}
function closeAll() {
  setMenu(false);
  subs.forEach((li) => setSub(li, false));
}

toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
subs.forEach((li) =>
  li.querySelector(".sub-toggle").addEventListener("click", () => setSub(li, !li.classList.contains("open")))
);
nav.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", closeAll));
document.addEventListener("click", (e) => { if (!nav.contains(e.target)) closeAll(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

// Share: native share sheet on phones, otherwise copy the link
const shareBtn = document.querySelector(".share");
const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
document.body.append(toast);

shareBtn.addEventListener("click", async () => {
  const url = document.querySelector('link[rel="canonical"]')?.href || location.href;
  const data = { title: document.title, text: document.querySelector('meta[name="description"]')?.content, url };
  if (navigator.share) {
    try { await navigator.share(data); } catch (_) { /* cancelled */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.textContent = "Link kopiert";
  } catch (_) {
    toast.textContent = url;
  }
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});

(function () {
  const html = document.documentElement;
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const langButtons = document.querySelectorAll(".lang-toggle button");
  const storeLinks = window.BLOKRAAI_STORE || {};

  document.querySelectorAll("[data-store-badges]").forEach(function (slot) {
    const template = document.getElementById("store-badges-template");
    if (!template) return;

    const badges = template.content.cloneNode(true);
    badges.querySelectorAll("[data-store]").forEach(function (link) {
      const url = storeLinks[link.dataset.store];
      if (url) link.href = url;
    });
    slot.appendChild(badges);
  });

  const savedLang = localStorage.getItem("blokraai-lang") || "af";
  html.lang = savedLang;
  langButtons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.lang === savedLang);
  });

  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const lang = btn.dataset.lang;
      html.lang = lang;
      localStorage.setItem("blokraai-lang", lang);
      langButtons.forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
    });
  });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }
})();

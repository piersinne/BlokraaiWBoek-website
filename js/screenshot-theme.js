/**
 * Light / dark screenshot toggle for carousels with data-screenshot-theme-toggle.
 *
 * Default is always light (Lig). File naming:
 *   Light: 01.png, 02.png, …
 *   Dark:  01-dark.png, 02-dark.png, …
 */
(function () {
  function setToggleState(toggle, theme) {
    if (!toggle) return;
    toggle.querySelectorAll("[data-screenshot-theme]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-screenshot-theme") === theme;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function applyTheme(carousel, toggle, theme) {
    theme = theme === "dark" ? "dark" : "light";
    carousel.setAttribute("data-screenshot-theme", theme);
    setToggleState(toggle, theme);
    if (window.setCarouselScreenshotTheme) {
      window.setCarouselScreenshotTheme(carousel, theme);
    }
  }

  function initScreenshotThemeToggles() {
    document.querySelectorAll("[data-screenshot-theme-toggle]").forEach(function (carousel) {
      var panel = carousel.closest(".carousel-screenshot-panel");
      var toggle = panel ? panel.querySelector(".screenshot-theme-toggle") : null;
      if (!toggle) return;

      carousel.setAttribute("data-screenshot-theme", "light");
      setToggleState(toggle, "light");

      toggle.querySelectorAll("[data-screenshot-theme]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var theme = btn.getAttribute("data-screenshot-theme");
          if (!theme) return;
          applyTheme(carousel, toggle, theme);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScreenshotThemeToggles);
  } else {
    initScreenshotThemeToggles();
  }
})();

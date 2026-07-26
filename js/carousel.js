/**
 * Screenshot carousel for feature pages.
 */
(function () {
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function (root) {
      const track = root.querySelector(".carousel-track");
      const slides = root.querySelectorAll(".carousel-slide");
      const copyItems = root.querySelectorAll("[data-carousel-copy]");
      const counter = root.querySelector("[data-carousel-counter]");
      const prevBtn = root.querySelector("[data-carousel-prev]");
      const nextBtn = root.querySelector("[data-carousel-next]");
      const dotsRoot = root.querySelector(".carousel-dots");

      if (!track || slides.length === 0) return;

      let index = 0;

      if (dotsRoot) dotsRoot.innerHTML = "";

      slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Slide " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
        });
        if (dotsRoot) dotsRoot.appendChild(dot);
      });

      const dots = dotsRoot ? dotsRoot.querySelectorAll(".carousel-dot") : [];

      function preloadNearbySlides(activeIndex) {
        var loader = window.loadCarouselSlideImage;
        if (!loader) return;
        [activeIndex - 1, activeIndex, activeIndex + 1].forEach(function (j) {
          if (j < 0 || j >= slides.length) return;
          loader(slides[j]);
        });
      }

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        preloadNearbySlides(index);
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (dot, j) {
          dot.classList.toggle("active", j === index);
        });
        slides.forEach(function (slide, j) {
          slide.setAttribute("aria-hidden", j !== index ? "true" : "false");
        });
        copyItems.forEach(function (item, j) {
          item.classList.toggle("is-active", j === index);
          item.setAttribute("aria-hidden", j !== index ? "true" : "false");
        });
        if (counter) {
          counter.textContent = index + 1 + " / " + slides.length;
        }
        root.dispatchEvent(
          new CustomEvent("carousel-slide-change", { detail: { index: index } })
        );
        requestAnimationFrame(function () {
          var activeSlide = slides[index];
          if (!activeSlide) return;
          var activeImg = activeSlide.querySelector("img.is-loaded");
          if (activeImg) {
            activeImg.style.transform = "translateZ(0)";
          }
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          goTo(index - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          goTo(index + 1);
        });
      }

      var startX = 0;
      root.addEventListener(
        "touchstart",
        function (e) {
          startX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );

      root.addEventListener(
        "touchend",
        function (e) {
          var diff = e.changedTouches[0].screenX - startX;
          if (Math.abs(diff) < 40) return;
          goTo(diff > 0 ? index - 1 : index + 1);
        },
        { passive: true }
      );

      goTo(0);

      root.addEventListener("carousel-slide-image-ready", function () {
        goTo(index);
      });
    });
  }

  function boot() {
    if (document.querySelector("[data-carousel-assets]")) {
      document.addEventListener("carousel-content-ready", initCarousels, { once: true });
    } else if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCarousels);
    } else {
      initCarousels();
    }
  }

  boot();
})();

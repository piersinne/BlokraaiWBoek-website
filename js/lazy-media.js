/**
 * Defer heavy video downloads until the user interacts.
 */
(function () {
  function activateVideo(video) {
    var src = video.getAttribute("data-src");
    if (!src || video.getAttribute("src")) return;
    video.setAttribute("src", src);
    video.removeAttribute("data-src");
  }

  function initLazyVideos() {
    document.querySelectorAll("video[data-src]").forEach(function (video) {
      video.setAttribute("preload", "none");

      function loadSource() {
        activateVideo(video);
      }

      video.addEventListener("play", loadSource, { once: true });
      video.addEventListener("pointerdown", loadSource, { once: true });
    });

    document.querySelectorAll('video[src]:not([data-src])').forEach(function (video) {
      if (!video.hasAttribute("preload")) {
        video.setAttribute("preload", "none");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyVideos);
  } else {
    initLazyVideos();
  }
})();

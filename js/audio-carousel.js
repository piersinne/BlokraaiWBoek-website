/**
 * Audio narration for tutorial carousels (data-audio-carousel).
 * Expects MP3 files named 01.mp3, 02.mp3, … beside NN.png in data-audio-assets.
 * Author scripts (talk-NN.txt) are not used here.
 * Shows the play button only when that slide's MP3 exists.
 * Plays on button tap; tap again to stop. Never loops or auto-restarts.
 */
(function () {
  var activePlayer = null;
  var audioAvailability = new Map();

  function stopActivePlayer() {
    if (!activePlayer) return;
    activePlayer.audio.pause();
    activePlayer.audio.currentTime = 0;
    resetPlayButton(activePlayer.btn);
    activePlayer = null;
  }

  function resetPlayButton(btn) {
    if (!btn) return;
    btn.classList.remove("is-playing", "is-loading", "is-unavailable");
    btn.removeAttribute("aria-pressed");
  }

  function setPlaying(btn) {
    btn.classList.remove("is-loading", "is-unavailable");
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
  }

  function setLoading(btn) {
    btn.classList.add("is-loading");
    btn.classList.remove("is-playing", "is-unavailable");
  }

  function setPlayButtonVisible(btn, visible) {
    btn.hidden = !visible;
    if (!visible) {
      resetPlayButton(btn);
    }
  }

  function slideNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  function resolveAudioUrl(audioBase, index) {
    var relativePath = audioBase.replace(/\/?$/, "/") + slideNumber(index) + ".mp3";
    try {
      return new URL(relativePath, window.location.href).href;
    } catch (e) {
      return relativePath;
    }
  }

  function checkAudioExists(absoluteUrl) {
    if (audioAvailability.get(absoluteUrl) === true) {
      return Promise.resolve(true);
    }

    return new Promise(function (resolve) {
      var probe = new Audio();
      var settled = false;

      function finish(exists) {
        if (settled) return;
        settled = true;
        probe.removeAttribute("src");
        probe.load();
        if (exists) {
          audioAvailability.set(absoluteUrl, true);
        }
        resolve(exists);
      }

      probe.addEventListener(
        "loadedmetadata",
        function () {
          finish(true);
        },
        { once: true }
      );

      probe.addEventListener(
        "error",
        function () {
          finish(false);
        },
        { once: true }
      );

      probe.preload = "metadata";
      probe.src = absoluteUrl;
    });
  }

  function mountPlayButton(root, playBtn) {
    if (!playBtn) return;
    var active = root.querySelector(".carousel-copy-item.is-active");
    var header = active && active.querySelector(".carousel-copy-item-header");
    if (header) {
      header.appendChild(playBtn);
    }
  }

  function initAudioCarousel(root) {
    var audioBase = root.getAttribute("data-audio-assets");
    var playBtn = root.querySelector("[data-audio-play]");
    if (!audioBase || !playBtn) return;

    mountPlayButton(root, playBtn);

    var audio = new Audio();
    audio.preload = "none";
    audio.loop = false;
    var checkTimer = null;

    playBtn.hidden = true;

    audio.addEventListener("ended", function () {
      audio.pause();
      audio.currentTime = 0;
      resetPlayButton(playBtn);
      if (activePlayer && activePlayer.btn === playBtn) {
        activePlayer = null;
      }
    });

    function currentIndex() {
      var items = root.querySelectorAll("[data-carousel-copy]");
      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains("is-active")) return i;
      }
      return 0;
    }

    function updatePlayButtonForSlide(index) {
      clearTimeout(checkTimer);
      checkTimer = setTimeout(function () {
        var url = resolveAudioUrl(audioBase, index);
        checkAudioExists(url).then(function (exists) {
          if (currentIndex() !== index) return;
          setPlayButtonVisible(playBtn, exists);
        });
      }, 30);
    }

    function playCurrentSlide() {
      if (playBtn.hidden) return;

      if (activePlayer && activePlayer.root === root && activePlayer.btn === playBtn && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        resetPlayButton(playBtn);
        activePlayer = null;
        return;
      }

      if (activePlayer && activePlayer.root !== root) {
        stopActivePlayer();
      }

      var index = currentIndex();
      var url = resolveAudioUrl(audioBase, index);

      setLoading(playBtn);
      audio.pause();
      audio.loop = false;
      audio.currentTime = 0;
      audio.src = url;

      audio
        .play()
        .then(function () {
          setPlaying(playBtn);
          activePlayer = { root: root, audio: audio, btn: playBtn, index: index };
        })
        .catch(function () {
          setPlayButtonVisible(playBtn, false);
          activePlayer = null;
        });
    }

    playBtn.addEventListener("click", playCurrentSlide);

    root.addEventListener("carousel-slide-change", function (e) {
      var index =
        e.detail && typeof e.detail.index === "number" ? e.detail.index : currentIndex();

      if (activePlayer && activePlayer.root === root) {
        stopActivePlayer();
      } else {
        resetPlayButton(playBtn);
      }

      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();

      mountPlayButton(root, playBtn);
      updatePlayButtonForSlide(index);
    });

    document.addEventListener(
      "carousel-content-ready",
      function () {
        updatePlayButtonForSlide(currentIndex());
      },
      { once: true }
    );

    updatePlayButtonForSlide(currentIndex());
  }

  function boot() {
    document.querySelectorAll("[data-audio-carousel]").forEach(initAudioCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

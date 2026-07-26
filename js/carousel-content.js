/**
 * Load skermgreep display copy from NN.txt files (via sync) or fetch when on a web server.
 *
 * Per slide NN (01, 02, …) the website uses:
 *   NN.png, NN-dark.png, NN.mp3, NN.txt
 * Author scripts (any file starting with talk, e.g. talk-01.txt, talk03.txt) are never loaded here.
 *
 * Text priority:
 *   1. *.html carousel-copy section (built-in default for each slide)
 *   2. NN.txt overrides that slide when the file exists (optional; skipped if data-carousel-html-copy)
 *   3. js/generated/*-slides.js only when opening .html directly (file://), unless data-carousel-html-copy
 *
 * Local editing:
 *   1. Edit HTML for slides without NN.txt, or edit assets/.../screenshots/NN.txt to override
 *   2. Double-click website/sync-text.bat (for file:// preview only)
 *   3. Refresh browser
 */

(function () {
  function parseCarouselTxt(raw) {
    const result = {
      af: { title: "", body: "" },
      en: { title: "", body: "" },
    };

    const parts = raw.split(/\[(af|en)\]/gi);
    for (let i = 1; i < parts.length; i += 2) {
      const lang = parts[i].toLowerCase();
      const block = (parts[i + 1] || "").trim();
      if (!block) continue;

      const titleLine = block.match(/^title\s*=\s*(.+)$/im);
      if (titleLine) {
        result[lang].title = titleLine[1].trim();
        result[lang].body = block.replace(/^title\s*=\s*.+$/im, "").trim();
      } else {
        result[lang].body = block;
      }
    }

    return result;
  }

  function hasDisplayCopy(parsed) {
    if (!parsed) return false;
    return (
      !!(parsed.af && (parsed.af.title || parsed.af.body)) ||
      !!(parsed.en && (parsed.en.title || parsed.en.body))
    );
  }

  function applyParsed(item, parsed) {
    if (!hasDisplayCopy(parsed)) return;
    if (parsed.af.title || parsed.af.body) {
      setCopyText(item, "af", parsed.af.title, parsed.af.body);
    }
    if (parsed.en.title || parsed.en.body) {
      setCopyText(item, "en", parsed.en.title, parsed.en.body);
    }
  }

  function setCopyText(container, lang, title, body) {
    const h3 = container.querySelector("h3.lang-" + lang);
    const p = container.querySelector("p.lang-" + lang);
    if (h3) {
      if (title) {
        h3.textContent = title;
        h3.hidden = false;
      } else {
        h3.hidden = true;
      }
    }
    if (body && p) {
      p.textContent = body;
      p.classList.add("has-body-text");
    }
  }

  function buildScreenshotUrl(assetPath, num, theme) {
    var suffix = theme === "dark" ? "-dark" : "";
    return assetPath + "/" + num + suffix + ".png";
  }

  window.buildScreenshotUrl = buildScreenshotUrl;

  function wireSlideImage(slide, assetPath, num, slideIndex, theme, eager) {
    var img = slide.querySelector("img");
    var placeholder = slide.querySelector(".carousel-slide-placeholder");
    theme = theme || "light";
    var url = buildScreenshotUrl(assetPath, num, theme);
    var deferLoad = !eager && slideIndex > 0;

    if (placeholder) placeholder.remove();

    if (img) {
      var fresh = document.createElement("img");
      fresh.alt = img.alt || "Skermgreep " + num;
      fresh.setAttribute("decoding", "async");
      img.replaceWith(fresh);
      img = fresh;
    } else {
      img = document.createElement("img");
      img.alt = "Skermgreep " + num;
      img.setAttribute("decoding", "async");
      slide.appendChild(img);
    }

    function markLoaded() {
      img.classList.add("is-loaded");
      if (placeholder) placeholder.remove();
      slide.dispatchEvent(new CustomEvent("carousel-slide-image-ready", { bubbles: true }));
    }

    img.addEventListener("load", markLoaded);
    img.addEventListener("error", function () {
      if (slide.querySelector(".carousel-slide-placeholder")) return;
      var fileName = num + (theme === "dark" ? "-dark" : "") + ".png";
      var fallback = document.createElement("div");
      fallback.className = "carousel-slide-placeholder";
      fallback.innerHTML =
        "<strong>" +
        num +
        '</strong><span class="lang-af">Kon nie ' +
        fileName +
        ' laai nie</span><span class="lang-en">Could not load ' +
        fileName +
        "</span>";
      slide.appendChild(fallback);
    });

    if (deferLoad) {
      img.setAttribute("data-src", url);
      img.setAttribute("loading", "lazy");
      img.removeAttribute("src");
    } else {
      img.setAttribute("loading", "eager");
      img.removeAttribute("data-src");
      img.src = url;
    }

    if (!deferLoad && img.complete && img.naturalWidth > 0) {
      markLoaded();
    }
  }

  window.loadCarouselSlideImage = function (slide) {
    if (!slide) return;
    var img = slide.querySelector("img");
    if (!img) return;
    var dataSrc = img.getAttribute("data-src");
    if (dataSrc) {
      img.classList.remove("is-loaded");
      img.src = dataSrc;
      img.removeAttribute("data-src");
    }
  };

  function loadFromGenerated(root) {
    const key = root.getAttribute("data-carousel-key");
    const store = window.CAROUSEL_TEXT && key ? window.CAROUSEL_TEXT[key] : null;
    if (!store) return false;

    const copyItems = root.querySelectorAll("[data-carousel-copy]");
    let loaded = false;

    copyItems.forEach(function (item, index) {
      const num = String(index + 1).padStart(2, "0");
      const parsed = store[num];
      if (hasDisplayCopy(parsed)) {
        applyParsed(item, parsed);
        loaded = true;
      }
    });

    return loaded;
  }

  async function loadTextFromFetch(root) {
    const assetPath = root.getAttribute("data-carousel-assets");
    if (!assetPath) return false;

    const copyItems = root.querySelectorAll("[data-carousel-copy]");
    let loaded = false;

    const tasks = Array.from(copyItems).map(function (item, index) {
      const num = String(index + 1).padStart(2, "0");
      const txtUrl = assetPath + "/" + num + ".txt?t=" + Date.now();

      return fetch(txtUrl)
        .then(function (res) {
          if (!res.ok) return null;
          return res.text();
        })
        .then(function (raw) {
          if (!raw) return;
          applyParsed(item, parseCarouselTxt(raw));
          loaded = true;
        })
        .catch(function () {
          return null;
        });
    });

    await Promise.all(tasks);
    return loaded;
  }

  async function loadFromFetch(root) {
    const assetPath = root.getAttribute("data-carousel-assets");
    if (!assetPath) return false;

    const copyItems = root.querySelectorAll("[data-carousel-copy]");
    const slides = root.querySelectorAll(".carousel-slide");
    let loaded = false;

    const tasks = copyItems.map(function (item, index) {
      const num = String(index + 1).padStart(2, "0");
      const txtUrl = assetPath + "/" + num + ".txt?t=" + Date.now();

      if (slides[index]) {
        var theme = root.getAttribute("data-screenshot-theme") || "light";
        wireSlideImage(slides[index], assetPath, num, index, theme, index === 0);
      }

      return fetch(txtUrl)
        .then(function (res) {
          if (!res.ok) return null;
          return res.text();
        })
        .then(function (raw) {
          if (!raw) return;
          applyParsed(item, parseCarouselTxt(raw));
          loaded = true;
        })
        .catch(function () {
          return null;
        });
    });

    await Promise.all(tasks);
    return loaded;
  }

  function wireImages(root, eagerSlideIndex) {
    const assetPath = root.getAttribute("data-carousel-assets");
    if (!assetPath) return;
    const theme = root.getAttribute("data-screenshot-theme") || "light";
    root.querySelectorAll(".carousel-slide").forEach(function (slide, index) {
      const num = String(index + 1).padStart(2, "0");
      const eager =
        typeof eagerSlideIndex === "number"
          ? index === eagerSlideIndex
          : index === 0;
      wireSlideImage(slide, assetPath, num, index, theme, eager);
    });
  }

  window.setCarouselScreenshotTheme = function (root, theme) {
    if (!root || !root.hasAttribute("data-screenshot-theme-toggle")) return;

    theme = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-screenshot-theme", theme);

    var activeIndex = 0;
    root.querySelectorAll(".carousel-slide").forEach(function (slide, index) {
      if (slide.getAttribute("aria-hidden") === "false") activeIndex = index;
    });

    wireImages(root, activeIndex);

    if (window.loadCarouselSlideImage) {
      [activeIndex - 1, activeIndex, activeIndex + 1].forEach(function (j) {
        var slide = root.querySelectorAll(".carousel-slide")[j];
        if (slide) window.loadCarouselSlideImage(slide);
      });
    }

    root.dispatchEvent(
      new CustomEvent("carousel-screenshot-theme-change", {
        detail: { theme: theme, index: activeIndex },
      })
    );
  };

  async function loadCarouselContent(root) {
    var theme = root.getAttribute("data-screenshot-theme") || "light";
    if (root.hasAttribute("data-screenshot-theme-toggle")) {
      root.setAttribute("data-screenshot-theme", theme);
    }
    wireImages(root);

    var htmlCopyOnly = root.hasAttribute("data-carousel-html-copy");

    if (location.protocol === "file:") {
      if (!htmlCopyOnly) {
        loadFromGenerated(root);
      }
      return;
    }

    if (htmlCopyOnly) {
      return;
    }

    try {
      if (root.hasAttribute("data-audio-carousel")) {
        await loadTextFromFetch(root);
      } else {
        await loadFromFetch(root);
      }
    } catch (e) {
      console.warn("Slide text fetch failed — run website/sync-text.bat after editing .txt files.");
      loadFromGenerated(root);
    }
  }

  async function boot() {
    const roots = document.querySelectorAll("[data-carousel]");
    await Promise.all(Array.from(roots).map(loadCarouselContent));
    document.dispatchEvent(new CustomEvent("carousel-content-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

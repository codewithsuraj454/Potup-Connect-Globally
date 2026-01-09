(function () {
  function init() {
    if (window.__darkGlassMenuInstalled) return;
    window.__darkGlassMenuInstalled = true;

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `
      #glassContextMenu {
        position: fixed;
        display: none;
        min-width: 250px;
        padding: 8px;
        border-radius: 16px;

        background: rgba(20, 25, 35, 0.85);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);

        border: 1px solid rgba(120, 180, 255, 0.35);
        box-shadow: 0 20px 50px rgba(0,0,0,0.45);

        z-index: 2147483647;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        color: #eaf4ff;

        transform: scale(0.96);
        opacity: 0;
        transition: transform 0.12s ease, opacity 0.12s ease;
      }

      #glassContextMenu.show {
        transform: scale(1);
        opacity: 1;
      }

      .gcm-item {
        padding: 11px 14px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-weight: 500;
        user-select: none;
        transition: background 0.15s ease;
      }

      .gcm-item:hover {
        background: rgba(120, 180, 255, 0.18);
      }

      .gcm-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .gcm-icon {
        width: 16px;
        height: 16px;
        opacity: 0.85;
      }

      .gcm-hint {
        opacity: 0.45;
        font-size: 12px;
      }

      .gcm-divider {
        height: 1px;
        margin: 6px 8px;
        background: rgba(255,255,255,0.12);
      }

      .gcm-hidden {
        display: none !important;
      }
    `;
    document.documentElement.appendChild(style);

    // Create menu
    const menu = document.createElement("div");
    menu.id = "glassContextMenu";
    menu.innerHTML = `
      <div class="gcm-item" id="gcm-copy">
        <div class="gcm-left"><span class="gcm-icon">⧉</span> Copy</div>
        <span class="gcm-hint">Ctrl+C</span>
      </div>

      <div class="gcm-item" id="gcm-search">
        <div class="gcm-left"><span class="gcm-icon">🔍</span> Search Selection</div>
      </div>

      <div class="gcm-item" id="gcm-download">
        <div class="gcm-left"><span class="gcm-icon">⬇</span> Download Image</div>
      </div>

      <div class="gcm-divider"></div>

      <div class="gcm-item" id="gcm-info">
        <div class="gcm-left"><span class="gcm-icon">ℹ</span> Info</div>
      </div>

      <div class="gcm-item" id="gcm-refresh">
        <div class="gcm-left"><span class="gcm-icon">⟳</span> Refresh</div>
        <span class="gcm-hint">F5</span>
      </div>
    `;
    document.body.appendChild(menu);

    const $ = (id) => menu.querySelector(id);

    const copyBtn = $("#gcm-copy");
    const searchBtn = $("#gcm-search");
    const downloadBtn = $("#gcm-download");
    const infoBtn = $("#gcm-info");
    const refreshBtn = $("#gcm-refresh");

    let rightClickedImage = null;

    // Open menu (capture phase)
    window.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        rightClickedImage = null;

        if (e.target && e.target.tagName === "IMG") {
          rightClickedImage = e.target;
          downloadBtn.classList.remove("gcm-hidden");
        } else {
          downloadBtn.classList.add("gcm-hidden");
        }

        const sel = window.getSelection().toString();
        if (!sel) {
          copyBtn.classList.add("gcm-hidden");
          searchBtn.classList.add("gcm-hidden");
        } else {
          copyBtn.classList.remove("gcm-hidden");
          searchBtn.classList.remove("gcm-hidden");
        }

        let x = e.clientX;
        let y = e.clientY;

        if (x + 280 > window.innerWidth) x = window.innerWidth - 280;
        if (y + 280 > window.innerHeight) y = window.innerHeight - 280;

        menu.style.left = x + "px";
        menu.style.top = y + "px";
        menu.style.display = "block";

        requestAnimationFrame(() => menu.classList.add("show"));
      },
      true
    );

    // Hide menu
    function hide() {
      menu.classList.remove("show");
      setTimeout(() => (menu.style.display = "none"), 120);
    }

    window.addEventListener("click", hide, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide, true);

    // Actions
    copyBtn.onclick = async () => {
      const text = window.getSelection().toString();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        alert("Copy failed");
      }
    };

    searchBtn.onclick = () => {
      const text = window.getSelection().toString();
      if (!text) return;
      window.open(
        "https://www.google.com/search?q=" + encodeURIComponent(text),
        "_blank"
      );
    };

    downloadBtn.onclick = () => {
      if (!rightClickedImage) return;
      const a = document.createElement("a");
      a.href = rightClickedImage.src;
      a.download = "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    infoBtn.onclick = () => alert("Coming soon");

    refreshBtn.onclick = () => location.reload();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

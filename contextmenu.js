(function () {
  function init() {
    if (window.__potupContextMenuInstalled) return;
    window.__potupContextMenuInstalled = true;

    /* ── STYLES ── */
    const style = document.createElement('style');
    style.textContent = `
      #potupCtxMenu {
        position: fixed;
        display: none;
        width: 210px;
        padding: 5px;
        border-radius: 14px;
        z-index: 2147483647;

        /* Apple liquid glass */
        background: rgba(26, 26, 40, 0.88);
        backdrop-filter: blur(48px) saturate(200%);
        -webkit-backdrop-filter: blur(48px) saturate(200%);
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow:
          0 14px 50px rgba(0,0,0,0.60),
          0 2px 8px rgba(0,0,0,0.35),
          inset 0 1px 0 rgba(255,255,255,0.10);

        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
        font-size: 13.5px;
        color: rgba(255,255,255,0.90);
        -webkit-font-smoothing: antialiased;

        /* Animation */
        transform-origin: top left;
        transform: scale(0.88) translateY(-4px);
        opacity: 0;
        transition:
          transform 0.18s cubic-bezier(0.34,1.56,0.64,1),
          opacity 0.14s ease;
        pointer-events: none;
      }

      #potupCtxMenu.pcm-visible {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: all;
      }

      .pcm-section {
        padding: 5px 11px 3px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.28);
        user-select: none;
      }

      .pcm-item {
        padding: 8px 10px;
        border-radius: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 9px;
        transition: background 0.1s ease;
        user-select: none;
        position: relative;
        -webkit-user-select: none;
      }

      .pcm-item:hover {
        background: rgba(255,255,255,0.12);
        color: #fff;
      }

      .pcm-item:active {
        background: rgba(255,255,255,0.07);
        transform: scale(0.97);
      }

      .pcm-item.pcm-danger { color: rgba(255,100,90,0.95); }
      .pcm-item.pcm-danger:hover { background: rgba(255,69,58,0.14); color: #ff6b63; }

      .pcm-icon {
        width: 26px; height: 26px;
        border-radius: 7px;
        background: rgba(255,255,255,0.08);
        display: flex; align-items: center; justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
        transition: background 0.1s ease;
      }
      .pcm-item:hover .pcm-icon { background: rgba(255,255,255,0.14); }
      .pcm-item.pcm-danger:hover .pcm-icon { background: rgba(255,69,58,0.18); }

      .pcm-label { flex: 1; font-weight: 500; }

      .pcm-hint {
        opacity: 0.35;
        font-size: 11px;
        letter-spacing: 0.2px;
      }

      .pcm-divider {
        height: 1px;
        margin: 4px 8px;
        background: rgba(255,255,255,0.09);
        border-radius: 1px;
      }

      .pcm-copied {
        position: absolute;
        right: 10px;
        background: #30d158;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 99px;
        opacity: 0;
        transform: translateX(5px);
        transition: all 0.2s ease;
        pointer-events: none;
      }
      .pcm-copied.show { opacity: 1; transform: translateX(0); }

      .pcm-hidden { display: none !important; }
    `;
    document.documentElement.appendChild(style);

    /* ── BUILD MENU ── */
    const menu = document.createElement('div');
    menu.id = 'potupCtxMenu';
    menu.innerHTML = `
      <div class="pcm-section pcm-sel-label pcm-hidden">Selection</div>

      <div class="pcm-item pcm-sel-item pcm-hidden" id="pcm-copy">
        <span class="pcm-icon">❐</span>
        <span class="pcm-label">Copy</span>
        <span class="pcm-hint">⌘C</span>
        <span class="pcm-copied" id="pcm-copy-tip">Copied!</span>
      </div>

      <div class="pcm-item pcm-sel-item pcm-hidden" id="pcm-search">
        <span class="pcm-icon">🔍</span>
        <span class="pcm-label">Search Google</span>
      </div>

      <div class="pcm-divider pcm-img-group pcm-hidden"></div>
      <div class="pcm-section pcm-img-group pcm-hidden">Image</div>

      <div class="pcm-item pcm-img-group pcm-hidden" id="pcm-save-img">
        <span class="pcm-icon">⬇</span>
        <span class="pcm-label">Save Image</span>
      </div>

      <div class="pcm-item pcm-img-group pcm-hidden" id="pcm-copy-img-url">
        <span class="pcm-icon">🔗</span>
        <span class="pcm-label">Copy Image URL</span>
      </div>

      <div class="pcm-divider"></div>
      <div class="pcm-section">Page</div>

      <div class="pcm-item" id="pcm-refresh">
        <span class="pcm-icon">↻</span>
        <span class="pcm-label">Reload</span>
        <span class="pcm-hint">F5</span>
      </div>

      <div class="pcm-item" id="pcm-back">
        <span class="pcm-icon">←</span>
        <span class="pcm-label">Go Back</span>
        <span class="pcm-hint">⌘[</span>
      </div>

      <div class="pcm-item" id="pcm-forward">
        <span class="pcm-icon">→</span>
        <span class="pcm-label">Go Forward</span>
        <span class="pcm-hint">⌘]</span>
      </div>

      <div class="pcm-divider"></div>

      <div class="pcm-item" id="pcm-info">
        <span class="pcm-icon">ℹ</span>
        <span class="pcm-label">About Potup</span>
      </div>
    `;
    document.body.appendChild(menu);

    const $ = (id) => document.getElementById(id);
    const selItems  = [...menu.querySelectorAll('.pcm-sel-item')];
    const selLabels = [...menu.querySelectorAll('.pcm-sel-label')];
    const imgGroup  = [...menu.querySelectorAll('.pcm-img-group')];

    let targetImage = null;

    /* ── SHOW MENU ── */
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      targetImage = null;

      const sel      = window.getSelection()?.toString() || '';
      const hasText  = sel.length > 0;
      const hasImage = e.target?.tagName === 'IMG';

      if (hasImage) {
        targetImage = e.target;
        imgGroup.forEach(el => el.classList.remove('pcm-hidden'));
      } else {
        imgGroup.forEach(el => el.classList.add('pcm-hidden'));
      }

      if (hasText) {
        selItems.forEach(el => el.classList.remove('pcm-hidden'));
        selLabels.forEach(el => el.classList.remove('pcm-hidden'));
      } else {
        selItems.forEach(el => el.classList.add('pcm-hidden'));
        selLabels.forEach(el => el.classList.add('pcm-hidden'));
      }

      /* Position */
      menu.style.display = 'block';
      const mw = menu.offsetWidth  || 210;
      const mh = menu.offsetHeight || 240;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let x = e.clientX;
      let y = e.clientY;

      const originX = (x + mw > vw) ? 'right' : 'left';
      const originY = (y + mh > vh) ? 'bottom' : 'top';
      menu.style.transformOrigin = `${originY} ${originX}`;

      if (x + mw > vw) x = x - mw;
      if (y + mh > vh) y = y - mh;
      if (x < 6) x = 6;
      if (y < 6) y = 6;

      menu.style.left = x + 'px';
      menu.style.top  = y + 'px';

      requestAnimationFrame(() => menu.classList.add('pcm-visible'));
    }, true);

    /* ── HIDE MENU ── */
    function hide(immediate = false) {
      menu.classList.remove('pcm-visible');
      if (immediate) {
        menu.style.display = 'none';
      } else {
        setTimeout(() => { menu.style.display = 'none'; }, 180);
      }
    }

    window.addEventListener('click',   () => hide(),       true);
    window.addEventListener('scroll',  () => hide(true),   true);
    window.addEventListener('resize',  () => hide(true),   true);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); }, true);

    /* ── ACTIONS ── */
    $('pcm-copy').addEventListener('click', async () => {
      const text = window.getSelection()?.toString();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const tip = $('pcm-copy-tip');
      tip.classList.add('show');
      $('pcm-copy').querySelector('.pcm-hint').style.opacity = '0';
      setTimeout(() => {
        tip.classList.remove('show');
        $('pcm-copy').querySelector('.pcm-hint').style.opacity = '';
      }, 1500);
    });

    $('pcm-search').addEventListener('click', () => {
      const text = window.getSelection()?.toString();
      if (!text) return;
      window.open('https://www.google.com/search?q=' + encodeURIComponent(text), '_blank');
    });

    $('pcm-save-img').addEventListener('click', () => {
      if (!targetImage) return;
      const a = document.createElement('a');
      a.href     = targetImage.src;
      a.download = targetImage.alt || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    $('pcm-copy-img-url').addEventListener('click', async () => {
      if (!targetImage) return;
      try {
        await navigator.clipboard.writeText(targetImage.src);
      } catch {
        prompt('Image URL:', targetImage.src);
      }
    });

    $('pcm-refresh').addEventListener('click',  () => location.reload());
    $('pcm-back').addEventListener('click',     () => history.back());
    $('pcm-forward').addEventListener('click',  () => history.forward());
    $('pcm-info').addEventListener('click',     () => alert('Potup v2.0\nApple-style Glass UI ✨'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

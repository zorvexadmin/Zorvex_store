// ============================================================
// Zorvex Universal Config v5 (FINAL — Complete Fix)
// Loaded by index.html, admin.html, seller.html
// ============================================================

// ============================================================
// PART 0: IMMEDIATE MANIFEST INJECTION (runs FIRST, before anything)
// ============================================================
(function ZEarlyManifest() {
  try {
    function makeIcon(size) {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const x = c.getContext('2d');
      const r = size * 0.22;
      x.fillStyle = '#2563EB';
      x.beginPath();
      x.moveTo(r, 0); x.lineTo(size - r, 0);
      x.quadraticCurveTo(size, 0, size, r);
      x.lineTo(size, size - r);
      x.quadraticCurveTo(size, size, size - r, size);
      x.lineTo(r, size);
      x.quadraticCurveTo(0, size, 0, size - r);
      x.lineTo(0, r);
      x.quadraticCurveTo(0, 0, r, 0);
      x.closePath(); x.fill();
      x.fillStyle = '#FFFFFF';
      x.font = 'bold ' + Math.round(size * 0.6) + 'px Arial, sans-serif';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('Z', size / 2, size / 2 + size * 0.03);
      return c.toDataURL('image/png');
    }

    const i192 = makeIcon(192);
    const i512 = makeIcon(512);

    const manifest = {
      name: 'Zorvex — Worldwide Store',
      short_name: 'Zorvex',
      description: 'Order products from anywhere in the world',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#2563eb',
      orientation: 'portrait',
      icons: [
        { src: i192, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: i512, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
      ]
    };

    const blobUrl = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));

    // Remove any old manifest
    document.querySelectorAll('link[rel="manifest"]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(el => el.remove());
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());

    // Manifest
    const mlink = document.createElement('link');
    mlink.rel = 'manifest'; mlink.href = blobUrl;
    document.head.appendChild(mlink);

    // Favicon
    const fav = document.createElement('link');
    fav.rel = 'icon'; fav.type = 'image/png'; fav.href = i192;
    document.head.appendChild(fav);

    // Apple touch icon
    const apple = document.createElement('link');
    apple.rel = 'apple-touch-icon'; apple.href = i192;
    document.head.appendChild(apple);

    // Theme color
    const theme = document.createElement('meta');
    theme.name = 'theme-color'; theme.content = '#2563eb';
    document.head.appendChild(theme);

    // Apple mobile web app
    const appleMeta1 = document.createElement('meta');
    appleMeta1.name = 'apple-mobile-web-app-capable'; appleMeta1.content = 'yes';
    document.head.appendChild(appleMeta1);

    const appleMeta2 = document.createElement('meta');
    appleMeta2.name = 'apple-mobile-web-app-status-bar-style'; appleMeta2.content = 'black-translucent';
    document.head.appendChild(appleMeta2);

    const appleMeta3 = document.createElement('meta');
    appleMeta3.name = 'apple-mobile-web-app-title'; appleMeta3.content = 'Zorvex';
    document.head.appendChild(appleMeta3);

    window._zManifestURL = blobUrl;
    window._zIcons = { i192, i512 };
  } catch(e) { console.warn('Early manifest failed:', e); }
})();

// ============================================================
// SUPABASE CLIENT
// ============================================================
const SUPABASE_URL = "https://mebsxocivxrcfkzpbgii.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYnN4b2NpdnhyY2ZrenBiZ2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDgxNzcsImV4cCI6MjEwNTcyNDE3N30.7euPLgf0RNqyWpqct7cT61XRM1sSPdfpYuncV2z8Dc0";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// PAGE DETECTION
// ============================================================
const Z_PAGE = (() => {
  const p = window.location.pathname.toLowerCase();
  if (p.includes('admin')) return 'admin';
  if (p.includes('seller')) return 'seller';
  return 'customer';
})();

const Z_ADMIN_ROLES = ['super_admin','admin','acting_admin','sub_admin','manager','moderator'];

// ============================================================
// SAFE STORAGE
// ============================================================
const ZStorage = {
  get(k, def) { try { return localStorage.getItem(k) || def; } catch(e) { return def; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch(e) {} },
  remove(k) { try { localStorage.removeItem(k); } catch(e) {} }
};

// ============================================================
// LANGUAGE SYSTEM
// ============================================================
const Z_LANGS = [
  { code: 'en', name: 'English', flag: '🇬🇧' }, { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }, { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }, { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }, { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }, { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];
let Z_LANG = ZStorage.get('zorvex_lang', 'en');

window.googleTranslateElementInit = function() {
  try {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: Z_LANGS.map(l => l.code).join(','),
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
    window._zGTReady = true;
  } catch(e) {}
};

function zInjectGT() {
  if (!document.getElementById('google_translate_element')) {
    const d = document.createElement('div');
    d.id = 'google_translate_element';
    d.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
    document.body.appendChild(d);
  }
  if (!window._zGTLoaded) {
    window._zGTLoaded = true;
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
}

function zGetGTCombo() {
  let combo = document.querySelector('.goog-te-combo');
  if (combo) return combo;
  const all = document.getElementsByTagName('select');
  for (let i = 0; i < all.length; i++) {
    if (all[i].className === 'goog-te-combo') return all[i];
  }
  return null;
}

function zApplyLanguage(lang, retry) {
  retry = retry || 0;
  Z_LANG = lang;
  ZStorage.set('zorvex_lang', lang);
  zUpdateLangBtn();

  const combo = zGetGTCombo();
  if (combo) {
    try {
      combo.value = lang;
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      combo.dispatchEvent(evt);
    } catch(e) {}
    setTimeout(zEnforceNoTranslate, 300);
  } else if (retry < 30) {
    setTimeout(() => zApplyLanguage(lang, retry + 1), 500);
  }
}

function zUpdateLangBtn() {
  const b = document.getElementById('zlangBtn');
  if (!b) return;
  const l = Z_LANGS.find(x => x.code === Z_LANG) || Z_LANGS[0];
  b.innerHTML = l.flag + ' <span class="hidden sm:inline">' + l.code.toUpperCase() + '</span>';
}

function zInjectLangDropdown() {
  if (document.getElementById('zlangWrap')) return;
  const w = document.createElement('div');
  w.id = 'zlangWrap';
  w.className = 'fixed top-11 right-3 z-[9000]';
  const items = Z_LANGS.map(l => '<button data-zlang="' + l.code + '" class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"><span>' + l.flag + '</span><span>' + l.name + '</span></button>').join('');
  w.innerHTML = '<button id="zlangBtn" class="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">🌐 EN</button>' +
    '<div id="zlangMenu" class="hidden absolute right-0 top-11 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 max-h-72 overflow-y-auto">' + items + '</div>';
  document.body.appendChild(w);
  zUpdateLangBtn();

  document.getElementById('zlangBtn').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('zlangMenu').classList.toggle('hidden');
  });
  w.querySelectorAll('[data-zlang]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    zApplyLanguage(b.dataset.zlang);
    document.getElementById('zlangMenu').classList.add('hidden');
  }));
  document.addEventListener('click', e => {
    if (!w.contains(e.target)) document.getElementById('zlangMenu').classList.add('hidden');
  });
  const oldBtn = document.getElementById('langBtn');
  if (oldBtn) oldBtn.style.display = 'none';
}

window.addEventListener('storage', e => {
  if (e.key === 'zorvex_lang' && e.newValue && e.newValue !== Z_LANG) {
    zApplyLanguage(e.newValue);
  }
});
// ============================================================
// INSTALL SYSTEM — 3-WAY (Banner + Button + Prompt)
// ============================================================

let _zInstallPrompt = null;
let _zInstallDetected = false;

// Detect if already installed (running as standalone app)
function zIsInstalled() {
  try {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
      || document.referrer.includes('android-app://');
  } catch(e) { return false; }
}

// Listen for Chrome's native install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _zInstallPrompt = e;
  _zInstallDetected = true;
  zShowInstallButton();
});

// After install
window.addEventListener('appinstalled', () => {
  _zInstallPrompt = null;
  ZStorage.set('z_app_installed', 'true');
  zHideAllInstallUI();
});

// ============================================================
// COMPONENT 1: PERSISTENT INSTALL BUTTON (always visible)
// ============================================================
function zShowInstallButton() {
  if (zIsInstalled()) return;
  if (ZStorage.get('z_app_installed', '') === 'true') return;
  if (document.getElementById('zinstallWrap')) return;

  const w = document.createElement('div');
  w.id = 'zinstallWrap';
  w.className = 'fixed bottom-20 right-4 z-[9000]';
  w.innerHTML = `
    <button id="zinstallBtn" class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition">
      <i class="fa-solid fa-download"></i> Install Zorvex
    </button>
  `;
  document.body.appendChild(w);

  document.getElementById('zinstallBtn').addEventListener('click', () => {
    zTriggerInstall();
  });
}

// ============================================================
// COMPONENT 2: FIRST-VISIT WELCOME BANNER (our custom)
// ============================================================
function zShowFirstVisitBanner() {
  if (zIsInstalled()) return;
  if (ZStorage.get('z_app_installed', '') === 'true') return;
  if (ZStorage.get('z_banner_dismissed', '')) {
    const dismissedAt = parseInt(ZStorage.get('z_banner_dismissed', '0'));
    if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return; // 7 days cooldown
  }
  if (document.getElementById('zWelcomeBanner')) return;

  const b = document.createElement('div');
  b.id = 'zWelcomeBanner';
  b.className = 'fixed left-3 right-3 bottom-20 z-[9100] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-w-md mx-auto';
  b.style.animation = 'zSlideUp 0.4s ease-out';
  b.innerHTML = `
    <style>
      @keyframes zSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
    <div class="flex items-start gap-3">
      <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black shrink-0">Z</div>
      <div class="flex-1 min-w-0">
        <p class="font-black text-sm text-slate-900">Install Zorvex App</p>
        <p class="text-[11px] text-slate-500 mt-0.5">Faster access, works offline, no browser needed</p>
      </div>
      <button id="zBannerClose" class="text-slate-400 hover:text-slate-700 text-lg leading-none">×</button>
    </div>
    <div class="flex gap-2 mt-3">
      <button id="zBannerLater" class="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs">Later</button>
      <button id="zBannerInstall" class="flex-[2] bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs">
        <i class="fa-solid fa-download"></i> Install Now
      </button>
    </div>
  `;
  document.body.appendChild(b);

  document.getElementById('zBannerInstall').addEventListener('click', () => {
    zTriggerInstall();
  });
  document.getElementById('zBannerLater').addEventListener('click', () => {
    ZStorage.set('z_banner_dismissed', String(Date.now()));
    b.remove();
  });
  document.getElementById('zBannerClose').addEventListener('click', () => {
    ZStorage.set('z_banner_dismissed', String(Date.now()));
    b.remove();
  });
}

// ============================================================
// COMPONENT 3: INSTALL TRIGGER (native prompt or fallback modal)
// ============================================================
async function zTriggerInstall() {
  // Case 1: Chrome prompt ready
  if (_zInstallPrompt) {
    try {
      _zInstallPrompt.prompt();
      const { outcome } = await _zInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        ZStorage.set('z_app_installed', 'true');
        zHideAllInstallUI();
      }
      _zInstallPrompt = null;
    } catch(e) {
      zShowInstallModal();
    }
    return;
  }

  // Case 2: Prompt not ready — show instructions modal
  zShowInstallModal();
}

// ============================================================
// COMPONENT 4: MANUAL INSTALL INSTRUCTIONS MODAL
// ============================================================
function zShowInstallModal() {
  if (document.getElementById('zInstallModal')) return;

  const m = document.createElement('div');
  m.id = 'zInstallModal';
  m.className = 'fixed inset-0 z-[9500] bg-black/70 flex items-center justify-center p-4';
  m.style.animation = 'zFadeIn 0.3s ease-out';

  m.innerHTML = `
    <style>
      @keyframes zFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes zPop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    </style>
    <div class="bg-white rounded-2xl max-w-sm w-full p-6" style="animation: zPop 0.3s ease-out;">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black">Z</div>
        <div>
          <p class="font-black text-base text-slate-900">Install Zorvex</p>
          <p class="text-[11px] text-slate-500">Add to home screen</p>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
        <p class="text-[11px] text-blue-800 mb-2"><b>Follow these steps:</b></p>
        <ol class="text-[11px] text-blue-800 space-y-1.5">
          <li><b>1.</b> Tap the Chrome menu (⋮) at the top-right</li>
          <li><b>2.</b> Select <b>"Install app"</b> or <b>"Add to Home screen"</b></li>
          <li><b>3.</b> Tap <b>"Install"</b></li>
        </ol>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
        <p class="text-[11px] text-amber-800">
          <i class="fa-solid fa-lightbulb"></i> <b>Tip:</b> Don't see the option? Wait 5 minutes and try the Install button again — Chrome often needs a few visits.
        </p>
      </div>

      <button id="zInstallModalClose" class="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs">Got it</button>
    </div>
  `;
  document.body.appendChild(m);

  document.getElementById('zInstallModalClose').addEventListener('click', () => m.remove());
  m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
}

// ============================================================
// HIDE ALL INSTALL UI (when installed)
// ============================================================
function zHideAllInstallUI() {
  ['zinstallWrap','zWelcomeBanner','zInstallModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

// ============================================================
// PROFESSION SWITCH (Seller on customer page)
// ============================================================
function zInjectProfessionSwitch() {
  if (Z_PAGE !== 'customer') return;
  if (document.getElementById('zprofSwitch')) return;

  supabaseClient.auth.getSession().then(async ({ data }) => {
    const u = data?.session?.user;
    if (!u) return;
    const { data: prof } = await supabaseClient.from('profiles').select('role').eq('id', u.id).single();
    if (!prof) return;
    if (prof.role !== 'seller' && !Z_ADMIN_ROLES.includes(prof.role)) return;

    const profileBtn = document.getElementById('profileBtn');
    if (!profileBtn || !profileBtn.parentElement) return;
    if (document.getElementById('zprofSwitch')) return;

    const b = document.createElement('button');
    b.id = 'zprofSwitch';
    b.className = 'text-xs font-bold bg-emerald-600 text-white px-2.5 py-2 rounded-xl ml-1';
    b.innerHTML = '<i class="fa-solid fa-store"></i> <span class="hidden sm:inline">Seller</span>';
    b.addEventListener('click', () => { window.location.href = 'seller.html'; });
    profileBtn.parentElement.appendChild(b);
  });
}

supabaseClient.auth.onAuthStateChange(() => {
  const existing = document.getElementById('zprofSwitch');
  if (existing) existing.remove();
  setTimeout(zInjectProfessionSwitch, 800);
});

// ============================================================
// ADMIN HEADER LINKS (Seller link only — Customer button removed)
// ============================================================
function zInjectAdminLinks() {
  if (Z_PAGE !== 'admin') return;
  if (document.getElementById('zadminLinks')) return;

  const candidates = document.querySelectorAll('header .ml-auto, header .flex.items-center.gap-2');
  let target = null;
  for (const c of candidates) {
    if (c.querySelector('a[href*="index"]') || c.querySelector('a[target="_blank"]')) {
      target = c;
      break;
    }
  }
  if (!target) return;

  const w = document.createElement('div');
  w.id = 'zadminLinks';
  w.className = 'flex items-center gap-1';
  w.innerHTML = `
    <a href="seller.html" target="_blank" class="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-2 rounded-xl">
      <i class="fa-solid fa-store"></i> <span class="hidden sm:inline">Seller</span>
    </a>
  `;
  target.insertBefore(w, target.firstChild);
    }
// ============================================================
// MONITORING NOTICE (strict banner for customer + seller)
// ============================================================
function zInjectMonitoringNotice() {
  if (document.getElementById('zmonitorNotice')) return;
  if (Z_PAGE === 'admin') return;

  const n = document.createElement('div');
  n.id = 'zmonitorNotice';
  n.className = 'fixed bottom-0 left-0 right-0 z-[8000] bg-slate-900/95 backdrop-blur text-white text-[10px] text-center py-1.5 px-3 font-bold tracking-wide';
  n.style.paddingBottom = 'calc(6px + env(safe-area-inset-bottom, 0px))';
  n.innerHTML = '<i class="fa-solid fa-shield-halved text-amber-400"></i> CUSTOMER &amp; SELLER ACTIVITY IS MONITORED 24/7 BY AUTHORITY — STRICTLY ENFORCED';
  document.body.appendChild(n);
}

// ============================================================
// HIDE NETLIFY BADGE (free, CSS + observer)
// ============================================================
function zHideNetlifyBadge() {
  if (document.getElementById('zhideNetlify')) return;
  const style = document.createElement('style');
  style.id = 'zhideNetlify';
  style.textContent = `
    a[href*="netlify.com"][target="_blank"],
    #netlify-badge,
    .netlify-badge,
    div[data-netlify-badge] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);

  const cleanup = () => {
    document.querySelectorAll('a[href*="netlify.com"], [id*="netlify"], [class*="netlify"]').forEach(el => {
      const txt = (el.textContent || '').toLowerCase();
      if (txt.includes('powered by netlify') || txt.includes('netlify')) {
        el.style.display = 'none';
      }
    });
  };
  cleanup();
  setInterval(cleanup, 4000);
}

// ============================================================
// ADMIN SIDEBAR FIX (mobile scroll)
// ============================================================
function zFixAdminSidebar() {
  if (Z_PAGE !== 'admin') return;
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  sb.style.height = 'calc(100dvh - 57px)';
  sb.style.paddingBottom = '120px';
  sb.style.overflowY = 'auto';
  sb.style.webkitOverflowScrolling = 'touch';
}

// ============================================================
// NOTRANSLATE ENFORCEMENT (product titles, search, prices)
// ============================================================
function zEnforceNoTranslate() {
  const selectors = [
    '#productGrid .line-clamp-2',
    '#pTitle',
    '#productsList .truncate',
    '#resellList .truncate',
    '#ordersList .truncate',
    '#myReviewsList .truncate',
    '#teamList .truncate',
    '#customersList .truncate',
    '#sellerOrdersList .truncate',
    '#recentOrdersList .font-bold',
    '#searchInput',
    '#searchInputMobile',
    '#productSearch',
    '#resellSearch',
    '#teamSearch',
    '#customerSearch',
    '#cartCouponInput'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  document.querySelectorAll('[id*="order_code"], [id*="barcode"], [id*="sku"], [class*="font-mono"]').forEach(el => {
    el.classList.add('notranslate');
  });

  document.querySelectorAll('.font-black, .font-bold').forEach(el => {
    if (el.children.length === 0 && el.textContent && el.textContent.includes('Zorvex')) {
      el.classList.add('notranslate');
    }
  });
}

// ============================================================
// TRACKING SYSTEM (IP, Device, Sessions, Visits, Clicks)
// ============================================================
const ZTrack = {
  ip: null,
  device: null,
  userAgent: navigator.userAgent,
  sessionId: null,
  visitId: null,
  visitStart: null,
  lastClick: 0
};

function zGetDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown', os = 'Unknown';
  if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Opera')) browser = 'Opera';

  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  return browser + ' on ' + os + ' (' + (mobile ? 'Mobile' : 'Desktop') + ')';
}

async function zFetchIP() {
  const cached = ZStorage.get('z_ip', null);
  const cachedAt = ZStorage.get('z_ip_at', null);
  if (cached && cachedAt && (Date.now() - parseInt(cachedAt)) < 3600000) {
    ZTrack.ip = cached;
    return cached;
  }
  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    if (!res.ok) throw new Error('fail');
    const data = await res.json();
    if (data.ip) {
      ZTrack.ip = data.ip;
      ZStorage.set('z_ip', data.ip);
      ZStorage.set('z_ip_at', String(Date.now()));
      return data.ip;
    }
  } catch(e) {}
  return null;
}

async function zCreateSession() {
  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user;
  if (!user) return;

  ZTrack.device = zGetDeviceInfo();
  await zFetchIP();

  try {
    const { data: s } = await supabaseClient.from('user_sessions').insert({
      user_id: user.id,
      ip_address: ZTrack.ip,
      device_info: ZTrack.device,
      user_agent: ZTrack.userAgent,
      page_context: Z_PAGE
    }).select().single();
    if (s) {
      ZTrack.sessionId = s.id;
      ZStorage.set('z_session_id', s.id);
    }
  } catch(e) {}

  try {
    await supabaseClient.from('profiles').update({
      last_ip: ZTrack.ip,
      last_device: ZTrack.device,
      last_seen_at: new Date().toISOString(),
      user_agent: ZTrack.userAgent,
      last_login_at: new Date().toISOString()
    }).eq('id', user.id);
  } catch(e) {}
}

async function zTrackPageVisit() {
  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user;

  ZTrack.visitStart = Date.now();
  const pageName = window.location.pathname + (window.location.hash || '/');

  try {
    const { data: v } = await supabaseClient.from('page_visits').insert({
      user_id: user?.id || null,
      page: pageName || '/',
      referrer: document.referrer || null,
      device_info: ZTrack.device || zGetDeviceInfo(),
      ip_address: ZTrack.ip
    }).select().single();
    if (v) ZTrack.visitId = v.id;
  } catch(e) {}

  const updateVisit = () => {
    if (!ZTrack.visitId || !ZTrack.visitStart) return;
    const dur = Math.round((Date.now() - ZTrack.visitStart) / 1000);
    try {
      supabaseClient.from('page_visits').update({
        left_at: new Date().toISOString(),
        duration_seconds: dur
      }).eq('id', ZTrack.visitId).then(() => {});
    } catch(e) {}
    if (ZTrack.sessionId) {
      try {
        supabaseClient.from('user_sessions').update({
          ended_at: new Date().toISOString(),
          duration_seconds: dur
        }).eq('id', ZTrack.sessionId).then(() => {});
      } catch(e) {}
    }
  };

  window.addEventListener('beforeunload', updateVisit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') updateVisit();
  });
}

async function zTrackClick(text, id) {
  const now = Date.now();
  if (now - ZTrack.lastClick < 500) return;
  ZTrack.lastClick = now;

  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user;
  try {
    await supabaseClient.from('click_events').insert({
      user_id: user?.id || null,
      element: (text || id || 'unknown').substring(0, 100),
      page: (window.location.pathname + window.location.hash).substring(0, 100)
    });
  } catch(e) {}
}

function zInitClickTracking() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a, [onclick]');
    if (!t) return;
    const label = (t.innerText || t.textContent || '').trim().substring(0, 50);
    const id = t.id || t.getAttribute('onclick') || '';
    if (!label && !id) return;
    zTrackClick(label, id);
  }, { passive: true });
  }
// ============================================================
// AUTO RE-TRANSLATE — dynamic content
// ============================================================
let _zLastTranslate = 0;

function zRetranslateDynamic() {
  if (Z_LANG === 'en') return;
  const now = Date.now();
  if (now - _zLastTranslate < 1500) return;
  _zLastTranslate = now;

  const c = zGetGTCombo();
  if (!c) return;
  try {
    c.value = '';
    const evt1 = document.createEvent('HTMLEvents');
    evt1.initEvent('change', true, true);
    c.dispatchEvent(evt1);
    setTimeout(() => {
      c.value = Z_LANG;
      const evt2 = document.createEvent('HTMLEvents');
      evt2.initEvent('change', true, true);
      c.dispatchEvent(evt2);
    }, 100);
  } catch(e) {}
  setTimeout(zEnforceNoTranslate, 500);
}

function zHookRenderFns() {
  const fns = [
    'renderProducts','renderCart','openProduct','openCheckout',
    'renderProductsList','renderResellList','renderOrdersList',
    'renderSellerOrdersList','renderCustomers','renderTeam',
    'loadProducts','renderReviews','renderCartCount'
  ];
  fns.forEach(fn => {
    if (typeof window[fn] === 'function' && !window['_zHooked_' + fn]) {
      const orig = window[fn];
      window[fn] = function() {
        const r = orig.apply(this, arguments);
        setTimeout(() => {
          zEnforceNoTranslate();
          if (Z_LANG !== 'en') zRetranslateDynamic();
        }, 400);
        return r;
      };
      window['_zHooked_' + fn] = true;
    }
  });
}

// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================
function zRegisterSW() {
  if (!('serviceWorker' in navigator)) return;
  const proto = window.location.protocol;
  const host = window.location.hostname;
  if (proto !== 'https:' && host !== 'localhost' && host !== '127.0.0.1') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
      .then((reg) => {
        console.log('✓ Service Worker registered:', reg.scope);
        setInterval(() => reg.update().catch(() => {}), 3600000);
      })
      .catch((err) => {
        console.log('SW not available yet (sw.js missing):', err.message);
      });
  });
}

// ============================================================
// ADMIN OVERRIDE FOR SELLER PAGE (admin can view seller panel)
// ============================================================
if (Z_PAGE === 'seller') {
  const zPatchSellerDenied = () => {
    const denied = document.getElementById('deniedScreen');
    if (!denied || denied.classList.contains('hidden')) return;

    supabaseClient.auth.getSession().then(async ({ data }) => {
      const u = data?.session?.user;
      if (!u) return;

      const { data: p } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single();
      if (!p) return;

      if (Z_ADMIN_ROLES.includes(p.role)) {
        // Force-hide denied screen and show dashboard
        denied.classList.add('hidden');

        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) loginScreen.classList.add('hidden');

        const dash = document.getElementById('dashboard');
        if (dash) dash.classList.remove('hidden');

        // Update local display
        try {
          if (typeof window.updateSellerUI === 'function') {
            // Patch local sellerProfile by setting header info directly
            const nameEl = document.getElementById('sellerName');
            const menuNameEl = document.getElementById('sellerMenuName');
            const menuEmailEl = document.getElementById('sellerMenuEmail');
            const welcomeEl = document.getElementById('welcomeName');
            const shopBadge = document.getElementById('shopBadge');
            const label = p.shop_name || p.full_name || (u.email || '').split('@')[0] || 'Seller';
            if (nameEl) nameEl.innerText = label;
            if (menuNameEl) menuNameEl.innerText = label;
            if (menuEmailEl) menuEmailEl.innerText = u.email || '';
            if (welcomeEl) welcomeEl.innerText = label;
            if (shopBadge) shopBadge.innerText = p.shop_name || 'Admin Test';
          }
          if (typeof window.loadDashboardStats === 'function') window.loadDashboardStats();
          if (typeof window.loadCategories === 'function') window.loadCategories();
        } catch(e) {}
      }
    });
  };
  setInterval(zPatchSellerDenied, 500);
}

// ============================================================
// INIT
// ============================================================
function zInit() {
  // Core injections
  zInjectGT();
  zInjectLangDropdown();
  zHideNetlifyBadge();
  zEnforceNoTranslate();
  zInjectMonitoringNotice();

  // Install UI
  zShowInstallButton();
  setTimeout(zShowFirstVisitBanner, 4000);

  // Tracking
  zCreateSession().then(() => zTrackPageVisit());
  zInitClickTracking();

  // Hook render functions
  zHookRenderFns();
  setTimeout(zHookRenderFns, 2000);
  setTimeout(zHookRenderFns, 5000);
  setInterval(zHookRenderFns, 4000);

  // Mutation observer
  const observer = new MutationObserver(() => {
    clearTimeout(window._zObsTimer);
    window._zObsTimer = setTimeout(() => {
      zEnforceNoTranslate();
      if (Z_LANG !== 'en') zRetranslateDynamic();
    }, 500);
  });
  setTimeout(() => observer.observe(document.body, { childList: true, subtree: true }), 2000);

  // Page-specific delayed injections
  setTimeout(() => {
    zInjectAdminLinks();
    zFixAdminSidebar();
  }, 800);

  setTimeout(() => {
    zInjectProfessionSwitch();
  }, 1200);

  // Apply saved language
  setTimeout(() => {
    if (Z_LANG && Z_LANG !== 'en') zApplyLanguage(Z_LANG);
  }, 2500);

  // Register SW
  zRegisterSW();

  console.log('✓ Zorvex universal config v5 loaded on', Z_PAGE);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', zInit);
} else {
  zInit();
}

// ============================================================
// GLOBAL EXPORTS
// ============================================================
window.zorvex = {
  page: Z_PAGE,
  lang: () => Z_LANG,
  setLang: zApplyLanguage,
  track: ZTrack,
  reload: zInit,
  showInstallModal: zShowInstallModal,
  isInstalled: zIsInstalled
};
// ============================================================
// ADMIN LIVE MONITORING DASHBOARD
// ============================================================
if (Z_PAGE === 'admin') {

  function zInjectMonitoringUI() {
    // Sidebar button
    const sidebar = document.querySelector('#sidebar nav');
    if (sidebar && !document.getElementById('zmonitorSidebarBtn')) {
      const header = document.createElement('p');
      header.className = 'text-[10px] font-bold text-slate-400 uppercase px-3 pt-4 pb-1';
      header.id = 'zmonitorHeader';
      header.innerText = 'Monitoring';

      const btn = document.createElement('button');
      btn.id = 'zmonitorSidebarBtn';
      btn.className = 'nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 text-slate-700';
      btn.innerHTML = '<i class="fa-solid fa-shield-halved w-4 text-rose-600"></i> Live Monitoring';
      btn.addEventListener('click', () => window.zShowMonitoring());

      sidebar.appendChild(header);
      sidebar.appendChild(btn);
    }

    // Main page
    const main = document.querySelector('main');
    if (main && !document.getElementById('page-monitoring')) {
      const page = document.createElement('div');
      page.id = 'page-monitoring';
      page.className = 'page hidden fade-in';
      page.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-black mb-1">Live Monitoring</h1>
            <p class="text-sm text-slate-500">Real-time customer &amp; seller activity</p>
          </div>
          <button onclick="window.zLoadMonitoring()" class="text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl">
            <i class="fa-solid fa-rotate"></i> Refresh
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <i class="fa-solid fa-circle text-emerald-500 text-[10px]"></i>
            <p id="zmOnline" class="text-2xl font-black mt-2">—</p>
            <p class="text-xs text-slate-500">Online (15m)</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <i class="fa-solid fa-eye text-blue-600"></i>
            <p id="zmVisits" class="text-2xl font-black mt-2">—</p>
            <p class="text-xs text-slate-500">Visits Today</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <i class="fa-solid fa-mouse-pointer text-purple-600"></i>
            <p id="zmClicks" class="text-2xl font-black mt-2">—</p>
            <p class="text-xs text-slate-500">Clicks Today</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200">
            <i class="fa-solid fa-store text-amber-600"></i>
            <p id="zmSellers" class="text-2xl font-black mt-2">—</p>
            <p class="text-xs text-slate-500">Total Sellers</p>
          </div>
        </div>

        <div class="flex gap-1 mb-3 overflow-x-auto pb-1">
          <button data-zmtab="online" class="zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-rose-600 text-white">🟢 Online</button>
          <button data-zmtab="sessions" class="zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white border border-slate-200">Sessions</button>
          <button data-zmtab="visits" class="zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white border border-slate-200">Visits</button>
          <button data-zmtab="clicks" class="zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white border border-slate-200">Clicks</button>
          <button data-zmtab="sellers" class="zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white border border-slate-200">Sellers</button>
        </div>

        <div id="zMonitorContent" class="space-y-3">
          <p class="text-center text-slate-400 py-8 text-sm">Loading…</p>
        </div>
      `;
      main.appendChild(page);

      page.querySelectorAll('.zmtab').forEach(t => {
        t.addEventListener('click', () => {
          page.querySelectorAll('.zmtab').forEach(x => {
            x.className = 'zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white border border-slate-200';
          });
          t.className = 'zmtab px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-rose-600 text-white';
          window.zLoadMonitoringTab(t.dataset.zmtab);
        });
      });
    }
  }

  window.zShowMonitoring = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById('page-monitoring');
    if (target) target.classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => {
      const on = b.id === 'zmonitorSidebarBtn';
      b.className = on
        ? 'nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white'
        : 'nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 text-slate-700';
    });
    if (window.innerWidth < 768) {
      const sb = document.getElementById('sidebar');
      if (sb && !sb.classList.contains('hidden') && typeof window.toggleSidebar === 'function') window.toggleSidebar();
    }
    window.zLoadMonitoring();
  };

  window.zLoadMonitoring = async function() {
    const since15m = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const sinceToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

    try {
      const { data: online } = await supabaseClient.from('user_sessions').select('user_id').gte('started_at', since15m);
      document.getElementById('zmOnline').innerText = new Set((online || []).map(s => s.user_id)).size;

      const { count: vc } = await supabaseClient.from('page_visits').select('id', { count: 'exact', head: true }).gte('entered_at', sinceToday);
      document.getElementById('zmVisits').innerText = vc || 0;

      const { count: cc } = await supabaseClient.from('click_events').select('id', { count: 'exact', head: true }).gte('created_at', sinceToday);
      document.getElementById('zmClicks').innerText = cc || 0;

      const { count: sc } = await supabaseClient.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'seller');
      document.getElementById('zmSellers').innerText = sc || 0;
    } catch(e) {}

    window.zLoadMonitoringTab('online');
  };

  window.zLoadMonitoringTab = async function(tab) {
    const box = document.getElementById('zMonitorContent');
    box.innerHTML = '<p class="text-center text-slate-400 py-8 text-sm">Loading…</p>';

    try {
      if (tab === 'online') {
        const since15m = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data: sessions } = await supabaseClient.from('user_sessions').select('*')
          .gte('started_at', since15m).order('started_at', { ascending: false }).limit(50);

        if (!sessions || sessions.length === 0) {
          box.innerHTML = '<p class="text-center text-slate-400 py-8 text-sm">No one online in the last 15 minutes.</p>';
          return;
        }

        const ids = [...new Set(sessions.map(s => s.user_id).filter(Boolean))];
        const { data: profiles } = await supabaseClient.from('profiles').select('id, full_name, role, profile_pic_url').in('id', ids);
        const pMap = {};
        (profiles || []).forEach(p => pMap[p.id] = p);

        box.innerHTML = sessions.map(s => {
          const p = pMap[s.user_id] || {};
          const name = p.full_name || 'Unknown';
          const role = p.role || 'customer';
          const roleColor = { seller: 'bg-orange-100 text-orange-700', customer: 'bg-slate-100 text-slate-700', super_admin: 'bg-purple-100 text-purple-700', admin: 'bg-blue-100 text-blue-700' }[role] || 'bg-slate-100';
          const online = new Date(s.started_at) > new Date(Date.now() - 15 * 60 * 1000);
          return `<div class="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-3">
            ${p.profile_pic_url ? `<img src="${esc(p.profile_pic_url)}" class="w-10 h-10 rounded-full object-cover">` : `<div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-600">${(name[0]||'?').toUpperCase()}</div>`}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 ${online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'} rounded-full"></span>
                <p class="font-bold text-sm truncate">${esc(name)}</p>
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${roleColor} uppercase">${esc(role)}</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5">📱 ${esc(s.device_info || '—')} · 🌐 ${esc(s.ip_address || '—')}</p>
              <p class="text-[10px] text-slate-400">Page: ${esc(s.page_context || '—')} · ${new Date(s.started_at).toLocaleTimeString()}</p>
            </div>
          </div>`;
        }).join('');
      }

      else if (tab === 'sessions') {
        const { data: sessions } = await supabaseClient.from('user_sessions').select('*')
          .order('started_at', { ascending: false }).limit(50);

        if (!sessions || sessions.length === 0) {
          box.innerHTML = '<p class="text-center text-slate-400 py-8 text-sm">No sessions yet.</p>';
          return;
        }
        const ids = [...new Set(sessions.map(s => s.user_id).filter(Boolean))];
        const { data: profiles } = await supabaseClient.from('profiles').select('id, full_name, role').in('id', ids);
        const pMap = {};
        (profiles || []).forEach(p => pMap[p.id] = p);

        box.innerHTML = sessions.map(s => {
          const p = pMap[s.user_id] || {};
          const dur = s.duration_seconds ? `${Math.floor(s.duration_seconds/60)}m ${s.duration_seconds%60}s` : 'Active';
          return `<div class="bg-white rounded-2xl border border-slate-200 p-3">
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0">
                <p class="font-bold text-sm">${esc(p.full_name || 'Unknown')} <span class="text-[9px] text-slate-400 uppercase">(${esc(p.role||'customer')})</span></p>
                <p class="text-[10px] text-slate-500 mt-0.5">📱 ${esc(s.device_info || '—')}</p>
                <p class="text-[10px] text-slate-500">🌐 ${esc(s.ip_address || '—')} · ${esc(s.page_context || '—')}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] font-bold text-blue-600">${dur}</p>
                <p class="text-[9px] text-slate-400">${new Date(s.started_at).toLocaleString()}</p>
              </div>
            </div>
          </div>`;
        }).join('');
      }

      else if (tab === 'visits') {
        const { data: visits } = await supabaseClient.from('page_visits').select('*')
          .order('entered_at', { ascending: false }).limit(50);

        if (!visits || visits.length === 0) {
          box.innerHTML = '<p class="text-center text-slate-400 py-8 text-sm">No page visits yet.</p>';
          return;
        }
        const ids = [...new Set(visits.map(v => v.user_id).filter(Boolean))];
        const { data: profiles } = await supabaseClient.from('profiles').select('id, full_name, role').in('id', ids);
        const pMap = {};
        (profiles || []).forEach(p => pMap[p.id] = p);

        box.innerHTML = visits.map(v => {
          const p = pMap[v.user_id] || {};
          const dur = v.duration_seconds ? `${v.duration_seconds}s` : '—';
          return `<div class="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-eye text-blue-600 text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-xs truncate">${esc(p.full_name || 'Guest')} <span class="text-[9px] text-slate-400">(${esc(p.role||'guest')})</span></p>
              <p class="text-[10px] text-slate-500 truncate">${esc(v.page)}</p>
              <p class="text-[9px] text-slate-400">${new Date(v.entered_at).toLocaleString()}</p>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 shrink-0">${dur}</span>
          </div>`;
        }).join('');
      }

      else if (tab === 'clicks') {
        const { data: clicks } = await supabaseClient.from('click_events').select('*')
          .order('created_at', { ascending: false }).limit(80);

        if (!clicks || clicks.length === 0) {
          box.innerHTML = '<p class="text-center text-slate-400 py-8 text-sm">No click events yet.</p>';
          return;
        }
        const ids = [...new Set(clicks.map(c => c.user_id).filter(Boolean))];
        const { data: profiles } = await supabaseClient.from('profiles').select('id, full_name').in('id', ids);
        const pMap = {};
        (profiles || []).forEach(p => pMap[p.id] = p);

        box.innerHTML = clicks.map(c => {
          const p = pMap[c.user_id] || {};
          return `<div class="bg-white rounded-xl border border-slate-200 p-2.5 flex items-center gap-2 text-xs">
            <i class="fa-solid fa-mouse-pointer text-purple-500 text-[10px]"></i>
            <span class="font-bold truncate flex-1">${esc(c.element || '—')}</span>
            <span class="text-[9px] text-slate-400 truncate">${esc(p.full_name || 'Guest')}</span>
            <span class="text-[9px] text-slate-400 shrink-0">${new Date(c.created_at).toLocaleTimeString()}</span>
          </div>`;
        }).join('');
      }

      else if (tab === 'sellers') {
        const { data: products } = await supabaseClient.from('products')
          .select('id, title, seller_id, product_type, price_usd, is_active, image_url, created_at')
          .not('seller_id', 'is', null)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!products || products.length === 0) {
          box.innerHTML = '<p class="text-center text-slate-400 py-8 text-sm">No seller products yet.</p>';
          return;
        }
        const ids = [...new Set(products.map(p => p.seller_id).filter(Boolean))];
        const { data: profiles } = await supabaseClient.from('profiles').select('id, full_name, shop_name').in('id', ids);
        const pMap = {};
        (profiles || []).forEach(p => pMap[p.id] = p);

        box.innerHTML = products.map(p => {
          const s = pMap[p.seller_id] || {};
          const typeColor = p.product_type === 'admin_resell' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
          const typeLabel = p.product_type === 'admin_resell' ? 'RESELL' : 'OWN';
          return `<div class="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-3">
            <img src="${esc(p.image_url || 'https://placehold.co/80x80')}" class="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0">
            <div class="flex-1 min-w-0">
              <p class="font-bold text-xs truncate">${esc(p.title)}</p>
              <p class="text-[10px] text-slate-500 truncate">👤 ${esc(s.shop_name || s.full_name || 'Unknown Seller')}</p>
              <div class="flex gap-1.5 mt-0.5">
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${typeColor}">${typeLabel}</span>
                <span class="text-[9px] text-slate-500">$${Number(p.price_usd).toFixed(2)}</span>
                <span class="text-[9px] ${p.is_active ? 'text-emerald-600' : 'text-slate-400'}">${p.is_active ? 'ACTIVE' : 'HIDDEN'}</span>
              </div>
            </div>
          </div>`;
        }).join('');
      }
    } catch(e) {
      box.innerHTML = '<p class="text-center text-red-500 py-8 text-sm">Error: ' + esc(e.message || e) + '</p>';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(zInjectMonitoringUI, 1500);
    setTimeout(zInjectMonitoringUI, 4000);
  });
    }

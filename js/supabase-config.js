// ============================================================
// Zorvex Universal Config v3 (FINAL)
// ============================================================
const SUPABASE_URL = "https://mebsxocivxrcfkzpbgii.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYnN4b2NpdnhyY2ZrenBiZ2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDgxNzcsImV4cCI6MjEwNTcyNDE3N30.7euPLgf0RNqyWpqct7cT61XRM1sSPdfpYuncV2z8Dc0";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Z_PAGE = (() => {
  const p = window.location.pathname.toLowerCase();
  if (p.includes('admin')) return 'admin';
  if (p.includes('seller')) return 'seller';
  return 'customer';
})();

const ZStorage = {
  get(k, def) { try { return localStorage.getItem(k) || def; } catch(e) { return def; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch(e) {} }
};

// Language System
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
      pageLanguage: 'en', includedLanguages: Z_LANGS.map(l => l.code).join(','),
      autoDisplay: false, layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
    window._zGTReady = true;
  } catch(e) {}
};

function zInjectGT() {
  if (!document.getElementById('google_translate_element')) {
    const d = document.createElement('div');
    d.id = 'google_translate_element';
    d.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;height:0;';
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

function zApplyLanguage(lang, retry) {
  retry = retry || 0;
  Z_LANG = lang;
  ZStorage.set('zorvex_lang', lang);
  const c = document.querySelector('.goog-te-combo');
  if (c) {
    c.value = lang;
    c.dispatchEvent(new Event('change'));
    zUpdateLangBtn();
    setTimeout(zEnforceNoTranslate, 300);
  } else if (retry < 20) setTimeout(() => zApplyLanguage(lang, retry + 1), 500);
}

function zUpdateLangBtn() {
  const b = document.getElementById('zlangBtn');
  if (!b) return;
  const l = Z_LANGS.find(x => x.code === Z_LANG) || Z_LANGS[0];
  b.innerHTML = `${l.flag} <span class="hidden sm:inline">${l.code.toUpperCase()}</span>`;
}

function zInjectLangDropdown() {
  if (document.getElementById('zlangWrap')) return;
  const w = document.createElement('div');
  w.id = 'zlangWrap';
  w.className = 'fixed top-11 right-3 z-[9000]';
  w.innerHTML = `<button id="zlangBtn" class="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">🌐 EN</button>
    <div id="zlangMenu" class="hidden absolute right-0 top-11 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 max-h-72 overflow-y-auto">
      ${Z_LANGS.map(l => `<button data-zlang="${l.code}" class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"><span>${l.flag}</span><span>${l.name}</span></button>`).join('')}
    </div>`;
  document.body.appendChild(w);
  zUpdateLangBtn();
  document.getElementById('zlangBtn').addEventListener('click', e => { e.stopPropagation(); document.getElementById('zlangMenu').classList.toggle('hidden'); });
  w.querySelectorAll('[data-zlang]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); zApplyLanguage(b.dataset.zlang); document.getElementById('zlangMenu').classList.add('hidden'); }));
  document.addEventListener('click', e => { if (!w.contains(e.target)) document.getElementById('zlangMenu').classList.add('hidden'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('zlangMenu').classList.add('hidden'); });
  const old = document.getElementById('langBtn');
  if (old) old.style.display = 'none';
}

window.addEventListener('storage', e => {
  if (e.key === 'zorvex_lang' && e.newValue && e.newValue !== Z_LANG) zApplyLanguage(e.newValue);
});
// ============================================================
// INSTALL APP BUTTON (Chrome in-built, no 3-dots)
// ============================================================
let _zInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _zInstallPrompt = e;
  zInjectInstallBtn();
});

function zInjectInstallBtn() {
  if (document.getElementById('zinstallWrap')) return;
  if (!_zInstallPrompt) return;
  const w = document.createElement('div');
  w.id = 'zinstallWrap';
  w.className = 'fixed bottom-20 right-4 z-[9000]';
  w.innerHTML = `<button id="zinstallBtn" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2"><i class="fa-solid fa-download"></i> Install Zorvex</button>`;
  document.body.appendChild(w);
  document.getElementById('zinstallBtn').addEventListener('click', async () => {
    if (!_zInstallPrompt) return;
    _zInstallPrompt.prompt();
    const { outcome } = await _zInstallPrompt.userChoice;
    if (outcome === 'accepted') { w.remove(); _zInstallPrompt = null; }
  });
}

window.addEventListener('appinstalled', () => {
  const w = document.getElementById('zinstallWrap');
  if (w) w.remove();
  _zInstallPrompt = null;
});

// ============================================================
// PROFESSION SWITCH (Seller only — on customer page)
// ============================================================
function zInjectProfessionSwitch() {
  if (Z_PAGE !== 'customer') return;
  if (document.getElementById('zprofSwitch')) return;

  supabaseClient.auth.getSession().then(async ({ data }) => {
    const u = data?.session?.user;
    if (!u) return;
    const { data: prof } = await supabaseClient.from('profiles').select('role').eq('id', u.id).single();
    if (!prof || prof.role !== 'seller') return;

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

// Re-check on auth change
supabaseClient.auth.onAuthStateChange(() => {
  const existing = document.getElementById('zprofSwitch');
  if (existing) existing.remove();
  setTimeout(zInjectProfessionSwitch, 800);
});

// ============================================================
// ADMIN HEADER LINKS (Customer + Seller switch)
// ============================================================
function zInjectAdminLinks() {
  if (Z_PAGE !== 'admin') return;
  if (document.getElementById('zadminLinks')) return;

  // Find header's right side (where View Store button is)
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
    <a href="index.html" target="_blank" class="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-2 rounded-xl">
      <i class="fa-solid fa-user"></i> <span class="hidden sm:inline">Customer</span>
    </a>
    <a href="seller.html" target="_blank" class="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-2 rounded-xl">
      <i class="fa-solid fa-store"></i> <span class="hidden sm:inline">Seller</span>
    </a>
  `;
  target.insertBefore(w, target.firstChild);
}
// ============================================================
// MONITORING NOTICE (Strict banner for customer + seller)
// ============================================================
function zInjectMonitoringNotice() {
  if (document.getElementById('zmonitorNotice')) return;
  if (Z_PAGE === 'admin') return; // Admin needs no warning

  const n = document.createElement('div');
  n.id = 'zmonitorNotice';
  n.className = 'fixed bottom-0 left-0 right-0 z-[8000] bg-slate-900/95 backdrop-blur text-white text-[10px] text-center py-1.5 px-3 font-bold tracking-wide';
  n.style.paddingBottom = 'calc(6px + env(safe-area-inset-bottom, 0px))';
  n.innerHTML = '<i class="fa-solid fa-shield-halved text-amber-400"></i> CUSTOMER & SELLER ACTIVITY IS MONITORED 24/7 BY AUTHORITY — STRICTLY ENFORCED';
  document.body.appendChild(n);
}

// ============================================================
// HIDE NETLIFY BADGE (free, CSS-based)
// ============================================================
function zHideNetlifyBadge() {
  const style = document.createElement('style');
  style.id = 'zhideNetlify';
  style.textContent = `
    a[href*="netlify.com"][target="_blank"],
    #netlify-badge,
    .netlify-badge,
    div[data-netlify-badge],
    iframe[src*="netlify"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);

  // Also remove dynamically-added badges
  const cleanup = () => {
    document.querySelectorAll('a[href*="netlify.com"], [id*="netlify"], [class*="netlify"]').forEach(el => {
      const txt = (el.textContent || '').toLowerCase();
      if (txt.includes('powered by netlify') || txt.includes('netlify')) {
        el.style.display = 'none';
      }
    });
  };
  cleanup();
  setInterval(cleanup, 3000);
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
// NOTRANSLATE ENFORCEMENT (product titles, search bars, prices)
// ============================================================
function zEnforceNoTranslate() {
  const selectors = [
    '#productGrid .line-clamp-2',
    '#pTitle', '#productsList .truncate', '#resellList .truncate',
    '#ordersList .truncate', '#myReviewsList .truncate',
    '#teamList .truncate', '#customersList .truncate',
    '#searchInput', '#searchInputMobile', '#productSearch', '#resellSearch',
    '#teamSearch', '#customerSearch', '#cartCouponInput'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  // Inputs, textareas, selects — never translate
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  // Zorvex brand
  document.querySelectorAll('.font-black, .font-bold').forEach(el => {
    if (el.children.length === 0 && el.textContent && el.textContent.includes('Zorvex')) {
      el.classList.add('notranslate');
    }
  });

  // Currency symbols, prices, order codes
  document.querySelectorAll('[id*="order_code"], [id*="barcode"], [id*="sku"], [class*="font-mono"]').forEach(el => {
    el.classList.add('notranslate');
  });
}

// ============================================================
// TRACKING SYSTEM (IP, Device, Sessions, Page Visits, Clicks)
// ============================================================
const ZTrack = {
  ip: null,
  device: null,
  userAgent: navigator.userAgent,
  sessionId: null,
  visitId: null,
  visitStart: null,
  lastClickTrack: 0
};

// Get device info from user agent
function zGetDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown', os = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';

  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  return `${browser} on ${os} (${isMobile ? 'Mobile' : 'Desktop'})`;
}

// Get IP from free API (cached 1 hour)
async function zFetchIP() {
  const cached = ZStorage.get('z_ip', null);
  const cachedAt = ZStorage.get('z_ip_at', null);
  if (cached && cachedAt && (Date.now() - parseInt(cachedAt)) < 3600000) {
    ZTrack.ip = cached;
    return cached;
  }
  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    if (!res.ok) throw new Error('IP fetch failed');
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

// Create session entry
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

  // Update profile tracking fields
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

// Track page visit (with duration)
async function zTrackPageVisit() {
  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user;

  ZTrack.visitStart = Date.now();
  const pageName = window.location.pathname + (window.location.hash || '');

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

  // Update duration on unload/visibility change
  const updateVisit = () => {
    if (!ZTrack.visitId || !ZTrack.visitStart) return;
    const dur = Math.round((Date.now() - ZTrack.visitStart) / 1000);
    try {
      supabaseClient.from('page_visits').update({
        left_at: new Date().toISOString(),
        duration_seconds: dur
      }).eq('id', ZTrack.visitId).then(() => {});
    } catch(e) {}
    // Also update session duration
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

// Track clicks (throttled)
async function zTrackClick(elementText, elementId) {
  const now = Date.now();
  if (now - ZTrack.lastClickTrack < 500) return; // Throttle 500ms
  ZTrack.lastClickTrack = now;

  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user;
  try {
    await supabaseClient.from('click_events').insert({
      user_id: user?.id || null,
      element: (elementText || elementId || 'unknown').substring(0, 100),
      page: (window.location.pathname + window.location.hash).substring(0, 100)
    });
  } catch(e) {}
}

// Global click listener
function zInitClickTracking() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, [onclick]');
    if (!target) return;
    const label = (target.innerText || target.textContent || '').trim().substring(0, 50);
    const id = target.id || target.getAttribute('onclick') || '';
    if (!label && !id) return;
    zTrackClick(label, id);
  }, { passive: true });
            }
// ============================================================
// AUTO RE-TRANSLATE — for dynamic content
// ============================================================
let _zLastTranslate = 0;

function zRetranslateDynamic() {
  if (Z_LANG === 'en') return;
  const now = Date.now();
  if (now - _zLastTranslate < 1500) return;
  _zLastTranslate = now;

  const c = document.querySelector('.goog-te-combo');
  if (!c) return;
  try {
    c.value = '';
    c.dispatchEvent(new Event('change'));
    setTimeout(() => {
      c.value = Z_LANG;
      c.dispatchEvent(new Event('change'));
    }, 100);
  } catch(e) {}
  setTimeout(zEnforceNoTranslate, 500);
}

// Hook into common render functions
function zHookRenderFns() {
  const fns = ['renderProducts','renderCart','openProduct','openCheckout','renderProductsList','renderResellList','renderOrdersList','renderSellerOrdersList','renderCustomers','renderTeam','loadProducts','renderReviews'];
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
// SERVICE WORKER REGISTRATION (ready for sw.js upload)
// ============================================================
function zRegisterSW() {
  if (!('serviceWorker' in navigator)) return;
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
      .then((reg) => {
        console.log('✓ SW registered:', reg.scope);
        // Check for updates every hour
        setInterval(() => reg.update().catch(() => {}), 3600000);
      })
      .catch((err) => {
        // Silent fail — sw.js may not exist yet, website still works
        console.log('SW not available (will work when uploaded):', err.message);
      });
  });
}

// ============================================================
// INIT — runs when DOM is ready
// ============================================================
function zInit() {
  // Core injections
  zInjectGT();
  zInjectLangDropdown();
  zHideNetlifyBadge();
  zEnforceNoTranslate();
  zInjectMonitoringNotice();

  // Start tracking
  zCreateSession().then(() => zTrackPageVisit());
  zInitClickTracking();

  // Hook render functions
  zHookRenderFns();
  setTimeout(zHookRenderFns, 2000);
  setTimeout(zHookRenderFns, 5000);
  setInterval(zHookRenderFns, 4000);

  // Dynamic content observer
  const observer = new MutationObserver(() => {
    clearTimeout(window._zObsTimer);
    window._zObsTimer = setTimeout(() => {
      zEnforceNoTranslate();
      if (Z_LANG !== 'en') zRetranslateDynamic();
    }, 500);
  });
  setTimeout(() => observer.observe(document.body, { childList: true, subtree: true }), 2000);

  // Page-specific (delayed to let page scripts load)
  setTimeout(() => {
    zInjectAdminLinks();
    zFixAdminSidebar();
  }, 800);

  setTimeout(() => {
    zInjectProfessionSwitch();
  }, 1200);

  // Install button fallback (in case beforeinstallprompt fired early)
  setTimeout(() => { if (_zInstallPrompt) zInjectInstallBtn(); }, 1500);

  // Apply saved language after Google Translate loads
  setTimeout(() => {
    if (Z_LANG && Z_LANG !== 'en') zApplyLanguage(Z_LANG);
  }, 2000);

  // Register service worker (works when sw.js is uploaded)
  zRegisterSW();
}

// Run when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', zInit);
} else {
  zInit();
}

// ============================================================
// GLOBAL EXPORTS (optional, for debugging)
// ============================================================
window.zorvex = {
  page: Z_PAGE,
  lang: () => Z_LANG,
  setLang: zApplyLanguage,
  track: ZTrack,
  reload: zInit
};

console.log('✓ Zorvex universal config loaded on', Z_PAGE);

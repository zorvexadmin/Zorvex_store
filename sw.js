// ============================================================
// Zorvex Service Worker v1.0.0 — Full Version
// Offline support + Smart caching + Fast reload
// ============================================================

const SW_VERSION = 'zorvex-v1.0.0';
const CACHE_STATIC = SW_VERSION + '-static';
const CACHE_RUNTIME = SW_VERSION + '-runtime';
const CACHE_IMAGES = SW_VERSION + '-images';

// Core files to precache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/admin.html',
  '/seller.html',
  '/js/supabase-config.js'
];

// Hostnames to NEVER cache (always live)
const SKIP_HOSTS = [
  'supabase.co',
  'google.com',
  'googleapis.com',
  'gstatic.com',
  'googletagmanager.com',
  'translate.google.com',
  'exchangerate.host',
  'ipify.org',
  'qrserver.com',
  'unsplash.com',
  'placehold.co',
  'cdn.jsdelivr.net',   // Tailwind/Supabase CDN — always fresh
  'cloudflare.com',     // Font Awesome CDN
  'tailwindcss.com'
];

// ============================================================
// INSTALL — precache core assets
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing', SW_VERSION);
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return Promise.all(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(err => console.log('[SW] Skip precache:', url, err.message))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ============================================================
// ACTIVATE — clean old caches
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating', SW_VERSION);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => !k.startsWith(SW_VERSION))
          .map(k => {
            console.log('[SW] Removing old cache:', k);
            return caches.delete(k);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ============================================================
// MESSAGE — skip waiting / version check
// ============================================================
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version: SW_VERSION });
    }
  }
});

// ============================================================
// FETCH — routing strategy
// ============================================================
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only GET requests
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch(e) { return; }

  // Skip non-http(s)
  if (!url.protocol.startsWith('http')) return;

  // Skip external services (always live)
  if (SKIP_HOSTS.some(h => url.hostname.includes(h))) return;

  // Skip chrome extensions, devtools
  if (url.pathname.startsWith('/__')) return;

  // IMAGE — cache-first
  if (req.destination === 'image') {
    event.respondWith(zCacheFirst(req, CACHE_IMAGES));
    return;
  }

  // FONT — cache-first (long-lived)
  if (req.destination === 'font') {
    event.respondWith(zCacheFirst(req, CACHE_STATIC));
    return;
  }

  // NAVIGATION — network-first with fallback
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(zNetworkFirst(req, CACHE_STATIC, true));
    return;
  }

  // STYLE / SCRIPT — network-first (same origin), cache-first (cross-origin)
  if (req.destination === 'style' || req.destination === 'script') {
    if (url.hostname === self.location.hostname) {
      event.respondWith(zNetworkFirst(req, CACHE_RUNTIME, false));
    } else {
      event.respondWith(zCacheFirst(req, CACHE_STATIC));
    }
    return;
  }

  // Everything else — network-first
  event.respondWith(zNetworkFirst(req, CACHE_RUNTIME, false));
});

// ============================================================
// STRATEGY: Cache-First (static assets + images)
// ============================================================
async function zCacheFirst(req, cacheName) {
  try {
    const cached = await caches.match(req);
    if (cached) {
      // Background update (stale-while-revalidate)
      fetch(req).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(cacheName).then(c => c.put(req, res.clone())).catch(() => {});
        }
      }).catch(() => {});
      return cached;
    }

    const res = await fetch(req);
    if (res && res.status === 200 && res.type !== 'opaque') {
      const clone = res.clone();
      caches.open(cacheName).then(c => c.put(req, clone)).catch(() => {});
    }
    return res;
  } catch (err) {
    const cached = await caches.match(req);
    if (cached) return cached;
    throw err;
  }
}

// ============================================================
// STRATEGY: Network-First (with 3.5s timeout + cache fallback)
// ============================================================
async function zNetworkFirst(req, cacheName, isHtml) {
  const TIMEOUT_MS = 3500;

  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS))
    ]);

    if (res && res.status === 200 && res.type !== 'opaque') {
      const clone = res.clone();
      caches.open(cacheName).then(c => c.put(req, clone)).catch(() => {});
    }
    return res;
  } catch (err) {
    // Cache fallback
    const cached = await caches.match(req);
    if (cached) return cached;

    // HTML — try offline page
    if (isHtml) {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
      const root = await caches.match('/');
      if (root) return root;
      return zOfflineResponse();
    }

    // Non-HTML — return 503
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// ============================================================
// OFFLINE PAGE (HTML response)
// ============================================================
function zOfflineResponse() {
  const html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<title>Offline — Zorvex</title>' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="theme-color" content="#2563eb">' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
    'background:#f8fafc;color:#334155;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}' +
    '.box{max-width:400px;text-align:center;background:white;padding:40px 24px;border-radius:24px;box-shadow:0 10px 40px rgba(0,0,0,0.08)}' +
    '.icon{width:80px;height:80px;background:#2563eb;border-radius:24px;display:flex;align-items:center;justify-content:center;' +
    'margin:0 auto 20px;font-size:36px;font-weight:900;color:white;box-shadow:0 8px 24px rgba(37,99,235,0.3)}' +
    'h1{font-size:24px;font-weight:900;margin-bottom:8px;color:#0f172a}' +
    'p{color:#64748b;font-size:14px;line-height:1.5;margin-bottom:24px}' +
    'button{background:#2563eb;color:white;border:0;padding:14px 32px;border-radius:14px;' +
    'font-weight:700;cursor:pointer;font-size:14px;width:100%;transition:background 0.2s}' +
    'button:hover{background:#1d4ed8}' +
    '.hint{font-size:11px;color:#94a3b8;margin-top:16px}' +
    '</style></head><body>' +
    '<div class="box">' +
    '<div class="icon">Z</div>' +
    '<h1>You are offline</h1>' +
    '<p>Zorvex needs an internet connection to load fresh content. Please check your connection and try again.</p>' +
    '<button onclick="location.reload()">Retry Connection</button>' +
    '<p class="hint">Tip: The app will sync automatically when you are back online.</p>' +
    '</div></body></html>';

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    status: 200
  });
}

// ============================================================
// BACKGROUND SYNC (optional, future-ready)
// ============================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'zorvex-sync') {
    event.waitUntil(
      (async () => {
        try {
          const clients = await self.clients.matchAll();
          clients.forEach(client => client.postMessage({ type: 'SYNC_TRIGGERED' }));
        } catch(e) {}
      })()
    );
  }
});

// ============================================================
// PUSH NOTIFICATIONS (ready for Phase 4)
// ============================================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update from Zorvex',
      icon: data.icon || '/icon-192.png',
      badge: data.badge || '/icon-192.png',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
      tag: data.tag || 'zorvex-notification',
      renotify: true
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'Zorvex', options)
    );
  } catch(e) {}
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

console.log('[SW] ' + SW_VERSION + ' loaded successfully');

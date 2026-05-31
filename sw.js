/* WebTools Service Worker */
const CACHE = "webtools-v1";
const STATIC_ASSETS = [
  "/webtools/index.html",
  "/webtools/404.html",
  "/webtools/css/style.css",
  "/webtools/js/i18n.js",
  "/webtools/js/app.js",
  "/webtools/manifest.json",
  "/webtools/icons/icon-192.svg",
  "/webtools/icons/icon-512.svg",
  "/webtools/tools/json-formatter.html",
  "/webtools/tools/base64.html",
  "/webtools/tools/password-generator.html",
  "/webtools/tools/url-encoder.html",
  "/webtools/tools/text-counter.html",
  "/webtools/tools/color-picker.html",
  "/webtools/tools/timestamp-converter.html",
  "/webtools/tools/html-encoder.html",
  "/webtools/tools/qr-generator.html",
  "/webtools/tools/case-converter.html",
  "/webtools/tools/uuid-generator.html",
  "/webtools/tools/hash-generator.html",
  "/webtools/js/tools/json-formatter.js",
  "/webtools/js/tools/base64.js",
  "/webtools/js/tools/password-generator.js",
  "/webtools/js/tools/url-encoder.js",
  "/webtools/js/tools/text-counter.js",
  "/webtools/js/tools/color-picker.js",
  "/webtools/js/tools/timestamp-converter.js",
  "/webtools/js/tools/html-encoder.js",
  "/webtools/js/tools/qr-generator.js",
  "/webtools/js/tools/case-converter.js",
  "/webtools/js/tools/uuid-generator.js",
  "/webtools/js/tools/hash-generator.js"
];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE);
        await cache.addAll(STATIC_ASSETS);
      } catch (e) {
        console.warn("SW install failed:", e);
      }
    })()
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    })()
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for tool pages
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle webtools scope
  if (!url.pathname.startsWith("/webtools/")) return;

  // HTML pages (tool pages): network-first, fallback to cache
  if (request.mode === "navigate" || url.pathname.endsWith(".html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (CSS, JS, icons, manifest): cache-first
  if (/\.(css|js|json|svg|png|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Fallback to 404 page for unknown pages
    const fallback = await caches.match("/webtools/404.html");
    if (fallback) return fallback;
    return new Response("Offline", { status: 503 });
  }
}

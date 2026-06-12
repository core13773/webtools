/* WebTools Service Worker */
const CACHE = "webtools-v2";
const STATIC_ASSETS = [
  "/index.html",
  "/404.html",
  "/css/style.css",
  "/css/tools.css",
  "/js/i18n.js",
  "/js/layout.js",
  "/js/app.js",
  "/manifest.json",
  "/favicon.svg",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/i18n/ko.json",
  "/i18n/en.json",
  "/tools/json-formatter.html",
  "/tools/base64.html",
  "/tools/password-generator.html",
  "/tools/url-encoder.html",
  "/tools/text-counter.html",
  "/tools/color-picker.html",
  "/tools/timestamp-converter.html",
  "/tools/html-encoder.html",
  "/tools/qr-generator.html",
  "/tools/case-converter.html",
  "/tools/uuid-generator.html",
  "/tools/hash-generator.html",
  "/js/tools/json-formatter.js",
  "/js/tools/base64.js",
  "/js/tools/password-generator.js",
  "/js/tools/url-encoder.js",
  "/js/tools/text-counter.js",
  "/js/tools/color-picker.js",
  "/js/tools/timestamp-converter.js",
  "/js/tools/html-encoder.js",
  "/js/tools/qr-generator.js",
  "/js/tools/case-converter.js",
  "/js/tools/uuid-generator.js",
  "/js/tools/hash-generator.js",
  "/tools/jwt-decoder.html",
  "/tools/regex-tester.html",
  "/tools/csv-json-converter.html",
  "/tools/css-formatter.html",
  "/tools/markdown-previewer.html",
  "/tools/px-converter.html",
  "/tools/image-base64.html",
  "/js/tools/jwt-decoder.js",
  "/js/tools/regex-tester.js",
  "/js/tools/csv-json-converter.js",
  "/js/tools/css-formatter.js",
  "/js/tools/markdown-previewer.js",
  "/js/tools/px-converter.js",
  "/js/tools/image-base64.js"
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

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

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
    const fallback = await caches.match("/404.html");
    if (fallback) return fallback;
    return new Response("Offline", { status: 503 });
  }
}

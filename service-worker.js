const CACHE_NAME = "v1";
const urlsToCache = [
  "/index.html",
  "/style.css",
  "/script.js",
  "/cart.html",
  "/cart.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// تثبيت الـ Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// تفعيل الـ Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// استرجاع البيانات من الكاش
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
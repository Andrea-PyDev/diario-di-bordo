/* Service worker: salva l'app nella cache così funziona anche senza internet.
   Quando modifichi l'app, cambia VERSIONE per forzare l'aggiornamento. */
const VERSIONE = "diario-v2";
const FILE_APP = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE_APP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  // elimina le cache delle versioni vecchie
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Strategia "stale-while-revalidate": risponde subito dalla cache,
// intanto scarica la versione nuova per la prossima apertura.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(VERSIONE).then(async cache => {
      const inCache = await cache.match(e.request, { ignoreSearch: true });
      const rete = fetch(e.request).then(r => {
        if (r && (r.ok || r.type === "opaque")) cache.put(e.request, r.clone());
        return r;
      }).catch(() => inCache);
      return inCache || rete;
    })
  );
});

/* Service worker: fa funzionare l'app anche senza internet.
   Strategia "prima la rete": se c'è connessione prende SEMPRE la versione
   più recente da GitHub; la copia in cache si usa solo offline.
   Quando modifichi l'app, cambia VERSIONE. */
const VERSIONE = "diario-v7";
const FILE_APP = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  // cache: "reload" = scarica dal server, ignorando la memoria del browser
  e.waitUntil(
    caches.open(VERSIONE)
      .then(c => c.addAll(FILE_APP.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  // elimina le cache delle versioni vecchie e prende subito il controllo
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const stessoSito = new URL(req.url).origin === self.location.origin;

  if (stessoSito) {
    // File dell'app: PRIMA LA RETE (senza memoria del browser), poi la cache se offline
    e.respondWith(
      fetch(req, { cache: "no-cache" })
        .then(r => {
          if (r.ok) { const copia = r.clone(); caches.open(VERSIONE).then(c => c.put(req, copia)); }
          return r;
        })
        .catch(() => caches.match(req, { ignoreSearch: true })
          .then(r => r || caches.match("./index.html")))
    );
  } else {
    // Font di Google: prima la cache (non cambiano mai)
    e.respondWith(
      caches.match(req).then(inCache => inCache || fetch(req).then(r => {
        const copia = r.clone(); caches.open(VERSIONE).then(c => c.put(req, copia)); return r;
      }))
    );
  }
});

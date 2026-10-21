// Service worker de Mots mêlés junior : met le jeu en cache pour jouer sans connexion.
const CACHE = "mots-meles-junior-1.0.0";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "confidentialite.html",
  "icones/icone-192.png", "icones/icone-512.png", "icones/icone-maskable-512.png", "icones/icone-180.png",
  "polices/atkinson-400.woff", "polices/atkinson-700.woff", "polices/fredoka-600.woff", "polices/fredoka-700.woff"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(cles => Promise.all(cles.filter(k => k.startsWith("mots-meles-junior") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

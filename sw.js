// Service worker de Mots Mêlés : met le jeu en cache pour jouer sans connexion.
const CACHE = "mots-meles-1.0.0";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "politique-confidentialite.html", "icones/icone-192.png", "icones/icone-512.png", "icones/icone-maskable-512.png", "icones/icone-180.png", "polices/atkinson-400.woff", "polices/atkinson-700.woff", "polices/bricolage-600.woff", "polices/bricolage-800.woff"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // la page : réseau d'abord (pour recevoir les mises à jour), cache si hors connexion
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copie)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

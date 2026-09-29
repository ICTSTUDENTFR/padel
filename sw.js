// Programme Padel — service worker : hors ligne + mises à jour
const VERSION = "2.0.1";
const CACHE = "padel-" + VERSION;
const CORE = [
  "./",
  "./app.css",
  "./base.css",
  "./barlow-condensed-latin-600-normal.woff2",
  "./barlow-condensed-latin-700-normal.woff2",
  "./ibm-plex-mono-latin-400-normal.woff2",
  "./ibm-plex-mono-latin-500-normal.woff2",
  "./ibm-plex-sans-latin-400-normal.woff2",
  "./ibm-plex-sans-latin-500-normal.woff2",
  "./ibm-plex-sans-latin-600-normal.woff2",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./index.html",
  "./app.js",
  "./charts.js",
  "./exercises.js",
  "./figs.js",
  "./program.js",
  "./store.js",
  "./timer.js",
  "./util.js",
  "./views.js",
  "./views2.js",
  "./manifest.webmanifest",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: "reload" })))));
  // pas de skipWaiting automatique : l'app affiche « Nouvelle version disponible »
});
self.addEventListener("message", (e) => { if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase, YouTube… : réseau direct
  // Fichiers de l'app : cache d'abord (version figée), réseau en secours
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});

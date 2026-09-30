// Programme Padel — service worker : hors ligne, mises à jour, notifications
const VERSION = "3.4.0";
const CACHE = "padel-" + VERSION;
const CORE = [
  "./",
  "./app.css",
  "./app.js",
  "./apple-touch-icon.png",
  "./barlow-condensed-latin-600-normal.woff2",
  "./barlow-condensed-latin-700-normal.woff2",
  "./base.css",
  "./charts.js",
  "./coach.js",
  "./config.js",
  "./cycles.js",
  "./exercises.js",
  "./extra.js",
  "./figs.js",
  "./ibm-plex-mono-latin-400-normal.woff2",
  "./ibm-plex-mono-latin-500-normal.woff2",
  "./ibm-plex-sans-latin-400-normal.woff2",
  "./ibm-plex-sans-latin-500-normal.woff2",
  "./ibm-plex-sans-latin-600-normal.woff2",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./onboard.js",
  "./program.js",
  "./store.js",
  "./timer.js",
  "./util.js",
  "./views.js",
  "./views2.js",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: "reload" })))));
});
self.addEventListener("message", (e) => { if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
// Notifications envoyées par ta fonction Supabase « padel-push »
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data.json(); } catch (x) { d = { title: "Padel", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Padel", { body: d.body || "", icon: "./icon-192.png", badge: "./icon-192.png", data: { url: d.url || "./" } }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ("focus" in c) { c.navigate && c.navigate(target); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});

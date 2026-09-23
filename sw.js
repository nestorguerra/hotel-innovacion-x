/* Service worker: la app funciona sin conexión tras la primera visita.
   Si cambias cualquier archivo, sube VERSION para que los móviles se actualicen. */
const VERSION = "hi10-v2";
const CORE = [
  "./", "index.html", "styles.css", "data.js", "app.js", "manifest.webmanifest",
  "fonts/rye.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png", "icons/favicon-32.png", "og-image.jpg",
  "img/ponentes/tausia.jpg", "img/ponentes/nestor.jpg", "img/ponentes/neil.jpg",
  "img/ponentes/sanjulian.jpg", "img/ponentes/alvarez.jpg", "img/ponentes/garcia.jpg",
  "img/ponentes/apraiz.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Red primero para la página y los datos (los cambios de horario llegan antes);
// caché primero para imágenes, iconos y fuente.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const fresh = req.mode === "navigate" || url.pathname.endsWith("data.js");
  if (fresh) {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
    );
  } else {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res;
      }))
    );
  }
});

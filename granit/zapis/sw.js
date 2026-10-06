/* Офлайн-оболочка: приложение открывается даже без интернета. */
const VER = 'demo-granit-zapis-97c2354f';
const SHELL = ['./', './index.html', './styles.css', './app.js', './store.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './privacy.html', './consent.html', './docs.css', './docs.js', './assets/fonts/fonts.css'];

self.addEventListener('install', e => { e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !font) return;
  /* Свои файлы: сначала сеть (свежая версия), если нет сети — кэш. Шрифты: кэш, обновляем в фоне. */
  if (font) {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { const copy = r.clone(); caches.open(VER).then(c => c.put(req, copy)); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VER).then(c => c.put(req, copy)); return r; })
    .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});


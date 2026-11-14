/* sw.js - tiny offline cache for the static files. Network-first, so updates are never hidden while online.
   Only works over http(s) (e.g. on Vercel), not when index.html is opened from the file system.
   If you change files, bump CACHE to start a fresh cache. */
const CACHE = 'orbit-health-v3';
const FILES = [
  './',
  'index.html',
  'base.css',
  'components.css',
  'layout.css',
  'evaluate.js',
  'namespace.js',
  'state.js',
  'storage.js',
  'trends.js',
  'environments.js',
  'hazards.js',
  'indicators.js',
  'sample-history.js',
  'scenarios.js',
  'main.js',
  'a11y.js',
  'body-figure.js',
  'chart.js',
  'demo-mode.js',
  'environment.js',
  'explanations.js',
  'export-summary.js',
  'form.js',
  'gamification.js',
  'reminders.js',
  'shields.js',
  'exercise.js',
  'i18n.js',
  'cell-counter.js',
  'status-cards.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { /* a failed pre-cache must never break the app */ })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match('index.html'); });
    })
  );
});

/* sw.js - tiny offline cache for the static files. Network-first, so updates are never hidden while online.
   Only works over http(s) (e.g. on Vercel), not when index.html is opened from the file system.
   If you change files, bump CACHE to start a fresh cache. */
const CACHE = 'orbit-health-v3';
const FILES = [
  './',
  'index.html',
  'css/base.css',
  'css/components.css',
  'css/layout.css',
  'js/core/evaluate.js',
  'js/core/namespace.js',
  'js/core/state.js',
  'js/core/storage.js',
  'js/core/trends.js',
  'js/data/environments.js',
  'js/data/hazards.js',
  'js/data/indicators.js',
  'js/data/sample-history.js',
  'js/data/scenarios.js',
  'js/main.js',
  'js/ui/a11y.js',
  'js/ui/body-figure.js',
  'js/ui/chart.js',
  'js/ui/demo-mode.js',
  'js/ui/environment.js',
  'js/ui/explanations.js',
  'js/ui/export-summary.js',
  'js/ui/form.js',
  'js/ui/gamification.js',
  'js/ui/reminders.js',
  'js/ui/shields.js',
  'js/ui/exercise.js',
  'js/ui/i18n.js',
  'js/ui/cell-counter.js',
  'js/ui/status-cards.js'
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

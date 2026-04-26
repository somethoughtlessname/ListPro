const CACHE = 'checklist-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './firebase.txt',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS.filter(a => !a.includes('icon'))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for Firebase API calls — always need fresh data
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('googleapis.com')) {
    return; // let Firebase requests go straight to network
  }
  // Cache first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

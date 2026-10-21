// Service Worker untuk Pulau Membaca v2

const CACHE_NAME = 'pulau-v2-2';

const PRECACHE_URLS = [
  './',
  'index.html',
  'css/style.css',
  'manifest.webmanifest',
  'js/config.js',
  'js/data.js',
  'js/core.js',
  'js/latihan.js',
  'js/tutorial.js',
  'js/game/asas.js',
  'js/game/k01-belon.js',
  'js/game/k02-ulat.js',
  'js/game/k03-kereta.js',
  'js/game/k04-ikan.js',
  'js/game/k05-katak.js',
  'js/game/k06-bakul.js',
  'js/game/k07-bot.js',
  'js/game/k08-bunga.js',
  'js/game/k09-kunci.js',
  'js/game/k10-mesin.js',
  'js/game/k11-keretaayat.js',
  'js/game/k12-detektif.js',
  'js/peta.js',
  'js/main.js',
  'assets/v2/peta_pulau.jpg',
  'assets/v2/lok_k01.png',
  'assets/v2/lok_k02.png',
  'assets/v2/lok_k03.png',
  'assets/v2/lok_k04.png',
  'assets/v2/lok_k05.png',
  'assets/v2/lok_k06.png',
  'assets/v2/lok_k07.png',
  'assets/v2/lok_k08.png',
  'assets/v2/lok_k09.png',
  'assets/v2/lok_k10.png',
  'assets/v2/lok_k11.png',
  'assets/v2/lok_k12.png',
  'assets/v2/kancil_sapa.png',
  'assets/v2/kancil_tunjuk.png',
  'assets/v2/kancil_gembira.png',
  'assets/v2/kancil_fikir.png',
  'assets/v2/aiman.png',
  'assets/v2/aiman_gembira.png',
  'assets/v2/aina.png',
  'assets/v2/aina_gembira.png',
  'assets/v2/s_belon.png',
  'assets/v2/s_ulat_kepala.png',
  'assets/v2/s_ulat_badan.png',
  'assets/v2/s_daun.png',
  'assets/v2/s_kepala_kereta.png',
  'assets/v2/s_gerabak.png',
  'assets/v2/s_ikan.png',
  'assets/v2/s_jaring.png',
  'assets/v2/s_katak.png',
  'assets/v2/s_batu.png',
  'assets/v2/s_bakul.png',
  'assets/v2/s_bot.png',
  'assets/v2/s_pulau.png',
  'assets/v2/s_kunci.png',
  'assets/v2/s_pintu.png',
  'assets/v2/s_mesin.png',
  'assets/v2/s_kanta.png',
  'assets/v2/s_bintang.png',
  'assets/v2/s_beg.png',
  'assets/v2/s_awan.png',
  'assets/v2/g_k01.png',
  'assets/v2/g_k02.png',
  'assets/v2/g_k03.png',
  'assets/v2/g_k04.png',
  'assets/v2/g_k05.png',
  'assets/v2/g_k06.png',
  'assets/v2/g_k07.png',
  'assets/v2/g_k08.png',
  'assets/v2/g_k09.png',
  'assets/v2/g_k10.png',
  'assets/v2/g_k11.png',
  'assets/v2/g_k12.png',
  'assets/v2/ikon-192.png',
  'assets/v2/ikon-512.png'
];

// Pasang service worker dan pra-cache aset
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Buang cache lama apabila diaktifkan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi pengambilan (Fetch)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Jangan cache atau kacau permintaan ke domain lain (cth. script.google.com, fonts)
  if (url.origin !== self.location.origin) {
    return;
  }

  const isNavigasi = event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  // Kod (js/css/json/manifest) juga network-first supaya murid sentiasa dapat versi terkini
  const isKod = /\.(js|css|json|webmanifest)$/.test(url.pathname);

  if (isNavigasi || isKod) {
    // Navigasi & kod: network-first dengan sandaran cache (luar talian)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const klon = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, klon));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse || !isNavigasi) return cachedResponse;
            return caches.match('index.html').then((r) => r || caches.match('./'));
          });
        })
    );
  } else {
    // Fail statik lain: cache-first kemudian simpan ke cache
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const klon = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, klon));
          }
          return networkResponse;
        });
      })
    );
  }
});

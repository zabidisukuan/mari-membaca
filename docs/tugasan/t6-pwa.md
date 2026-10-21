Anda menyambung pembinaan versi 2 app web dalam repositori ini. Baca **docs/SPEC-v2.md** bahagian 10, kemudian index.html, js/peta.js dan css/style.css.

TUGASAN 6 — PWA (aplikasi boleh dipasang) dan kemasan:
1. **manifest.webmanifest**: name "Pulau Membaca", short_name "Pulau Membaca", start_url "./", scope "./", display "standalone", background_color "#e0f7fa", theme_color "#ffb703", lang "ms", ikon `assets/v2/ikon-192.png` dan `assets/v2/ikon-512.png` (fail ikon SUDAH disediakan, jangan cipta).
2. **sw.js** (di akar): nama cache berversi (cth. `pulau-v2-1`). Semasa `install`, pra-cache: index.html, css/style.css, semua fail js/ dan js/game/ (senarai eksplisit), manifest, assets/v2/peta_pulau.jpg dan assets/v2/*.png (senarai eksplisit — baca nama dari tools/aset-v2.json; semua PNG kecuali peta_pulau). Strategi: `index.html`/navigasi = network-first dengan sandaran cache; fail statik lain (termasuk assets/img, assets/audio apabila diminta) = cache-first kemudian simpan ke cache. JANGAN cache atau mencampuri permintaan ke domain lain (script.google.com, fonts) — biarkan pelayar mengendalikannya. Buang cache lama dalam `activate`.
3. **index.html**: `<link rel="manifest">`, `<link rel="apple-touch-icon" href="assets/v2/ikon-192.png">`, daftar service worker dalam js/main.js (hanya jika `'serviceWorker' in navigator` dan `location.protocol` ialah https atau hostnya localhost).
4. **Butang "📲 Pasang aplikasi"** pada skrin peta: dengar `beforeinstallprompt`, simpan acara, tunjuk butang; klik → `prompt()`. Sembunyi jika tiada acara atau sudah dipasang (`display-mode: standalone`).

Peraturan SPEC bahagian 1 kekal. Jalankan `node --check` pada fail .js yang diubah. Jangan buat commit git. Akhiri dengan ringkasan pendek.

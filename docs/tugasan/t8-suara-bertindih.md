# Tugasan T8: Betulkan suara bertindih (double)

Guru melaporkan ada suara yang bertindih: dua suara dimainkan serentak, atau suara yang sama berbunyi dua kali. Baca `docs/SPEC-v2.md` untuk konteks.

## Punca yang diketahui

Dalam `js/core.js`, `Suara.main()` mencipta `new Audio(...)` baharu setiap kali dipanggil tanpa menghentikan audio sebelumnya. Contohnya:
- Murid menekan 🔊 berkali-kali.
- Murid menekan "Seterusnya" dalam tutorial semasa suara masih berbunyi.
- Sapaan lokasi masih berbunyi apabila arahan game bermula.
- Suara perkataan masih berbunyi apabila suara jawapan penuh bermula.

Dalam semua keadaan ini, suara akan bertindih.

## Apa perlu dibuat

1. **`js/core.js` → `Suara`:**
   - Simpan satu objek audio "semasa".
   - Setiap panggilan `main()` mesti hentikan audio semasa (`pause()` dan `currentTime = 0`) dan `speechSynthesis.cancel()` sebelum memainkan suara baharu.
   - Tambah `Suara.henti()` dan eksport bersama `main`, `butang` dan `slug`.
2. **Bila tukar skrin**, contohnya fungsi `skrin()` dalam `core.js`, panggil `Suara.henti()` supaya suara skrin lama tidak bersambung ke skrin baharu.
3. **Semak semua pemanggil `Suara.main`** di `js/tutorial.js`, `js/peta.js`, `js/latihan.js`, `js/game/asas.js` dan `js/game/k*.js`:
   - Cari `setTimeout` atau `setInterval` yang memainkan suara selepas murid sudah keluar dari langkah atau skrin. Pastikan pemasa tersebut dibatalkan atau disemak dahulu sebelum suara dimainkan. Contohnya, simpan id pemasa dan `clearTimeout` apabila langkah bertukar, atau semak elemen masih ada dalam DOM.
   - Cari tempat yang memanggil `Suara.main` dua kali untuk teks yang sama secara berturut-turut. Contohnya, panggilan automatik ditambah `onclick` yang tercetus serentak, atau pendengar yang didaftar dua kali. Buang panggilan yang berlebihan.
4. **Fail audio berganda:** tulis skrip `tools/semak-audio.mjs` (Node, tanpa pakej luar) untuk:
   - Membaca setiap `assets/audio/*.wav` dan mengira tempoh daripada header WAV.
   - Menyenaraikan fail yang tempohnya luar biasa panjang berbanding panjang teks. Contohnya, perkataan atau suku kata pendek yang melebihi 2.5 saat mungkin mengandungi bacaan berganda.
   - Mengeluarkan laporan ke `docs/laporan-audio.txt`.
   - **JANGAN padam atau ubah fail audio.** Laporkan sahaja.

## Larangan

- Jangan ubah `js/data.js`, `apps-script/`, `js/config.js` atau mana-mana fail dalam `assets/`.
- Jangan ubah logik markah.
- Kekalkan gaya kod sedia ada: JavaScript biasa, global, komen dalam Bahasa Melayu.
- Selepas siap, jalankan `node --check` pada setiap fail JS yang diubah.

## Bila selesai

Tulis ringkasan perubahan di hujung fail ini, di bawah tajuk `## Hasil`.

## Hasil

Perubahan berikut telah dilaksanakan untuk membetulkan isu suara bertindih:

1. **`js/core.js` (`Suara` & `skrin`):**
   - Menambah pemboleh ubah `audioSemasa` untuk mengesan objek audio yang sedang dimainkan.
   - Menambah fungsi `Suara.henti()` yang memberhentikan audio semasa (`pause()`, `currentTime = 0`, `audioSemasa = null`) dan `speechSynthesis.cancel()`.
   - Mengemaskini `Suara.main()` untuk sentiasa memanggil `Suara.henti()` sebelum memainkan audio baharu.
   - Mengemaskini `skrin()` untuk memanggil `Suara.henti()` secara automatik setiap kali skrin bertukar.
   - Mengeksport `{ main, henti, butang, slug }`.

2. **`js/peta.js`:**
   - Membatalkan pemasa `nodeMenuTimer` jika node lokasi diketik semula dengan pantas.
   - Memastikan `Suara.henti()` dipanggil apabila modal menu ditutup.

3. **`js/tutorial.js`:**
   - Mengemaskini `renderDemo` untuk membersihkan sebarang pemasa animasi aktif (`bersihkanPentasTimer`) sebelum memulakan animasi baharu atau pada setiap ketikan.
   - Menambah semakan `el.isConnected` dalam `setTimeout` bagi memastikan audio demo tidak dimainkan selepas murid meninggalkan skrin tutorial.
   - Memastikan demo hanya dimainkan apabila kad diketik, mengelakkan pertindihan audio dengan arahan asal Kancil.

4. **`js/latihan.js`:**
   - Menyimpan id pemasa `nextTimer` untuk soalan seterusnya dan membatalkannya (`clearTimeout`) apabila murid menekan butang Keluar.

5. **`js/game/asas.js` & `js/game/k*.js`:**
   - `js/game/asas.js`: Menambah panggilan `Suara.henti()` di butang keluar game.
   - `js/game/k01-belon.js`, `js/game/k04-ikan.js`: Menyimpan `timerId` untuk soalan baharu supaya boleh dibatalkan semasa `henti()`.
   - `js/game/k02-ulat.js`, `js/game/k03-kereta.js`, `js/game/k05-katak.js`, `js/game/k08-bunga.js`: Memastikan `Suara.main(suku)` hanya dipanggil untuk langkah perantaraan, manakala langkah terakhir menyerahkan sebutan penuh kepada `GameAsas.betul(jawapanPenuh)`.
   - `js/game/k06-bakul.js`, `js/game/k07-bot.js`, `js/game/k08-bunga.js`: Membuang panggilan `Suara.main(jawapanPenuh)` berlebihan yang dipanggil sejurus sebelum `GameAsas.betul(...)`.

6. **`tools/semak-audio.mjs` & `docs/laporan-audio.txt`:**
   - Membina skrip Node `tools/semak-audio.mjs` (tanpa pakej luar) yang mengira tempoh fail `.wav` daripada header RIFF/data.
   - Menjana laporan analisis audio di `docs/laporan-audio.txt`.


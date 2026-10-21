Anda membina versi 2 app web dalam repositori ini. Baca **docs/SPEC-v2.md** dengan teliti dahulu, kemudian baca js/engine.js, js/games.js, js/data.js, css/style.css dan index.html (v1).

TUGASAN 1 — teras, peta dan latihan (JANGAN buat tutorial atau game lagi):

1. **js/core.js**: pindahkan `Simpan`, `Bunyi`, `Suara`, `Murid`, `bintang`, `LULUS`, `Markah` (termasuk pendengar 'online'), `esc`, `app`, `skrin()` dan `modGuru` daripada js/engine.js TANPA mengubah tingkah laku mereka.
2. **js/latihan.js**: salin semua kandungan js/games.js (U, binaSoalan, render dan pembantu) TANPA mengubah logik soalan, kemudian tambah `mainLatihan(t)` berdasarkan `mainTahap` dalam engine.js mengikut SPEC bahagian 7 (maskot pada keputusan, butang Ulang / Main Game / Peta, `Markah.hantar` hanya di sini, `window.soalanSemasa = q` dikekalkan).
3. **js/peta.js**: skrin daftar (sama seperti v1), pilih watak, peta pulau (SVG laluan berliku + 12 lokasi + avatar berjalan beranimasi), menu lokasi (Tutorial · Latihan · Game), beg 🎒, mod guru — ikut SPEC bahagian 5. Nama lokasi ikut jadual SPEC bahagian 8 dan pelan: K1 Kampung Huruf, K2 Hutan Suku Kata, K3 Bukit Tiga Suku, K4 Kolam Ikan, K5 Sungai Batu, K6 Pasar Ng, K7 Pulau Diftong, K8 Taman Bunga, K9 Gua Kunci, K10 Kilang Imbuhan, K11 Stesen Ayat, K12 Istana Cerita.
   - Butang Tutorial: panggil `mainTutorial(t)` jika `typeof TUTORIAL !== 'undefined' && TUTORIAL[t.id]`, jika tidak papar mesej "Akan datang".
   - Butang Game: panggil `mainGame(t)` jika `typeof GAME !== 'undefined' && GAME[t.id]`, jika tidak "Akan datang". (mainGame akan dibuat dalam tugasan lain.)
4. **js/main.js**: `Markah.flush()` dan pilih skrin pertama (daftar → pilih watak jika belum → peta).
5. **css/style.css**: tema v2 penuh mengikut SPEC bahagian 9 (gantikan tema v1, tetapi kekalkan kelas yang digunakan oleh `render()` dalam latihan.js — .kad-soalan, .gambar, .pilihan, .pil, .bina, .slot, .jubin, .persamaan, .perkataan-isi, .kosong, .petikan dsb. — dengan rupa baharu).
6. **index.html**: muat fon Andika + Baloo 2, css, kemudian skrip: config.js, data.js, core.js, latihan.js, peta.js, main.js. Kekalkan ikon favicon v1.
7. Padam js/engine.js dan js/games.js selepas dipindah.

Aset: `assets/v2/<id>.jpg` dengan id dalam tools/aset-v2.json (contoh peta_pulau, lok_k01..lok_k12, kancil_sapa, kancil_tunjuk, kancil_gembira, kancil_fikir, aiman, aina, aiman_gembira, aina_gembira, s_beg, s_bintang, g_k01..g_k12). Sesetengah fail mungkin belum wujud semasa anda bekerja: setiap `<img>` mesti ada sandaran (onerror → emoji atau bentuk CSS) supaya tiada yang rosak. Sprite berlatar putih: guna `mix-blend-mode: multiply`.

Selepas siap: jalankan `node --check` pada setiap fail .js yang anda tulis dan betulkan ralat. Jangan ubah fail yang dilarang dalam SPEC bahagian 1. Jangan buat commit git. Akhiri dengan ringkasan pendek fail yang diubah.

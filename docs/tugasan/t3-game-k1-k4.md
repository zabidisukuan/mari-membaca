Anda menyambung pembinaan versi 2 app web dalam repositori ini. Baca **docs/SPEC-v2.md** (terutama bahagian 1, 4, 8 dan 9), kemudian baca js/core.js, js/peta.js, js/latihan.js, js/tutorial.js, js/data.js, css/style.css dan index.html.

TUGASAN 3 — rangka game bersama + game K1 hingga K4.

A. **js/game/asas.js** (dimuat selepas tutorial.js, sebelum fail game lain):
   - `const GAME = {}` dan `function mainGame(t)` yang menjalankan `GAME[t.id]` mengikut SPEC bahagian 8 "Peraturan bersama": skrin game dengan latar bertema, bar atas (✕ keluar → `henti()` + kembali ke menu lokasi, ⏱ 60 s, ⭐ skor, 🔥 kombo ×N), maskot `kancil_sapa.jpg` memberi `arahan` + 🔊 (`Suara.main`) dengan butang "Mula!", kiraan 3-2-1, kemudian `mula(el, tahap, selesai)`.
   - Pembantu yang game gunakan: `GameAsas.betul(teksDisebut, elemen)` (+10×kombo, kombo maks ×5, `Bunyi.betul()`, `Suara.main`, animasi), `GameAsas.salah(elemen)` (reset kombo, `Bunyi.salah()`, animasi goyang), `GameAsas.soalanBaru(jawapan)` (tetapkan `window.soalanSemasa = { jawapan }`), `GameAsas.tandaBetul(elemen)` (buang semua `data-betul` lama dalam skrin game, letak `data-betul="1"` pada elemen ini).
   - Tamat masa → skrin keputusan: skor, skor tertinggi (`Simpan` kunci `mm2_game_<Murid.kunci(murid)>_<Kn>`), bintang game (≥60=1★, ≥120=2★, ≥200=3★), jika ≥1★ dan barang `g_kNN` belum ada → animasi "Kamu dapat <nama barang>!" dan simpan ke beg (gunakan mekanisme beg sedia ada dalam peta.js; jika tiada fungsi umum, tambah `Murid.beriBarang(id)` / `Murid.adaBarang(id)` dalam core.js — kunci `mm2_beg_<kunci>`). Butang: ↻ Main lagi · 🗺️ Peta. **Tiada hantar ke Sheet.**
   - `window.GAME_UJIAN = { cepat: true }` jika ditetapkan: pemasa 8 s dan langkau maskot/kiraan.
   - Nama barang ganjaran: g_k01 Pensel Ajaib, g_k02 Daun Emas, g_k03 Tiket Emas, g_k04 Piala Ikan Emas, g_k05 Permata Biru, g_k06 Bakul Buah, g_k07 Kulit Kerang, g_k08 Bunga Raya, g_k09 Kunci Emas, g_k10 Gear Emas, g_k11 Wisel Kereta Api, g_k12 Mahkota.
   - Sambungkan butang Game dalam menu lokasi dan butang "🎮 Main Game" pada keputusan Latihan supaya memanggil `mainGame(t)` jika `GAME[t.id]` wujud (kekalkan syarat Latihan ≥ 50% dan mod guru).

B. Game (satu fail setiap satu, ikut jadual SPEC bahagian 8, guna sprite `assets/v2/s_*.jpg`, latar = gambar lokasi dikaburkan/dilembutkan atau kecerunan bertema):
   - **js/game/k01-belon.js** — Pecah Belon (huruf; `Suara.main(huruf)` pada setiap soalan; belon terapung naik dengan animasi CSS; huruf serupa b/d/p/q, m/n/w/u sebagai pengacau).
   - **js/game/k02-ulat.js** — Ulat Lapar (perkataan `gambar` K2; daun suku kata; ulat bertambah segmen).
   - **js/game/k03-kereta.js** — Kereta Api Suku Kata (perkataan `gambar` K3; gerabak bersambung; kereta api bergerak keluar bila lengkap).
   - **js/game/k04-ikan.js** — Tangkap Ikan (gambar K4; ikan berenang mendatar membawa perkataan; pengacau dari `senarai` K4 yang bermula dengan huruf sama atau panjang sama).
   Setiap game: soalan berulang secara rawak sehingga masa tamat; selepas setiap jawapan betul tunggu ~900 ms (animasi) sebelum soalan baru; bersihkan semua pemasa/animasi dalam `henti()`. Elemen yang perlu diketik seterusnya untuk jawapan betul MESTI ditanda dengan `GameAsas.tandaBetul(el)` (untuk ulat/kereta: kemas kini selepas setiap ketikan betul). Pastikan elemen bergerak (belon/ikan) masih boleh diketik dan tidak keluar skrin sebelum sempat diketik (kitar semula kedudukan).

C. Kemas kini index.html untuk memuat js/game/asas.js dan keempat-empat fail game.

Peraturan SPEC bahagian 1 kekal. Mesra telefon 360px. Selepas siap jalankan `node --check` pada setiap fail .js yang diubah. Jangan buat commit git. Akhiri dengan ringkasan pendek.

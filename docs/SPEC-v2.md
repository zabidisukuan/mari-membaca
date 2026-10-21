# SPEC v2 — "Pengembaraan Pulau Membaca"

Game membaca Bahasa Melayu untuk murid Tahun 1 (program intervensi LINUS), berdasarkan 12 konstruk (K1–K12).
v1 sudah berfungsi; v2 membalut kandungan yang sama dalam dunia pengembaraan yang menarik.
Setiap konstruk ada **Tutorial**, **Latihan** dan **Game**.

## 1. Peraturan teknikal (WAJIB)
- HTML/CSS/JavaScript biasa sahaja. **Tiada framework, tiada bundler, tiada npm, tiada ES modules.** Skrip biasa `<script src>` yang berkongsi global, seperti v1.
- Luaran yang dibenarkan: Google Fonts (Andika, Baloo 2) sahaja. Tiada CDN lain.
- **JANGAN ubah**: `js/data.js`, `js/config.js`, `apps-script/`, `assets/img/`, `assets/audio/`, `tools/`.
- Semua interaksi dengan **ketik** (tap). Tiada seret (drag) yang wajib — telefon murid kecil.
- Mesra telefon: berfungsi pada lebar 360px tanpa skrol mendatar; butang ≥ 48px; teks bacaan ≥ 24px.
- Semua teks paparan dalam Bahasa Melayu.
- localStorage melalui `Simpan.get/set` sahaja (sudah ada try/catch).
- Tiada `console.error` semasa main biasa.
- Kod mudah dibaca, komen ringkas dalam Bahasa Melayu.

## 2. Fail
```
index.html                 muat fon, css, kemudian skrip mengikut urutan di bawah
css/style.css              tema v2 (ganti sepenuhnya)
js/config.js               (sedia ada) CONFIG.URL_MARKAH
js/data.js                 (sedia ada) DATA.tahap[0..11]
js/core.js                 Simpan, Bunyi, Suara, Murid, Markah, esc, skrin() — DIPINDAH dari js/engine.js v1 tanpa ubah tingkah laku
js/latihan.js              = js/games.js v1 (binaSoalan, render, U) + fungsi mainLatihan(t)
js/tutorial.js             TUTORIAL['K1'..'K12'] + mainTutorial(t)
js/game/k01-belon.js … k12-detektif.js   GAME['K1'..'K12']
js/peta.js                 skrin daftar, pilih watak, peta, beg, menu lokasi, keputusan
js/main.js                 permulaan app (flush markah, pilih skrin pertama)
manifest.webmanifest, sw.js, assets/v2/ikon-192.png, ikon-512.png   PWA
```
Buang `js/engine.js` dan `js/games.js` selepas kandungannya dipindah.

## 3. Data sedia ada (`js/data.js`)
`DATA.tahap[i]` mengandungi `id` ('K1'..'K12'), `tajuk`, `ikon`, dan medan berikut mengikut tahap:
- K1: `huruf` (array a–z)
- K2–K8, K10: `gambar` [{ w:'bu-ku' (suku kata dipisah '-'), e: emoji, en }], `senarai` (rentetan perkataan dipisah ruang, suku kata dengan '-')
- K8: `cantum` 'di+a pi+sau …'
- K9: `isi` [{ w, blank, opsyen:[betul, salah, salah], e }], `senarai` (format sama, tanpa gambar)
- K10: `imbuhan` [[dasar, imbuhan, jawapan]], `gambar`
- K11: `ayat` [{ s: ayat, img }]
- K12: `petikan` [{ img, teks:[baris], soalan:[{ q, opsyen:[betul, …] }] }]
Gambar: `assets/img/<id>.jpg` dengan id = perkataan tanpa '-' (atau `img`). Fungsi pembantu sedia ada dalam latihan.js: `U.kata`, `U.suku`, `U.shuffle`, `U.pick`, `U.el`, `gambarEl(img, e)`.

## 4. Suara
`Suara.main(teks)` memainkan `assets/audio/<slug>.wav` jika ada, jika tidak suara pelayar ms-MY. `Suara.butang(teks)` → butang 🔊.
- Huruf a–z = rakaman suara guru (`Suara.main('b')`).
- Setiap perkataan dalam data.js dan ayat K11 sudah ada fail audio.
- Teks tutorial/arahan maskot akan dijana kemudian dengan nama `Suara.slug(teks)` — panggil `Suara.main(teks)` sahaja; jika fail belum ada, ia jatuh ke suara pelayar atau senyap.
- `Bunyi.betul()`, `Bunyi.salah()`, `Bunyi.menang()` untuk kesan bunyi.

## 5. Aliran skrin
1. **Daftar** (sama seperti v1: kod sekolah, nama sekolah, nama, tahun, kelas; URL `?kod=&sekolah=&tahun=&kelas=` mengisi awal; senarai murid lama sebagai cip).
2. **Pilih watak**: Aiman (`assets/v2/aiman.jpg`) atau Aina (`aina.jpg`). Disimpan per murid (`Simpan` kunci `mm2_watak_<kunciMurid>`). Boleh tukar dari peta.
3. **Peta Pulau Membaca**: latar `assets/v2/peta_pulau.jpg`; laluan berliku (SVG path di atas latar) melalui 12 lokasi (`lok_k01.jpg` … `lok_k12.jpg`) dengan nama lokasi. Avatar watak berdiri di lokasi terakhir yang dibuka dan **berjalan beranimasi** ke lokasi yang diketik. Lokasi terkunci kelabu dengan 🔒. Bar atas: nama murid, ⭐ jumlah bintang, butang 🎒 Beg, butang Tukar murid. Mod guru: ketik tajuk 5× → buka semua (kekal seperti v1, kunci `mm_mod_guru`).
4. **Menu lokasi** (modal/skrin): nama lokasi, maskot Sang Kancil (`kancil_sapa.jpg`) dengan belon kata + 🔊 memperkenalkan lokasi, dan 3 butang besar:
   📘 **Tutorial** · ✏️ **Latihan** (tunjuk markah terbaik %) · 🎮 **Game** (terkunci sehingga Latihan ≥ 50%; tunjuk skor tertinggi).
5. **Beg 🎒**: grid 12 barang ganjaran (`g_k01.jpg` … `g_k12.jpg`); yang belum diperoleh = siluet kelabu. Barang Kn diperoleh apabila Game Kn mendapat ≥ 1 bintang.

**Buka kunci:** K1 sentiasa terbuka; Kn+1 dibuka apabila Latihan Kn ≥ 50% (atau mod guru).

## 6. Tutorial (`js/tutorial.js`)
`TUTORIAL['Kn'] = { pengenalan: 'teks', langkah: [ { teks: 'arahan maskot', demo: {...} } ] }` — 3 hingga 5 langkah.
Paparan: maskot (`kancil_tunjuk.jpg`) + belon kata (teks + 🔊, mainkan automatik `Suara.main(teks)`), kawasan demo besar di bawah, butang ◀ Kembali / Seterusnya ▶, titik kemajuan. Langkah terakhir: "Syabas! Mari cuba Latihan" → pergi ke Latihan.
Jenis demo (animasi CSS, ketik untuk ulang & dengar):
- `{ jenis:'huruf', huruf:['a','b','c'] }` — kad huruf besar; ketik → `Suara.main(huruf)`.
- `{ jenis:'cantum', bahagian:['b','a'], hasil:'ba' }` — kepingan bergerak bercantum menjadi hasil, kemudian `Suara.main(hasil)`.
- `{ jenis:'perkataan', w:'bu-ku' }` — gambar + suku kata diserlah satu demi satu, kemudian perkataan penuh dibaca.
- `{ jenis:'serlah', w:'pisang', bahagian:'ng' }` — perkataan dengan bahagian berwarna dan berdenyut.
- `{ jenis:'imbuhan', dasar:'baca', imbuhan:'me-', hasil:'membaca' }`
- `{ jenis:'ayat', s:'Mereka sedang membaca buku cerita.', img:'ayat01' }` — perkataan diserlah satu demi satu (karaoke).
- `{ jenis:'petikan', indeks:0 }` — petikan K12, soalan pertama, jawapan diserlah dalam teks.
Kandungan tutorial: ringkas, bahasa mudah untuk murid 7 tahun, guna contoh daripada data.js. Contoh K2:
1. "Huruf konsonan dan vokal bercantum menjadi suku kata." demo cantum b+a=ba
2. "Mari cuba lagi!" demo cantum k+u=ku
3. "Dua suku kata bercantum menjadi perkataan." demo cantum bu+ku=buku
4. "Baca bersama Sang Kancil." demo perkataan 'bu-ku'

## 7. Latihan (`js/latihan.js`)
Guna semula `binaSoalan(t)` dan `render(q, el, selesai)` daripada v1 TANPA mengubah logik soalan. `mainLatihan(t)` = fungsi `mainTahap` v1 (bar kemajuan, `window.soalanSemasa = q`, suara jawapan, keputusan) dengan perubahan:
- Tema visual v2; maskot `kancil_gembira.jpg` di skrin keputusan (≥ 50%) atau `kancil_fikir.jpg` (< 50%, "Cuba lagi!").
- Simpan kemajuan: `Murid.simpanKemajuan(id, peratus)` (sedia ada) dan **hantar ke Sheet**: `Markah.hantar(id, peratus)` — HANYA dari Latihan.
- Butang keputusan: ↻ Ulang · 🎮 Main Game (jika ≥ 50%) · 🗺️ Peta.

## 8. Game (`js/game/*.js`)
Antara muka seragam:
```js
GAME['K4'] = {
  nama: 'Tangkap Ikan', latar: 'assets/v2/lok_k04.jpg',
  arahan: 'Tangkap ikan yang membawa perkataan untuk gambar ini!',
  mula(el, tahap, selesai) { /* lukis dalam el; panggil selesai({ skor, betul, salah }) bila tamat */ },
  henti() { /* bersihkan pemasa/animasi bila murid keluar */ },
};
```
Peraturan bersama (buat pembantu dalam `js/game/asas.js`, dimuat sebelum game lain):
- Skrin game: latar bertema, bar atas (✕ keluar, ⏱ pemasa **60 s**, ⭐ skor, 🔥 kombo ×N). Kiraan 3-2-1 sebelum mula. Maskot memberi `arahan` + 🔊 sebelum kiraan.
- Jawapan betul: +10 × kombo (kombo naik setiap betul berturut-turut, maks ×5; reset bila salah), `Bunyi.betul()`, `Suara.main(perkataan)`, animasi gembira. Salah: `Bunyi.salah()`, goyang, tiada penalti masa.
- Tamat masa → skrin keputusan: skor, skor tertinggi (`Simpan` kunci `mm2_game_<kunciMurid>_<Kn>`), bintang game: ≥ 60 = 1★, ≥ 120 = 2★, ≥ 200 = 3★; jika ≥ 1★ dan barang belum ada → animasi "Kamu dapat <barang>!" dan masuk beg. **Tiada hantar ke Sheet.**
- Soalan diambil secara rawak berulang daripada data tahap (tiada had soalan, hanya had masa).
- **Kebolehujian (WAJIB)**: setiap kali soalan baru dipapar, tetapkan `window.soalanSemasa = { jawapan: <teks jawapan> }` dan letakkan atribut `data-betul="1"` pada elemen yang perlu diketik untuk menjawab dengan betul (jika jawapan perlukan beberapa ketikan berurutan, `data-betul` diletak pada elemen langkah seterusnya sahaja dan dikemas kini selepas setiap ketikan). Sediakan `window.GAME_UJIAN = { cepat: true }` yang, jika ditetapkan sebelum `mula`, memendekkan pemasa kepada 8 s dan melangkau kiraan.

Game setiap konstruk (sprite dalam `assets/v2/`):
| K | Game | Mekanik |
|---|---|---|
| K1 | **Pecah Belon** | Huruf sasaran dimainkan (`Suara.main(h)`) + dipapar kecil dengan 🔊. 4–5 belon (`s_belon.jpg`, warna berbeza melalui CSS `filter: hue-rotate`) terapung naik perlahan dari bawah, setiap satu membawa huruf (termasuk huruf serupa b/d/p/q). Ketik belon betul → meletup (animasi) → huruf baru. |
| K2 | **Ulat Lapar** | Gambar perkataan (`gambar` K2) di atas. Ulat (`s_ulat_kepala.jpg`) di kiri. 4 daun (`s_daun.jpg`) membawa suku kata (betul + pengacau). Ketik suku kata mengikut urutan → ulat "makan" daun dan badannya bertambah satu segmen (`s_ulat_badan.jpg`) berlabel suku kata. Perkataan lengkap → dibaca. |
| K3 | **Kereta Api Suku Kata** | Gambar K3. Kepala kereta (`s_kepala_kereta.jpg`) + slot gerabak kosong. Gerabak (`s_gerabak.jpg`) berlabel suku kata di bawah. Ketik ikut urutan → gerabak bersambung. Lengkap → kereta api bergerak keluar skrin, yang baru masuk. |
| K4 | **Tangkap Ikan** | Gambar K4 di atas air. 3–4 ikan (`s_ikan.jpg`) berenang mendatar membawa perkataan KVK (betul + pengacau dari `senarai`). Ketik ikan betul → jaring (`s_jaring.jpg`) menangkap. |
| K5 | **Katak Melompat** | Gambar K5. Sungai dengan baris batu (`s_batu.jpg`); setiap langkah ada 3 batu berlabel suku kata; ketik batu dengan suku kata seterusnya → katak (`s_katak.jpg`) melompat ke situ. Sampai seberang (perkataan lengkap) → perkataan baru. |
| K6 | **Bakul Pasar** | Satu barang/perkataan muncul (perkataan K6 *atau* perkataan K2/K4 tanpa "ng" sebagai pengacau, ~50:50) dengan gambar jika ada. Dua bakul (`s_bakul.jpg`): "ada **ng**" dan "tiada **ng**". Ketik bakul betul → barang jatuh masuk. |
| K7 | **Bot ke Pulau** | Tiga pulau (`s_pulau.jpg`) berlabel **ai**, **au**, **oi**. Bot (`s_bot.jpg`) membawa perkataan K7 (gambar + `senarai`). Ketik pulau dengan diftong yang betul → bot belayar ke situ. |
| K8 | **Roda Bunga** | Bunga besar: tengah = suku kata berganding (cth. *ia*, *au*, *ua*, *ui*); kelopak = 5–6 suku kata/konsonan. Arahan: "Bina perkataan **duit**" (dengan gambar jika ada) → ketik kelopak yang betul untuk bergabung dengan tengah. Guna perkataan K8 (`gambar`, `senarai`, `cantum`). |
| K9 | **Pilih Kunci** | Pintu (`s_pintu.jpg`) dengan perkataan berlubang (cth. `__emah` + gambar). 3 kunci (`s_kunci.jpg`) berlabel opsyen (`isi[].opsyen` / `senarai[].opsyen`). Kunci betul → pintu terbuka (animasi) → perkataan dibaca. |
| K10 | **Mesin Imbuhan** | Kata dasar masuk corong mesin (`s_mesin.jpg`). Tiga butang imbuhan pada mesin (betul + 2 lain). Ketik betul → hasil (cth. *membaca*) keluar di tali sawat. Guna `imbuhan`. |
| K11 | **Kereta Api Ayat** | Gambar ayat (K11). Kepala kereta + slot gerabak = bilangan perkataan. Gerabak berlabel perkataan (dikocok). Ketik ikut urutan → bersambung. Lengkap → ayat dibaca, kereta bergerak. |
| K12 | **Detektif Cerita** | Petikan (`petikan`) dipapar sebagai baris yang boleh diketik, dengan gambar. Soalan dipapar. Murid ketik **baris dalam petikan** yang mengandungi jawapan (kanta `s_kanta.jpg` mengikut kursor/ketikan dan menyerlah baris). Betul → jawapan diserlah. Untuk soalan "Adakah …" baris yang menjawab ialah baris berkaitan. Tentukan baris jawapan dengan mencari baris yang mengandungi perkataan kunci dari `opsyen[0]` (abaikan huruf besar/kecil; untuk "Ya, bas ini baru." gunakan baris yang mengandungi "baru"). |

## 9. Gaya visual
- Ceria, terang, mesra kanak-kanak, seperti contoh "Wira Cilik Bahasa" dan "Jom Baca": kecerunan langit (biru muda → hijau muda), kad putih bersudut bulat besar (24px), bayang lembut, butang "3D" (bayang bawah), animasi kecil (lantun, denyut, goyang) tetapi **tidak keterlaluan**.
- Fon: 'Andika' untuk teks bacaan (huruf a/g satu tingkat — penting untuk murid), 'Baloo 2' untuk tajuk.
- Sprite berlatar putih: gunakan `mix-blend-mode: multiply` di atas latar cerah supaya putih hilang.
- `prefers-reduced-motion`: kurangkan animasi.

## 10. PWA
`manifest.webmanifest` (nama "Pulau Membaca", warna tema #ffb703, ikon 192/512, `start_url: "./"`, display standalone). `sw.js`: cache-first untuk fail statik (html, css, js, assets), network-first untuk `index.html`; JANGAN cache permintaan ke `script.google.com`. Butang "📲 Pasang aplikasi" di peta menggunakan `beforeinstallprompt` (sembunyi jika tiada).

## 11. Ujian (Claude akan semak)
Untuk setiap K: Tutorial boleh dilalui sampai habis; Latihan boleh dijawab sampai keputusan (`window.soalanSemasa`); Game boleh dimainkan dengan mengetik `[data-betul="1"]` berulang kali sehingga tamat dengan `GAME_UJIAN.cepat`. Tiada ralat konsol. Lebar 360px tanpa skrol mendatar.

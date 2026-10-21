Anda menyambung pembinaan versi 2 app web dalam repositori ini. Baca **docs/SPEC-v2.md** (bahagian 1, 4, 8, 9), kemudian baca js/game/asas.js dan SEMUA game sedia ada (js/game/k01-belon.js … k04-ikan.js) untuk mengikut corak, gaya dan pembantu `GameAsas` yang sama. Baca juga js/data.js untuk medan data K5–K8.

TUGASAN 4 — game K5 hingga K8 (ikut jadual SPEC bahagian 8):
- **js/game/k05-katak.js** — Katak Melompat: gambar perkataan K5 (`gambar`), sungai dengan baris batu (`s_batu.jpg`), setiap langkah 3 batu berlabel suku kata (betul + 2 pengacau dari suku kata `senarai` K5); ketik batu suku kata seterusnya → katak (`s_katak.jpg`) melompat (animasi lengkung). Sampai seberang → perkataan dibaca, perkataan baru.
- **js/game/k06-bakul.js** — Bakul Pasar: barang/perkataan muncul (perkataan K6 dengan "ng" ATAU perkataan tanpa "ng" daripada `gambar`/`senarai` K2 dan K4 sebagai pengacau, ~50:50; gambar jika ada). Dua bakul (`s_bakul.jpg`) berlabel "ada **ng**" dan "tiada **ng**". Ketik bakul betul → barang jatuh masuk bakul.
- **js/game/k07-bot.js** — Bot ke Pulau: tiga pulau (`s_pulau.jpg`) berlabel ai / au / oi. Bot (`s_bot.jpg`) membawa perkataan K7 (`gambar` + `senarai`, papar gambar jika ada; serlah diftong hanya SELEPAS dijawab). Ketik pulau betul → bot belayar ke pulau itu.
- **js/game/k08-bunga.js** — Roda Bunga: bunga besar CSS (kelopak bulat berwarna mengelilingi tengah). Arahan "Bina perkataan: <gambar>" untuk perkataan K8 (`gambar`); pecahkan perkataan kepada suku kata (data guna '-'), tunjuk slot; kelopak = suku kata perkataan itu + pengacau dari suku kata K8 lain (5–6 kelopak). Ketik kelopak mengikut urutan → suku kata terbang ke slot. Lengkap → perkataan dibaca, bunga berputar.

Setiap game: guna `GAME['Kn'] = { nama, latar, arahan, mula, henti }` dan pembantu `GameAsas` sama seperti game K1–K4; `GameAsas.soalanBaru(jawapan)` dan `GameAsas.tandaBetul(el)` WAJIB untuk elemen ketikan seterusnya; soalan berulang rawak hingga masa tamat; bersihkan pemasa dalam `henti()`; mesra 360px.
Kemas kini index.html untuk memuat keempat-empat fail baru selepas k04-ikan.js.

Peraturan SPEC bahagian 1 kekal. Jalankan `node --check` pada fail yang diubah. Jangan buat commit git. Akhiri dengan ringkasan pendek.

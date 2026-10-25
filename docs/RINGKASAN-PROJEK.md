# Ringkasan Projek: Pulau Membaca (Mari Membaca v2)

Game web untuk literasi Bahasa Melayu (LINUS) bagi murid sekolah rendah. Ia dibina berdasarkan modul **Bahan Baca K1–K12**.

- **Laman langsung:** https://zabidisukuan.github.io/mari-membaca/
- **Kod sumber:** https://github.com/zabidisukuan/mari-membaca (branch `main`)
- **Link ujian:** https://zabidisukuan.github.io/mari-membaca/?kod=UJI&sekolah=SK%20Ujian&tahun=1&kelas=Ujian

---

## 1. Konsep

Murid mendaftar dan memilih watak (**Aiman** atau **Aina**). Kemudian murid mengembara di **peta pulau** yang ada 12 lokasi, iaitu satu lokasi untuk setiap konstruk. Maskot **Sang Kancil** memandu murid dengan suara.

Setiap lokasi ada 3 bahagian:

| Bahagian | Fungsi | Markah ke Google Sheet? |
|---|---|---|
| 📘 **Tutorial** | Sang Kancil menerangkan konsep langkah demi langkah, dengan suara dan animasi | Tidak |
| ✏️ **Latihan** | 8 soalan tanpa pemasa. Game dibuka apabila markah ≥ 50%. Lokasi seterusnya juga dibuka. | **Ya**, dalam bentuk peratus. Hanya markah terbaik disimpan. |
| 🎮 **Game** | Permainan bertema dengan pemasa 60 saat, kombo dan barang ganjaran untuk beg 🎒 | Tidak |

## 2. Konstruk dan game

| K | Lokasi | Kemahiran | Game |
|---|---|---|---|
| K1 | Kampung Huruf | Huruf a–z | Pecah Belon |
| K2 | Hutan Suku Kata | KV / KVKV | Ulat Lapar |
| K3 | Bukit Tiga Suku Kata | KVKVKV | Kereta Api Suku Kata |
| K4 | Kolam Ikan | KVK | Tangkap Ikan |
| K5 | Sungai Batu | KVKKV / KVKVK | Katak Melompat |
| K6 | Pasar Ng | Perkataan "ng" | Bakul Pasar |
| K7 | Pulau Diftong | Diftong ai / au / oi | Bot ke Pulau |
| K8 | Taman Bunga | Vokal berganding | Roda Bunga |
| K9 | Gua Kunci | Digraf & gabungan konsonan | Pilih Kunci |
| K10 | Kilang Imbuhan | Imbuhan | Mesin Imbuhan |
| K11 | Stesen Ayat | Membina ayat | Kereta Api Ayat |
| K12 | Istana Cerita | Kefahaman | Detektif Cerita |

**Mod guru:** ketik tajuk "Pulau Membaca" 5 kali di skrin peta untuk membuka semua lokasi.

## 3. Teknologi

- **Laman statik:** HTML, CSS dan JavaScript biasa. Tiada proses build. Dihoskan di GitHub Pages.
- **PWA:** boleh dipasang di telefon Android dan berfungsi tanpa internet selepas lawatan pertama (`manifest.webmanifest`, `sw.js`).
- **Markah:**
  - Disimpan dalam Google Sheet **"Papan Markah Game Intervensi"** melalui Google Apps Script (akaun DELIMa).
  - Satu baris bagi setiap murid dan konstruk (kod sekolah + nama + tahun + kelas). Baris hanya dikemas kini jika markah baru lebih tinggi.
  - Jika tiada internet, markah disimpan dahulu di telefon dan dihantar kemudian.
- **Kemajuan murid:** disimpan dalam pelayar (localStorage).

## 4. Siapa membina apa

| Pihak | Peranan |
|---|---|
| **Claude Code** | Merancang, menulis spesifikasi (`docs/SPEC-v2.md`), menyemak dan membaiki kod, menguji dengan Playwright, dan menerbitkan laman |
| **Gemini CLI** (kunci API berbayar) | Menulis kod app v2 mengikut tugasan dalam `docs/tugasan/` |
| **Codex CLI (ChatGPT)** | Menjana gambar: 110 gambar perkataan dan 53 aset v2 (peta, maskot, watak, sprite, ganjaran) |
| **Gemini TTS** (`gemini-3.8-flash-tts`, suara Kore) | Menjana suara perkataan, sapaan maskot, arahan game dan ayat tutorial |
| **Guru** | Merakam sendiri bunyi huruf a–z dan menyemak sebutan |

## 5. Struktur fail utama

```
index.html, css/style.css, manifest.webmanifest, sw.js
js/data.js        kandungan K1–K12 (perkataan, suku kata, ayat, petikan)
js/config.js      URL Apps Script untuk markah
js/core.js        simpanan, bunyi, suara, data murid, penghantaran markah
js/peta.js        pendaftaran, pilihan watak, peta, menu lokasi, beg
js/tutorial.js    skrip dan enjin tutorial
js/latihan.js     enjin soalan Latihan
js/game/          asas.js + 12 fail game (k01-belon.js … k12-detektif.js)
assets/img/       110 gambar perkataan
assets/v2/        aset v2 (PNG lutsinar dan peta_pulau.jpg)
assets/audio/     ±465 fail suara (.wav) + index.json
apps-script/      Code.gs (penerima markah)
tools/            skrip penjanaan gambar, suara dan pemprosesan aset
docs/             spesifikasi dan tugasan
```

## 6. Status (22 Oktober 2026)

**Sudah dibuat:**
- v2 siap dan diterbitkan di laman langsung.
- Ujian automatik lulus untuk semua 12 Tutorial, 12 Latihan dan 12 Game:
  - Tiada ralat.
  - Paparan muat pada skrin telefon selebar 390px.
  - Markah Latihan dihantar sekali sahaja.
- Data murid dari v1 masih kekal.

**Belum dibuat:**
- Guru perlu menguji di telefon dan memastikan markah Latihan sebenar masuk ke Sheet, kemudian memadam baris ujian (kod **UJI**).
- Guru perlu memadam kunci API Gemini di AI Studio selepas tiada lagi kerja penjanaan.
- `README.md` masih menerangkan v1 dan perlu dikemas kini.

## 7. Nota penting

- Seni asal modul (TcerNabila Collection) dilindungi hak cipta. Fail `.pptx` dan imej asalnya **tidak diterbitkan**. Semua gambar dalam game dijana semula.
- Jangan simpan kunci API dalam fail projek.
- Kos penjanaan: Gemini lebih kurang RM5–6 daripada kredit prabayar RM20 (auto-reload dimatikan). Codex tidak dikenakan kos tambahan.

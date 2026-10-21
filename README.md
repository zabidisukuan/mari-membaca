# Mari Membaca: Game Konstruk 1–12

Game membaca Bahasa Melayu berdasarkan *Bahan Baca K1-K12*. Ada 12 tahap (satu tahap untuk setiap konstruk) dan markah murid dihantar ke Google Sheet **Papan Markah Game Intervensi**.

## Main
Buka `index.html` melalui pelayan web. Untuk cuba di komputer sendiri:
```
python -m http.server 8000
```
Lepas tu buka http://localhost:8000.

Link boleh diisi awal untuk satu sekolah/kelas, contohnya:
`...index.html?kod=ABC1234&sekolah=SK%20Contoh&tahun=1&kelas=Bestari`

- Murid daftar sekali sahaja. Peranti yang dikongsi akan ingat senarai murid.
- Tahap seterusnya dibuka bila markah ≥ 50%. 3★ ≥ 90%, 2★ ≥ 70%, 1★ ≥ 50%.
- **Mod guru:** ketik tajuk "Mari Membaca" 5 kali untuk buka semua tahap.
- Markah = peratus soalan yang betul pada cubaan pertama. Sheet hanya menyimpan markah **terbaik**.
- Kalau tiada internet, markah disimpan dalam peranti dan dihantar bila ada internet semula.

## Google Sheet (Apps Script)
Kod ada dalam `apps-script/` dan dah dipasang pada sheet melalui `clasp`. URL web app ada dalam `js/config.js`.
Selepas mengubah `Code.gs`: `cd apps-script; clasp push; clasp redeploy <deploymentId>`.

## Aset
| Fail | Kegunaan |
|---|---|
| `js/data.js` | Semua perkataan, ayat dan petikan. Edit di sini untuk tambah atau ubah kandungan |
| `tools/gen-images.mjs` | Jana gambar dengan Codex (ChatGPT) ke `assets/img-src/` |
| `tools/resize-images.ps1` | Kecilkan gambar ke `assets/img/*.jpg` |
| `tools/gen-audio.mjs` | Jana suara dengan Gemini TTS ke `assets/audio/` (perlu `GEMINI_API_KEY`) |

Kalau gambar tiada, game papar emoji. Kalau fail suara tiada, game guna suara Bahasa Melayu pelayar (jika peranti ada), atau butang 🔊 disembunyikan. Guru boleh ganti mana-mana fail `assets/audio/<nama>.wav` dengan rakaman sendiri.

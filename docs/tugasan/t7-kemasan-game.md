Anda menyambung pembinaan versi 2 app web dalam repositori ini. Baca docs/SPEC-v2.md bahagian 1, 8 dan 9, kemudian js/game/asas.js, SEMUA fail js/game/k*.js dan bahagian game dalam css/style.css.

TUGASAN 7 — kemasan visual SEMUA 12 game (logik permainan, `GameAsas`, `data-betul` dan `window.soalanSemasa` MESTI kekal berfungsi).

Masalah yang dilihat semasa ujian pada skrin telefon 390×844 (murid Tahun 1 menggunakan jari):
1. **Sprite terlalu kecil.** Belon K1 ~30px, ikan K4, ulat/daun K2, gerabak K3 semuanya terlalu kecil untuk diketik dan dilihat.
2. **Teks pada sprite sukar dibaca.** Suku kata/perkataan ditulis terus di atas daun, gerabak, ikan, belon dan bertindih dengan garis sprite.
3. **Objek bergerak keluar skrin** (belon K1 dan ikan K4 terpotong di tepi kanan; kadang-kadang hanya 1–2 kelihatan).
4. **K7 Bot ke Pulau:** kad gambar/bot menutup tiga pulau ai/au/oi (pulau berada di y≈104 di BAWAH kad) — murid tidak nampak pilihan.
5. Kad gambar soalan terlalu tinggi sehingga kawasan permainan sempit.

Peraturan kemasan (guna untuk SEMUA game, sebaiknya melalui kelas CSS bersama dalam style.css):
- **Saiz minimum pada lebar 360px:** objek yang diketik ≥ 88px lebar (belon ~88×110, ikan ~130×80, daun ~96×96, gerabak ~110×75, batu ~100×70, kunci ~90×90, pulau ~100×90, bakul ~120×110, kelopak ≥ 72px). Gunakan `clamp()` supaya membesar pada skrin lebih besar.
- **Label teks pada sprite:** letak teks dalam "pil" putih (latar putih 92% legap, sudut bulat, bayang kecil, teks gelap tebal 22–30px, fon Andika) di TENGAH atau tepat di bawah sprite. Teks tidak boleh bertindih dengan garis sprite. Teks dalam belon K1: huruf 40px+ di tengah belon tanpa pil (belon cukup besar).
- **Objek bergerak** mesti kekal SEPENUHNYA dalam kawasan permainan: kira kedudukan mula/akhir berdasarkan lebar kawasan (`el.clientWidth`) dan saiz objek; K1: 4 belon dalam 4 lajur sama rata, naik dari bawah ke atas dalam 7–9 s, kitar semula dari bawah apabila sampai atas; K4: 3 ikan pada 3 lorong mendatar berbeza, berenang ulang-alik dalam kawasan kolam (berpatah balik di tepi, bukan hilang), kelajuan perlahan (8–10 s merentasi).
- **Susun atur menegak:** bar atas → kad gambar/soalan (maks ~30% tinggi skrin; gambar maks 150px tinggi pada telefon) → kawasan permainan mengambil baki ruang (`flex: 1`). Tiada pertindihan antara kad soalan dan pilihan. Tiada skrol mendatar pada 360px.
- **K7:** susun pulau ai / au / oi pada baris bawah (atau atas) yang JELAS kelihatan, bot + perkataan di tengah, tiada elemen menutup pulau.
- Sprite tidak bertindih antara satu sama lain di posisi statik (gunakan grid/flex dengan `gap`).
- Kekalkan maklum balas: betul = animasi gembira + hijau; salah = goyang + merah.

Selepas mengubah, semak setiap game sekurang-kurangnya dengan membaca CSS/JS dengan teliti untuk lebar 360px. Jalankan `node --check` pada fail .js yang diubah. Jangan buat commit git. Akhiri dengan ringkasan pendek perubahan bagi setiap game.

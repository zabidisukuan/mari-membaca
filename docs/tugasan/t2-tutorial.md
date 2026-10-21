Anda menyambung pembinaan versi 2 app web dalam repositori ini. Baca **docs/SPEC-v2.md** (terutama bahagian 4, 6 dan 9), kemudian baca js/core.js, js/peta.js, js/latihan.js, js/data.js dan css/style.css yang sudah wujud.

TUGASAN 2 — Tutorial untuk K1 hingga K12 + dua pembetulan peta.

A. **js/tutorial.js** (fail baru, dimuat dalam index.html selepas latihan.js dan sebelum peta.js):
   1. `TUTORIAL['K1'] … TUTORIAL['K12']` mengikut format SPEC bahagian 6, 3–5 langkah setiap satu. Kandungan mesti betul dari segi pedagogi Bahasa Melayu untuk murid Tahun 1, bahasa mudah dan mesra, dan GUNA CONTOH DARIPADA js/data.js (perkataan yang memang ada gambar dalam `gambar` supaya `gambarEl` dapat memaparkannya). Panduan isi:
      - K1 Huruf: huruf vokal a e i o u; huruf konsonan; contoh huruf yang sering keliru b / d / p / q.
      - K2 Suku kata KV: konsonan + vokal = suku kata (b+a=ba, k+u=ku); dua suku kata = perkataan (bu+ku=buku); baca 'bu-ku', 'ka-ki'.
      - K3 KVKVKV: tiga suku kata (ke+la+pa=kelapa); demo perkataan 'to-ma-to'.
      - K4 KVK: konsonan-vokal-konsonan dibaca sekali (b+a+s=bas); demo perkataan 'bas', 'jam'.
      - K5 KVKKV & KVKVK: suku kata tertutup (lam+pu=lampu, ja+rum=jarum); demo 'bis-kut'.
      - K6 "ng": "ng" ialah satu bunyi; serlah 'pisang', 'udang', 'jagung'.
      - K7 Diftong ai, au, oi: serlah 'misai' (ai), 'pisau' (au), 'koboi' (oi).
      - K8 Vokal berganding: dua vokal bersebelahan dibaca berasingan (bu+ah=buah, di+a=dia); demo perkataan 'bu-a-ya'.
      - K9 Digraf & konsonan bergabung: ng/ny/sy/kh (serlah 'khemah', 'syampu'), konsonan bergabung kr/tr/st (serlah 'krayon', 'troli').
      - K10 Imbuhan: kata dasar + imbuhan (baca+me- = membaca, main+ber- = bermain, masak+-an = masakan).
      - K11 Ayat: baca perkataan demi perkataan; demo ayat 'Mereka sedang membaca buku cerita.' (img 'ayat01'); ayat bermula huruf besar dan berakhir noktah.
      - K12 Kefahaman: baca petikan dengan teliti, cari jawapan dalam petikan; demo petikan indeks 0.
   2. `mainTutorial(t)`: skrin tutorial seperti SPEC bahagian 6 (maskot `assets/v2/kancil_tunjuk.jpg`, belon kata + butang 🔊 menggunakan `Suara.butang(teks)`, `Suara.main(teks)` automatik bila langkah dibuka, kawasan demo besar, ◀ Kembali / Seterusnya ▶, titik kemajuan, butang ✕ kembali ke menu lokasi). Langkah terakhir: butang "✏️ Mari cuba Latihan" yang memanggil `mainLatihan(t)`.
   3. Semua jenis demo dalam SPEC bahagian 6 (`huruf`, `cantum`, `perkataan`, `serlah`, `imbuhan`, `ayat`, `petikan`) dengan animasi CSS yang jelas dan perlahan (sesuai kanak-kanak); ketik demo = ulang animasi + suara. Untuk `cantum` bunyikan setiap bahagian (`Suara.main(bahagian)`) kemudian hasil. Untuk `ayat` serlah perkataan satu demi satu (karaoke, ~600ms setiap perkataan) dan mainkan `Suara.main(s)`.
   4. Sambungkan butang Tutorial dalam menu lokasi (peta.js) supaya memanggil `mainTutorial(t)` (mesej "Akan datang" tidak lagi diperlukan untuk tutorial).
   5. Tetapkan `window.tutorialSemasa = { langkah: i, jumlah: n }` setiap kali langkah berubah (untuk ujian automatik).

B. **Pembetulan peta (js/peta.js + css/style.css)**:
   1. Avatar watak di atas peta kini kelihatan dengan kotak putih (mix-blend-mode tidak berkesan di atas peta berwarna). Paparkan avatar di dalam **lencana bulat putih** (border tebal berwarna, bayang) seperti token permainan papan, dengan sedikit animasi lantun ketika berdiri.
   2. Label lokasi pada peta: tunjuk **nama lokasi** (cth. "Kampung Huruf") di bawah kod K, dalam teks kecil yang masih boleh dibaca pada lebar 360px; lokasi terbuka tunjuk ikon lokasi (`lok_kNN.jpg` dalam bulatan putih) bukan hanya kunci.

Peraturan SPEC bahagian 1 kekal (tiada framework, ketik sahaja, jangan ubah fail dilarang). Selepas siap jalankan `node --check` pada setiap fail .js yang diubah. Jangan buat commit git. Akhiri dengan ringkasan pendek.

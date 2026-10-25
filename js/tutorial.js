// Modul Tutorial K1–K12 untuk Pulau Membaca (Mari Membaca v2).
// Mengandungi TUTORIAL['K1'..'K12'], renderer demo interaktif, dan mainTutorial(t).

const TUTORIAL = {
  K1: {
    pengenalan: 'Kenal Huruf Vokal dan Konsonan',
    langkah: [
      {
        teks: 'Huruf vokal ada 5: a, e, i, o, u. Mari sebut huruf vokal bersama-sama!',
        demo: { jenis: 'huruf', huruf: ['a', 'e', 'i', 'o', 'u'] },
      },
      {
        teks: 'Huruf-huruf lain dipanggil huruf konsonan. Contohnya b, c, d, f, g.',
        demo: { jenis: 'huruf', huruf: ['b', 'c', 'd', 'f', 'g'] },
      },
      {
        teks: 'Awas! Jangan keliru dengan huruf yang bentuknya hampir sama seperti b, d, p, dan q.',
        demo: { jenis: 'huruf', huruf: ['b', 'd', 'p', 'q'] },
      },
    ],
  },
  K2: {
    pengenalan: 'Suku Kata KV',
    latar: 'latar_k02', // assets/v2/latar_k02.jpg (Codex)
    langkah: [
      {
        teks: 'Huruf konsonan dan vokal bercantum menjadi suku kata. Contohnya, b + a = ba.',
        demo: { jenis: 'cantum', bahagian: ['b', 'a'], hasil: 'ba' },
      },
      {
        teks: 'Mari cantumkan suku kata lain! k + u = ku.', // suara: rakaman guru (ayat sahaja)
        // sebut: rakaman guru membatang (k, u, ku); nama huruf K1 ("kei", "yu") berbunyi seperti "Q" jika berturutan
        demo: { jenis: 'cantum', bahagian: ['k', 'u'], hasil: 'ku', sebut: ['batang k', 'batang u', 'batang ku'] },
      },
      {
        teks: 'Dua suku kata bercantum menjadi satu perkataan: bu + ku = buku.',
        demo: { jenis: 'cantum', bahagian: ['bu', 'ku'], hasil: 'buku' },
      },
      {
        teks: 'Mari sebut dan baca perkataan bu-ku!',
        demo: { jenis: 'perkataan', w: 'bu-ku' },
      },
      {
        teks: 'Satu lagi contoh perkataan dua suku kata: ka-ki.',
        demo: { jenis: 'perkataan', w: 'ka-ki' },
      },
    ],
  },
  K3: {
    pengenalan: 'Perkataan KVKVKV',
    langkah: [
      {
        teks: 'Perkataan ini terbina daripada tiga suku kata: ke + la + pa = kelapa.', // suara: rakaman guru (ayat sahaja)
        demo: { jenis: 'cantum', bahagian: ['ke', 'la', 'pa'], hasil: 'kelapa', sebut: ['batang ke', 'batang la', 'batang pa', 'batang kelapa'] },
      },
      {
        teks: 'Mari sebut dan baca perkataan ke-la-pa!',
        demo: { jenis: 'perkataan', w: 'ke-la-pa', sebut: ['batang ke', 'batang la', 'batang pa', 'batang kelapa'] },
      },
      {
        teks: 'Lihat contoh perkataan tiga suku kata ini pula: to-ma-to.',
        demo: { jenis: 'perkataan', w: 'to-ma-to' },
      },
    ],
  },
  K4: {
    pengenalan: 'Perkataan KVK',
    langkah: [
      {
        teks: 'Suku kata KVK (Konsonan-Vokal-Konsonan) mempunyai tiga huruf dan dibaca satu bunyi.',
        demo: { jenis: 'cantum', bahagian: ['b', 'a', 's'], hasil: 'bas' },
      },
      {
        teks: 'Mari sebut dan baca perkataan bas!',
        demo: { jenis: 'perkataan', w: 'bas' },
      },
      {
        teks: 'Contoh lain perkataan KVK: jam.',
        demo: { jenis: 'perkataan', w: 'jam' },
      },
    ],
  },
  K5: {
    pengenalan: 'Perkataan KVKKV dan KVKVK',
    langkah: [
      {
        teks: 'Perkataan ini gabungan suku kata terbuka dan suku kata tertutup.',
        demo: { jenis: 'cantum', bahagian: ['lam', 'pu'], hasil: 'lampu' },
      },
      {
        teks: 'Mari sebut dan baca perkataan ja-rum!',
        demo: { jenis: 'perkataan', w: 'ja-rum' },
      },
      {
        teks: 'Mari cuba baca perkataan bis-kut!',
        demo: { jenis: 'perkataan', w: 'bis-kut' },
      },
    ],
  },
  K6: {
    pengenalan: 'Perkataan "ng"',
    langkah: [
      {
        teks: 'Huruf "n" dan "g" apabila bersama-sama menghasilkan satu bunyi "ng".',
        demo: { jenis: 'serlah', w: 'pi-sang', bahagian: 'ng' },
      },
      {
        teks: 'Lihat bunyi "ng" di hujung perkataan u-dang.',
        demo: { jenis: 'serlah', w: 'u-dang', bahagian: 'ng' },
      },
      {
        teks: 'Mari sebut perkataan ja-gung bersama Sang Kancil!',
        demo: { jenis: 'perkataan', w: 'ja-gung' },
      },
    ],
  },
  K7: {
    pengenalan: 'Diftong ai, au, oi',
    langkah: [
      {
        teks: 'Diftong ialah dua huruf vokal yang dibaca sebagai satu geluncuran bunyi. Contohnya "ai" dalam mi-sai.',
        demo: { jenis: 'serlah', w: 'mi-sai', bahagian: 'ai' },
      },
      {
        teks: 'Diftong "au" seperti dalam perkataan pi-sau.',
        demo: { jenis: 'serlah', w: 'pi-sau', bahagian: 'au' },
      },
      {
        teks: 'Diftong "oi" seperti dalam perkataan ko-boi.',
        demo: { jenis: 'serlah', w: 'ko-boi', bahagian: 'oi' },
      },
    ],
  },
  K8: {
    pengenalan: 'Vokal Berganding',
    langkah: [
      {
        teks: 'Vokal berganding ialah dua vokal bersebelahan tetapi dibaca berasingan.',
        demo: { jenis: 'cantum', bahagian: ['bu', 'ah'], hasil: 'buah' },
      },
      {
        teks: 'Dua suku kata bercantum: di + a = dia.',
        demo: { jenis: 'cantum', bahagian: ['di', 'a'], hasil: 'dia' },
      },
      {
        teks: 'Mari sebut dan baca perkataan bu-a-ya!',
        demo: { jenis: 'perkataan', w: 'bu-a-ya' },
      },
    ],
  },
  K9: {
    pengenalan: 'Digraf dan Konsonan Bergabung',
    langkah: [
      {
        teks: 'Digraf ialah dua konsonan berturut-turut yang menyebut satu bunyi. Contohnya digraf "kh" dalam khemah.',
        demo: { jenis: 'serlah', w: 'khemah', bahagian: 'kh' },
      },
      {
        teks: 'Lihat digraf "sy" dalam perkataan syampu.',
        demo: { jenis: 'serlah', w: 'syampu', bahagian: 'sy' },
      },
      {
        teks: 'Konsonan bergabung pula menyebut dua bunyi konsonan rapat. Contohnya "kr" dalam krayon.',
        demo: { jenis: 'serlah', w: 'krayon', bahagian: 'kr' },
      },
      {
        teks: 'Lihat konsonan bergabung "tr" dalam perkataan troli.',
        demo: { jenis: 'serlah', w: 'troli', bahagian: 'tr' },
      },
    ],
  },
  K10: {
    pengenalan: 'Imbuhan',
    langkah: [
      {
        teks: 'Kata dasar boleh ditambah imbuhan di hadapan, seperti baca + me- = membaca.',
        demo: { jenis: 'imbuhan', dasar: 'baca', imbuhan: 'me-', hasil: 'membaca' },
      },
      {
        teks: 'Mari cuba imbuhan ber- dengan kata dasar main: main + ber- = bermain.',
        demo: { jenis: 'imbuhan', dasar: 'main', imbuhan: 'ber-', hasil: 'bermain' },
      },
      {
        teks: 'Imbuhan -an juga boleh ditambah di belakang kata dasar: masak + -an = masakan.',
        demo: { jenis: 'imbuhan', dasar: 'masak', imbuhan: '-an', hasil: 'masakan' },
      },
    ],
  },
  K11: {
    pengenalan: 'Membaca Ayat',
    langkah: [
      {
        teks: 'Ayat terbina daripada susunan perkataan yang memberi maksud yang lengkap.',
        demo: { jenis: 'ayat', s: 'Mereka sedang membaca buku cerita.', img: 'ayat01' },
      },
      {
        teks: 'Ayat sentiasa bermula dengan huruf besar dan diakhiri dengan titik (noktah).',
        demo: { jenis: 'ayat', s: 'Asrul mempunyai lori mainan berwarna kuning.', img: 'ayat05' },
      },
      {
        teks: 'Mari baca ayat ini perkataan demi perkataan!',
        demo: { jenis: 'ayat', s: 'Amirah suka menolong ibunya memasak di dapur.', img: 'ayat06' },
      },
    ],
  },
  K12: {
    pengenalan: 'Kefahaman',
    langkah: [
      {
        teks: 'Baca petikan dengan teliti untuk memahami maksud cerita.',
        demo: { jenis: 'petikan', indeks: 0 },
      },
      {
        teks: 'Jawapan bagi setiap soalan berada di dalam ayat petikan. Cari perkataan kunci!',
        demo: { jenis: 'petikan', indeks: 0 },
      },
    ],
  },
};

// Cari data gambar & emoji daripada DATA.tahap
function cariGambar(w) {
  const kata = typeof U !== 'undefined' && U.kata ? U.kata(w) : String(w || '').replace(/-/g, '');
  if (typeof DATA !== 'undefined' && DATA.tahap) {
    for (const t of DATA.tahap) {
      if (t.gambar) {
        const g = t.gambar.find((x) => (U ? U.kata(x.w) : x.w.replace(/-/g, '')) === kata || x.img === kata);
        if (g) return { img: g.img || (U ? U.kata(g.w) : g.w.replace(/-/g, '')), e: g.e };
      }
      if (t.isi) {
        const g = t.isi.find((x) => (U ? U.kata(x.w) : x.w.replace(/-/g, '')) === kata || x.img === kata);
        if (g) return { img: g.img || (U ? U.kata(g.w) : g.w.replace(/-/g, '')), e: g.e };
      }
      if (t.ayat) {
        const g = t.ayat.find((x) => x.img === kata);
        if (g) return { img: g.img, e: g.e };
      }
    }
  }
  // Tiada gambar untuk perkataan ini: jangan teka nama fail (elak 404), papar emoji sahaja
  return { img: null, e: '✨' };
}

// Latar bergambar tahap (TUTORIAL[id].latar) untuk skrin Tutorial & Latihan; '' jika tiada
function htmlLatar(id) {
  const l = TUTORIAL[id] && TUTORIAL[id].latar;
  return l ? `<div class="latar-tahap" style="background-image: url('assets/v2/${l}.jpg');"></div>` : '';
}

// Sebut senarai suku kata satu demi satu; suku kata seterusnya hanya bermula selepas suara sebelumnya habis
// (masa tetap memotong suara yang panjang). Rantaian terputus sendiri jika suara dihentikan (tukar langkah / ulang).
function mainBerturut(timernya, senarai, serlah, akhir, i = 0) {
  if (i >= senarai.length) return akhir();
  serlah(i);
  Suara.main(senarai[i], () => {
    timernya.push(setTimeout(() => mainBerturut(timernya, senarai, serlah, akhir, i + 1), 250));
  });
}

// Render pelbagai jenis demo interaktif
function renderDemo(demo, el, timernya) {
  el.innerHTML = '';
  if (!demo) return;

  const bersihkanPentasTimer = () => {
    timernya.forEach((tid) => clearTimeout(tid));
    timernya.length = 0;
  };

  const kad = U.el('div', 'kad-demo-inner');
  // Fungsi main demo (jika ada) dipulangkan supaya tutorial boleh memainkannya selepas Kancil habis bercakap
  let mainkan = null;

  switch (demo.jenis) {
    case 'huruf': {
      const gred = U.el('div', 'huruf-grid-demo');
      demo.huruf.forEach((h) => {
        const b = U.el('button', 'huruf-kad-demo', h);
        b.onclick = () => {
          b.classList.add('denyut');
          setTimeout(() => b.classList.remove('denyut'), 400);
          Suara.main(h);
        };
        gred.appendChild(b);
      });
      const butangUlang = U.el('button', 'kecil btn-ulang-demo', '🔊 Sebut Semua');
      butangUlang.onclick = () => {
        bersihkanPentasTimer();
        demo.huruf.forEach((h, k) => {
          const t = setTimeout(() => {
            if (!el.isConnected) return;
            const btns = gred.querySelectorAll('.huruf-kad-demo');
            if (btns[k]) {
              btns[k].classList.add('denyut');
              setTimeout(() => btns[k].classList.remove('denyut'), 400);
            }
            Suara.main(h);
          }, k * 700);
          timernya.push(t);
        });
      };
      kad.append(gred, butangUlang);
      break;
    }

    case 'cantum': {
      const wrap = U.el('div', 'cantum-demo-wrap');
      const kepinganBox = U.el('div', 'kepingan-box');
      demo.bahagian.forEach((p, idx) => {
        if (idx > 0) kepinganBox.appendChild(U.el('span', 'simbol-tambah', '+'));
        const k = U.el('span', 'kepingan-demo', p);
        kepinganBox.appendChild(k);
      });
      const sama = U.el('span', 'simbol-sama', '=');
      const hasilBox = U.el('div', 'hasil-demo-box', demo.hasil);

      wrap.append(kepinganBox, sama, hasilBox);

      const mainkanAnimasi = () => {
        bersihkanPentasTimer();
        wrap.classList.remove('bercantum');
        void wrap.offsetWidth;
        // demo.sebut (pilihan): suara khas untuk setiap bahagian + hasil, menggantikan suara biasa
        const sebut = demo.sebut || [...demo.bahagian, demo.hasil];
        mainBerturut(timernya, sebut.slice(0, -1), (idx) => {
          const elP = kepinganBox.querySelectorAll('.kepingan-demo')[idx];
          if (elP) {
            elP.classList.add('denyut');
            setTimeout(() => elP.classList.remove('denyut'), 400);
          }
        }, () => {
          if (!el.isConnected) return;
          wrap.classList.add('bercantum');
          hasilBox.classList.add('pop');
          setTimeout(() => hasilBox.classList.remove('pop'), 500);
          Suara.main(sebut[sebut.length - 1]);
        });
      };

      wrap.onclick = mainkan = mainkanAnimasi;
      kad.append(wrap, U.el('p', 'petunjuk-ketik', '👇 Ketik untuk ulang animasi'));
      break;
    }

    case 'perkataan': {
      const kataLengkap = U.kata(demo.w);
      const sukuKata = U.suku(demo.w);
      const gInfo = cariGambar(kataLengkap);

      const wrap = U.el('div', 'perkataan-demo-wrap');
      const imgBox = gambarEl(gInfo.img, gInfo.e);

      const sukuRow = U.el('div', 'suku-baris-demo');
      sukuKata.forEach((s) => {
        sukuRow.appendChild(U.el('span', 'suku-tag-demo', s));
      });

      const kataLengkapBox = U.el('div', 'kata-lengkap-demo', kataLengkap);

      wrap.append(imgBox, sukuRow, kataLengkapBox);

      const mainkanAnimasi = () => {
        bersihkanPentasTimer();
        kataLengkapBox.classList.remove('serlah-kata');
        sukuRow.querySelectorAll('.suku-tag-demo').forEach((x) => x.classList.remove('aktif'));
        // demo.sebut (pilihan): suara khas (rakaman guru) untuk setiap suku kata + perkataan
        const sebut = demo.sebut || [...sukuKata, kataLengkap];
        mainBerturut(timernya, sebut.slice(0, -1), (idx) => {
          const tags = sukuRow.querySelectorAll('.suku-tag-demo');
          if (tags[idx]) tags[idx].classList.add('aktif');
        }, () => {
          if (!el.isConnected) return;
          kataLengkapBox.classList.add('serlah-kata');
          Suara.main(sebut[sebut.length - 1]);
        });
      };

      wrap.onclick = mainkan = mainkanAnimasi;
      kad.append(wrap, U.el('p', 'petunjuk-ketik', '👇 Ketik untuk ulang'));
      break;
    }

    case 'serlah': {
      const kataLengkap = U.kata(demo.w);
      const gInfo = cariGambar(kataLengkap);

      const wrap = U.el('div', 'serlah-demo-wrap');
      const imgBox = gambarEl(gInfo.img, gInfo.e);

      const idx = kataLengkap.indexOf(demo.bahagian);
      let htmlPerkataan = kataLengkap;
      if (idx !== -1) {
        const awal = kataLengkap.slice(0, idx);
        const akhir = kataLengkap.slice(idx + demo.bahagian.length);
        htmlPerkataan = `${awal}<span class="serlah-bunyi">${demo.bahagian}</span>${akhir}`;
      } else {
        htmlPerkataan = `<span class="serlah-bunyi">${kataLengkap}</span>`;
      }

      const teksBox = U.el('div', 'perkataan-serlah-box', htmlPerkataan);

      wrap.append(imgBox, teksBox);

      const mainkanAnimasi = () => {
        bersihkanPentasTimer();
        const spanB = teksBox.querySelector('.serlah-bunyi');
        if (spanB) {
          spanB.classList.remove('denyut');
          void spanB.offsetWidth;
          spanB.classList.add('denyut');
        }
        Suara.main(kataLengkap);
      };

      wrap.onclick = mainkan = mainkanAnimasi;
      kad.append(wrap, U.el('p', 'petunjuk-ketik', '👇 Ketik untuk dengar'));
      break;
    }

    case 'imbuhan': {
      const gInfo = cariGambar(demo.hasil);
      const wrap = U.el('div', 'imbuhan-demo-wrap');
      if (gInfo && gInfo.img) wrap.appendChild(gambarEl(gInfo.img, gInfo.e));

      const formulaBox = U.el('div', 'formula-imbuhan');
      if (demo.imbuhan.startsWith('-')) {
        formulaBox.innerHTML = `<span>${demo.dasar}</span><span class="tanda">+</span><span class="imb-tag">${demo.imbuhan}</span><span class="tanda">=</span><span class="hasil-tag">${demo.hasil}</span>`;
      } else {
        formulaBox.innerHTML = `<span class="imb-tag">${demo.imbuhan}</span><span class="tanda">+</span><span>${demo.dasar}</span><span class="tanda">=</span><span class="hasil-tag">${demo.hasil}</span>`;
      }

      wrap.appendChild(formulaBox);

      const mainkanAnimasi = () => {
        bersihkanPentasTimer();
        const h = formulaBox.querySelector('.hasil-tag');
        if (h) {
          h.classList.remove('pop');
          void h.offsetWidth;
          h.classList.add('pop');
        }
        Suara.main(demo.hasil);
      };

      wrap.onclick = mainkan = mainkanAnimasi;
      kad.append(wrap, U.el('p', 'petunjuk-ketik', '👇 Ketik untuk dengar'));
      break;
    }

    case 'ayat': {
      const wrap = U.el('div', 'ayat-demo-wrap');
      const imgBox = gambarEl(demo.img, '📖');

      const perkataanList = demo.s.split(' ');
      const ayatBox = U.el('div', 'ayat-teks-box');
      perkataanList.forEach((w) => {
        ayatBox.appendChild(U.el('span', 'kata-ayat-demo', w + ' '));
      });

      wrap.append(imgBox, ayatBox);

      const mainkanKaraoke = () => {
        bersihkanPentasTimer();
        const kataSpans = ayatBox.querySelectorAll('.kata-ayat-demo');
        kataSpans.forEach((x) => x.classList.remove('aktif'));
        let delay = 0;
        perkataanList.forEach((_, idx) => {
          const t = setTimeout(() => {
            if (!el.isConnected) return;
            kataSpans.forEach((x) => x.classList.remove('aktif'));
            if (kataSpans[idx]) kataSpans[idx].classList.add('aktif');
          }, delay);
          timernya.push(t);
          delay += 600;
        });

        const tAkhir = setTimeout(() => {
          if (!el.isConnected) return;
          kataSpans.forEach((x) => x.classList.add('aktif'));
          Suara.main(demo.s);
        }, delay);
        timernya.push(tAkhir);
      };

      wrap.onclick = mainkan = mainkanKaraoke;
      kad.append(wrap, U.el('p', 'petunjuk-ketik', '👇 Ketik untuk ulang bacaan'));
      break;
    }

    case 'petikan': {
      const p = DATA.tahap[11].petikan[demo.indeks || 0];
      if (!p) break;

      const wrap = U.el('div', 'petikan-demo-wrap');
      const pBox = U.el('div', 'petikan-kandungan');
      pBox.appendChild(gambarEl(p.img, p.e));

      const teksDiv = U.el('div', 'petikan-teks-demo');
      const jawapan = p.soalan[0].opsyen[0];
      p.teks.forEach((line) => {
        const pLine = U.el('p', 'baris-demo');
        pLine.textContent = line;
        if (line.toLowerCase().includes('bapa abu') || line.toLowerCase().includes('baru beli') || line.toLowerCase().includes('kuning')) {
          if (line.toLowerCase().includes('bapa abu')) {
            pLine.classList.add('baris-jawapan');
            pLine.setAttribute('data-nota', 'Jawapan di sini! 🔍');
          }
        }
        teksDiv.appendChild(pLine);
      });

      pBox.appendChild(teksDiv);

      const soalanBox = U.el('div', 'soalan-demo-box');
      soalanBox.innerHTML = `
        <p class="soalan-tajuk">❓ <b>Soalan:</b> ${esc(p.soalan[0].q)}</p>
        <div class="jawapan-serlah">✅ <b>Jawapan:</b> ${esc(jawapan)}</div>
      `;

      wrap.append(pBox, soalanBox);

      const mainkanAnimasi = () => {
        bersihkanPentasTimer();
        const jEl = pBox.querySelector('.baris-jawapan');
        if (jEl) {
          jEl.classList.add('denyut');
          setTimeout(() => jEl.classList.remove('denyut'), 600);
        }
        Suara.main(jawapan);
      };

      wrap.onclick = mainkan = mainkanAnimasi;
      kad.append(wrap, U.el('p', 'petunjuk-ketik', '👇 Ketik untuk serlahkan jawapan'));
      break;
    }
  }

  el.appendChild(kad);
  return mainkan;
}

// Fungsi utama skrin tutorial
function mainTutorial(t) {
  const tut = TUTORIAL[t.id];
  if (!tut || !tut.langkah || !tut.langkah.length) {
    alert('Tutorial tidak dijumpai.');
    skrinPeta();
    return;
  }

  let i = 0;
  const n = tut.langkah.length;
  let timernya = [];

  function bersihkanTimer() {
    timernya.forEach((tid) => clearTimeout(tid));
    timernya = [];
  }

  function tunjukLangkah(idx) {
    bersihkanTimer();
    i = Math.max(0, Math.min(idx, n - 1));
    window.tutorialSemasa = { langkah: i, jumlah: n };

    const item = tut.langkah[i];

    skrin(`
      <div class="tutorial-wrapper${tut.latar ? ' ada-latar' : ''}">
        ${htmlLatar(t.id)}
        <header class="atas main">
          <button id="tutKeluar" class="kecil" aria-label="Keluar">✕</button>

          <div class="titik-kemajuan">
            ${tut.langkah.map((_, k) => `<span class="titik ${k === i ? 'aktif' : ''}"></span>`).join('')}
          </div>

          <span class="label">${t.id} Tutorial</span>
        </header>

        <main class="tutorial-kandungan">
          <div class="maskot-sapa-box tutorial-maskot">
            <div class="kancil-img-box">
              ${imgV2('kancil_tunjuk', '🦌', 'kancil-img')}
            </div>
            <div class="belon-kata">
              <p id="tutTeks">${esc(item.teks)}</p>
              <div id="tutSuaraContainer"></div>
            </div>
          </div>

          <div class="demo-pentas" id="demoPentas"></div>
        </main>

        <footer class="tutorial-nav">
          <button id="tutSebelum" class="besar kedua" ${i === 0 ? 'disabled' : ''}>◀ Kembali</button>
          ${i < n - 1
            ? `<button id="tutSeterusnya" class="besar">Seterusnya ▶</button>`
            : `<button id="tutLatihan" class="besar highlight">✏️ Mari cuba Latihan</button>`
          }
        </footer>
      </div>
    `);

    const sBtn = Suara.butang(item.teks);
    const container = document.getElementById('tutSuaraContainer');
    if (container) container.appendChild(sBtn);

    // Demo dimainkan hanya selepas penerangan Kancil tamat supaya suara tidak bertindih
    const pentas = document.getElementById('demoPentas');
    const mainkanDemo = pentas ? renderDemo(item.demo, pentas, timernya) : null;
    Suara.main(item.teks, () => {
      if (mainkanDemo && pentas.isConnected) mainkanDemo();
    });

    document.getElementById('tutKeluar').onclick = () => {
      bersihkanTimer();
      if (typeof menuLokasi === 'function') {
        menuLokasi(t);
      } else {
        skrinPeta();
      }
    };

    const btnSebelum = document.getElementById('tutSebelum');
    if (btnSebelum) btnSebelum.onclick = () => tunjukLangkah(i - 1);

    const btnSeterusnya = document.getElementById('tutSeterusnya');
    if (btnSeterusnya) btnSeterusnya.onclick = () => tunjukLangkah(i + 1);

    const btnLatihan = document.getElementById('tutLatihan');
    if (btnLatihan) {
      btnLatihan.onclick = () => {
        bersihkanTimer();
        mainLatihan(t);
      };
    }
  }

  tunjukLangkah(0);
}

// Modul Peta Pulau Membaca, Skrin Daftar, Pilih Watak, Menu Lokasi & Beg Ganjaran.

const LOKASI_INFO = [
  { id: 'K1', nama: 'Kampung Huruf', img: 'lok_k01', emoji: '🏠', barang: 'g_k01', namaBarang: 'Pensel Ajaib', emojiBarang: '✏️', sapaan: 'Selamat datang ke Kampung Huruf! Mari mengenal huruf.' },
  { id: 'K2', nama: 'Hutan Suku Kata', img: 'lok_k02', emoji: '🌲', barang: 'g_k02', namaBarang: 'Daun Emas', emojiBarang: '🍃', sapaan: 'Selamat datang ke Hutan Suku Kata! Mari membaca suku kata V+KV.' },
  { id: 'K3', nama: 'Bukit Tiga Suku', img: 'lok_k03', emoji: '⛰️', barang: 'g_k03', namaBarang: 'Tiket Emas', emojiBarang: '🎟️', sapaan: 'Selamat datang ke Bukit Tiga Suku! Mari membaca perkataan V+KV+KV.' },
  { id: 'K4', nama: 'Kolam Ikan', img: 'lok_k04', emoji: '🐟', barang: 'g_k04', namaBarang: 'Piala Ikan Emas', emojiBarang: '🏆', sapaan: 'Selamat datang ke Kolam Ikan! Mari membaca perkataan KVK.' },
  { id: 'K5', nama: 'Sungai Batu', img: 'lok_k05', emoji: '🏞️', barang: 'g_k05', namaBarang: 'Permata Biru', emojiBarang: '💎', sapaan: 'Selamat datang ke Sungai Batu! Mari membaca perkataan KV+KVK.' },
  { id: 'K6', nama: 'Pasar Ng', img: 'lok_k06', emoji: '🏪', barang: 'g_k06', namaBarang: 'Bakul Buah', emojiBarang: '🧺', sapaan: 'Selamat datang ke Pasar Ng! Mari membaca perkataan yang mengandungi ng.' },
  { id: 'K7', nama: 'Pulau Diftong', img: 'lok_k07', emoji: '🏝️', barang: 'g_k07', namaBarang: 'Kulit Kerang', emojiBarang: '🐚', sapaan: 'Selamat datang ke Pulau Diftong! Mari membaca perkataan diftong.' },
  { id: 'K8', nama: 'Taman Bunga', img: 'lok_k08', emoji: '🌺', barang: 'g_k08', namaBarang: 'Bunga Raya', emojiBarang: '🌸', sapaan: 'Selamat datang ke Taman Bunga! Mari membaca perkataan vokal berganding.' },
  { id: 'K9', nama: 'Gua Kunci', img: 'lok_k09', emoji: '🗝️', barang: 'g_k09', namaBarang: 'Kunci Emas', emojiBarang: '🔑', sapaan: 'Selamat datang ke Gua Kunci! Mari membaca perkataan digraf dan konsonan bergabung.' },
  { id: 'K10', nama: 'Kilang Imbuhan', img: 'lok_k10', emoji: '🏭', barang: 'g_k10', namaBarang: 'Gear Emas', emojiBarang: '⚙️', sapaan: 'Selamat datang ke Kilang Imbuhan! Mari membaca perkataan berimbuhan.' },
  { id: 'K11', nama: 'Stesen Ayat', img: 'lok_k11', emoji: '🚉', barang: 'g_k11', namaBarang: 'Wisel Kereta Api', emojiBarang: '🚂', sapaan: 'Selamat datang ke Stesen Ayat! Mari membaca dan menyusun ayat.' },
  { id: 'K12', nama: 'Istana Cerita', img: 'lok_k12', emoji: '🏰', barang: 'g_k12', namaBarang: 'Mahkota', emojiBarang: '👑', sapaan: 'Selamat datang ke Istana Cerita! Mari membaca petikan dan menjawab soalan.' }
];

// Koordinat (%) untuk 12 lokasi pada peta pulau
const KOORDINAT_PETA = [
  { x: 22, y: 88 }, // K1
  { x: 55, y: 81 }, // K2
  { x: 80, y: 73 }, // K3
  { x: 58, y: 65 }, // K4
  { x: 25, y: 58 }, // K5
  { x: 28, y: 46 }, // K6
  { x: 68, y: 43 }, // K7
  { x: 82, y: 32 }, // K8
  { x: 52, y: 26 }, // K9
  { x: 22, y: 20 }, // K10
  { x: 48, y: 13 }, // K11
  { x: 76, y: 7 }   // K12
];

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

// ---------- Skrin Daftar ----------
function skrinDaftar() {
  const p = new URLSearchParams(location.search);
  const m = Murid.semasa() || {};
  const nilai = (k, param) => esc(p.get(param) || m[k] || '');
  const senarai = Simpan.get('mm_senarai_murid', []);

  skrin(`
    <div class="daftar">
      <h1 class="tajuk-utama">Pulau Membaca</h1>
      <p class="sub">Pengembaraan Bahasa Melayu (Konstruk 1–12)</p>

      ${senarai.length ? `
        <div class="murid-lama">
          <p>Pilih nama anda:</p>
          <div class="chip-container">
            ${senarai.map((s, i) => `
              <button class="chip" data-i="${i}">
                👤 ${esc(s.nama)} <small>(${esc(s.tahun)} ${esc(s.kelas)})</small>
              </button>
            `).join('')}
          </div>
        </div>
        <p class="atau">atau daftar baharu:</p>
      ` : ''}

      <form id="borang" autocomplete="off">
        <label>Kod sekolah<input name="kodSekolah" required value="${nilai('kodSekolah', 'kod')}"></label>
        <label>Nama sekolah<input name="namaSekolah" required value="${nilai('namaSekolah', 'sekolah')}"></label>
        <label>Nama murid<input name="nama" required value=""></label>
        <div class="dua">
          <label>Tahun
            <select name="tahun" required>
              ${[1, 2, 3, 4, 5, 6].map((t) =>
                `<option ${String(t) === (p.get('tahun') || m.tahun || '1') ? 'selected' : ''}>${t}</option>`
              ).join('')}
            </select>
          </label>
          <label>Kelas<input name="kelas" required value="${nilai('kelas', 'kelas')}"></label>
        </div>
        <button class="besar" type="submit">Mula Pengembaraan ▶</button>
      </form>
    </div>`);

  app.querySelectorAll('.chip').forEach((b) => {
    b.onclick = () => {
      const selected = senarai[b.dataset.i];
      Murid.set(selected);
      if (!Murid.watak()) {
        skrinPilihWatak();
      } else {
        skrinPeta();
      }
    };
  });

  const borang = document.getElementById('borang');
  if (borang) {
    borang.onsubmit = (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      for (const k in f) f[k] = f[k].trim().replace(/\s+/g, ' ');
      f.kodSekolah = f.kodSekolah.toUpperCase();
      Murid.set(f);
      if (!Murid.watak()) {
        skrinPilihWatak();
      } else {
        skrinPeta();
      }
    };
  }
}

// ---------- Skrin Pilih Watak ----------
function skrinPilihWatak() {
  const m = Murid.semasa() || {};
  skrin(`
    <div class="pilih-watak">
      <h1 class="tajuk-utama">Pilih Watak Anda</h1>
      <p class="sub">Hai ${esc(m.nama || 'Kawan')}, siapakah watak pilihan anda?</p>
      <div class="watak-container">
        <button class="watak-card" data-watak="aiman">
          <div class="watak-img-box">
            ${imgV2('aiman', '👦', 'watak-img', 'Aiman')}
          </div>
          <h3>Aiman</h3>
        </button>
        <button class="watak-card" data-watak="aina">
          <div class="watak-img-box">
            ${imgV2('aina', '👧', 'watak-img', 'Aina')}
          </div>
          <h3>Aina</h3>
        </button>
      </div>
    </div>`);

  app.querySelectorAll('.watak-card').forEach((card) => {
    card.onclick = () => {
      const w = card.dataset.watak;
      Murid.setWatak(w);
      skrinPeta();
    };
  });
}

// ---------- Skrin Peta Pulau Membaca ----------
function skrinPeta() {
  const m = Murid.semasa();
  if (!m) return skrinDaftar();

  const k = Murid.kemajuan();
  const watak = Murid.watak() || 'aiman';
  const watakEmoji = watak === 'aina' ? '👧' : '👦';
  const watakNama = watak === 'aina' ? 'Aina' : 'Aiman';

  // Kira jumlah bintang terbanyak
  let jumlahBintang = 0;
  DATA.tahap.forEach((t) => {
    const p = k[t.id];
    if (p != null) jumlahBintang += bintang(p);
  });

  // Tentukan tahap terbuka terakhir untuk avatar berdiri
  let indeksTerakhir = 0;
  DATA.tahap.forEach((t, idx) => {
    const buka = modGuru || idx === 0 || (k[DATA.tahap[idx - 1].id] || 0) >= LULUS;
    if (buka) indeksTerakhir = idx;
  });

  // SVG Path untuk laluan berliku
  const pathD = KOORDINAT_PETA.reduce((acc, pt, idx) => {
    return acc + (idx === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
  }, '');

  const posAvatar = KOORDINAT_PETA[indeksTerakhir];

  skrin(`
    <div class="peta-wrapper">
      <header class="atas bar-atas">
        <div class="murid-info">
          <button id="btnWatak" class="watak-btn" title="Tukar watak">
            ${imgV2(watak, watakEmoji, 'watak-mini')}
            <span>${esc(m.nama)}</span>
          </button>
          <span class="bintang-total">⭐ ${jumlahBintang}</span>
        </div>
        <div class="bar-butang-kanan">
          <button id="btnBeg" class="kecil btn-peta">🎒 Beg</button>
          <button id="tukarMurid" class="kecil btn-peta">👤 Tukar</button>
          ${deferredInstallPrompt ? '<button id="btnPasang" class="kecil btn-peta highlight">📲 Pasang</button>' : ''}
        </div>
      </header>

      ${modGuru ? '<div class="guru-banner">Mod guru aktif: semua lokasi dibuka. <button id="tutupGuru" class="kecil">Tutup</button></div>' : ''}

      <div class="peta-container" id="petaContainer">
        <div class="peta-bg">
          ${imgV2('peta_pulau', '🏝️', 'peta-img', 'Peta Pulau Membaca')}
        </div>

        <svg class="peta-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="${pathD}" class="laluan-garis" />
        </svg>

        <div id="avatarPeta" class="avatar-peta" style="left: ${posAvatar.x}%; top: ${posAvatar.y}%;">
          <div class="avatar-badge">
            ${imgV2(watak, watakEmoji, 'avatar-img', watakNama)}
          </div>
        </div>

        ${DATA.tahap.map((t, i) => {
          const info = LOKASI_INFO[i] || {};
          const p = k[t.id];
          const buka = modGuru || i === 0 || (k[DATA.tahap[i - 1].id] || 0) >= LULUS;
          const b = p == null ? 0 : bintang(p);
          const pos = KOORDINAT_PETA[i] || { x: 50, y: 50 };

          return `
            <button class="lokasi-node ${buka ? 'terbuka' : 'terkunci'} ${p != null ? 'selesai' : ''}"
                    style="left: ${pos.x}%; top: ${pos.y}%;"
                    data-i="${i}"
                    title="${esc(info.nama || t.tajuk)}">
              <div class="lokasi-pin">
                ${buka ? imgV2(info.img || 'lok_k01', info.emoji || '📍', 'lokasi-img') : '🔒'}
              </div>
              <div class="lokasi-label-box">
                <span class="lokasi-tag">${t.id}</span>
                <span class="lokasi-nama">${esc(info.nama || t.tajuk)}</span>
              </div>
              ${buka && b > 0 ? `<span class="lokasi-bintang">${'★'.repeat(b)}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <div class="peta-footer">
        <h2 id="logoPeta" class="tajuk-logo">Pulau Membaca</h2>
        <p class="status" id="statusPeta"></p>
      </div>
    </div>
  `);

  // Gerakkan avatar dan buka menu lokasi apabila node diketik
  const avatarEl = document.getElementById('avatarPeta');
  app.querySelectorAll('.lokasi-node').forEach((btn) => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.i, 10);
      const t = DATA.tahap[idx];
      const buka = modGuru || idx === 0 || (k[DATA.tahap[idx - 1].id] || 0) >= LULUS;

      if (!buka) {
        Bunyi.salah();
        alert(`Lokasi ${t.id} masih terkunci! Dapatkan sekurang-kurangnya 50% dalam Latihan sebelumnya.`);
        return;
      }

      const targetPos = KOORDINAT_PETA[idx];
      if (avatarEl && targetPos) {
        avatarEl.style.left = `${targetPos.x}%`;
        avatarEl.style.top = `${targetPos.y}%`;
      }

      setTimeout(() => {
        menuLokasi(t);
      }, 350);
    };
  });

  document.getElementById('btnWatak').onclick = skrinPilihWatak;
  document.getElementById('btnBeg').onclick = skrinBeg;
  document.getElementById('tukarMurid').onclick = skrinDaftar;

  const btnPasang = document.getElementById('btnPasang');
  if (btnPasang && deferredInstallPrompt) {
    btnPasang.onclick = () => {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => {
        deferredInstallPrompt = null;
        skrinPeta();
      });
    };
  }

  // Mod guru toggle (ketik logo 5 kali)
  let ketik = 0;
  const logoPeta = document.getElementById('logoPeta');
  if (logoPeta) {
    logoPeta.onclick = () => {
      if (++ketik >= 5) {
        modGuru = !modGuru;
        Simpan.set('mm_mod_guru', modGuru);
        skrinPeta();
      }
    };
  }

  const tutupGuru = document.getElementById('tutupGuru');
  if (tutupGuru) {
    tutupGuru.onclick = () => {
      modGuru = false;
      Simpan.set('mm_mod_guru', false);
      skrinPeta();
    };
  }

  const tertunda = Simpan.get('mm_giliran', []).length;
  const st = document.getElementById('statusPeta');
  if (st && tertunda) {
    st.textContent = `${tertunda} markah belum dihantar. Akan dihantar apabila ada internet.`;
  }
}

// ---------- Modal Menu Lokasi ----------
function menuLokasi(t) {
  const m = Murid.semasa();
  const k = Murid.kemajuan();
  const idx = DATA.tahap.findIndex((x) => x.id === t.id);
  const info = LOKASI_INFO[idx] || {};

  const latihanSkor = k[t.id];
  const gameSkor = m ? Simpan.get('mm2_game_' + Murid.kunci(m) + '_' + t.id, 0) : 0;
  const gameBuka = (latihanSkor != null && latihanSkor >= LULUS) || modGuru;

  const modalHtml = `
    <div class="modal-overlay" id="modalMenu">
      <div class="modal-box menu-lokasi-box">
        <button class="tutup-modal" id="tutupMenu">✕</button>

        <div class="lokasi-header">
          <div class="lokasi-header-img">
            ${imgV2(info.img || 'lok_k01', info.emoji || '📍', 'lokasi-modal-img')}
          </div>
          <div>
            <span class="kod-badge">${t.id}</span>
            <h2>${esc(info.nama || t.tajuk)}</h2>
          </div>
        </div>

        <div class="maskot-sapa-box">
          <div class="kancil-img-box">
            ${imgV2('kancil_sapa', '🦌', 'kancil-img')}
          </div>
          <div class="belon-kata">
            <p>${esc(info.sapaan)}</p>
            <button id="btnDengarSapaan" class="btn-dengar">🔊 Dengar</button>
          </div>
        </div>

        <div class="menu-tiga-butang">
          <button id="btnTutorial" class="menu-btn btn-tutorial">
            <span class="btn-icon">📘</span>
            <div class="btn-text">
              <strong>Tutorial</strong>
              <small>Belajar dahulu</small>
            </div>
          </button>

          <button id="btnLatihan" class="menu-btn btn-latihan">
            <span class="btn-icon">✏️</span>
            <div class="btn-text">
              <strong>Latihan</strong>
              <small>${latihanSkor != null ? 'Terbaik: ' + latihanSkor + '%' : 'Uji kefahaman'}</small>
            </div>
          </button>

          <button id="btnGameModal" class="menu-btn btn-game ${gameBuka ? '' : 'kunci'}" ${gameBuka ? '' : 'disabled'}>
            <span class="btn-icon">${gameBuka ? '🎮' : '🔒'}</span>
            <div class="btn-text">
              <strong>Game</strong>
              <small>${gameBuka ? (gameSkor ? 'Skor: ' + gameSkor : 'Main & kumpul ganjaran') : 'Buka Latihan ≥ 50%'}</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  app.appendChild(div.firstElementChild);

  // Mainkan audio sapaan automatik
  Suara.main(info.sapaan);

  document.getElementById('btnDengarSapaan').onclick = () => Suara.main(info.sapaan);

  document.getElementById('tutupMenu').onclick = () => {
    const el = document.getElementById('modalMenu');
    if (el) el.remove();
  };

  document.getElementById('btnTutorial').onclick = () => {
    const el = document.getElementById('modalMenu');
    if (el) el.remove();

    if (typeof mainTutorial === 'function') {
      mainTutorial(t);
    } else if (typeof TUTORIAL !== 'undefined' && TUTORIAL[t.id]) {
      alert('Tutorial ' + t.id);
    } else {
      alert('Tutorial untuk ' + t.id + ' akan datang!');
    }
  };

  document.getElementById('btnLatihan').onclick = () => {
    const el = document.getElementById('modalMenu');
    if (el) el.remove();
    mainLatihan(t);
  };

  document.getElementById('btnGameModal').onclick = () => {
    if (!gameBuka) return;
    const el = document.getElementById('modalMenu');
    if (el) el.remove();

    if (typeof mainGame === 'function') {
      mainGame(t);
    } else if (typeof GAME !== 'undefined' && GAME[t.id]) {
      GAME[t.id].mula();
    } else {
      alert('Game untuk ' + t.id + ' akan datang!');
    }
  };
}

// ---------- Modal Beg 🎒 ----------
function skrinBeg() {
  const m = Murid.semasa();
  const kunciM = m ? Murid.kunci(m) : '';

  const gridHtml = LOKASI_INFO.map((info) => {
    const tId = info.id;
    const bintangGame = m ? Simpan.get('mm2_game_star_' + kunciM + '_' + tId, 0) : 0;
    const adaBarang = bintangGame >= 1 || Simpan.get('mm2_beg_' + kunciM + '_' + tId, false);

    return `
      <div class="beg-item ${adaBarang ? 'dapat' : 'kunci'}">
        <div class="beg-img-box">
          ${adaBarang ? imgV2(info.barang, info.emojiBarang, 'beg-img', info.namaBarang) : '<span class="siluet">🔒</span>'}
        </div>
        <span class="beg-nama">${adaBarang ? esc(info.namaBarang) : '???'}</span>
        <span class="beg-kod">${tId}</span>
      </div>
    `;
  }).join('');

  const modalHtml = `
    <div class="modal-overlay" id="modalBeg">
      <div class="modal-box beg-box">
        <button class="tutup-modal" id="tutupBeg">✕</button>
        <div class="beg-header">
          <h2>🎒 Beg Ganjaran</h2>
          <p>Kumpulkan ganjaran dari permainan setiap lokasi!</p>
        </div>
        <div class="beg-grid">
          ${gridHtml}
        </div>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  app.appendChild(div.firstElementChild);

  document.getElementById('tutupBeg').onclick = () => {
    const el = document.getElementById('modalBeg');
    if (el) el.remove();
  };
}

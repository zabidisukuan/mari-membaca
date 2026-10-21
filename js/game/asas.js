// Rangka Game Bersama v2 (GAME, mainGame, GameAsas)

const GAME = {};

const GANJARAN_BARANG = {
  K1: { id: 'g_k01', nama: 'Pensel Ajaib', emoji: '✏️' },
  K2: { id: 'g_k02', nama: 'Daun Emas', emoji: '🍃' },
  K3: { id: 'g_k03', nama: 'Tiket Emas', emoji: '🎟️' },
  K4: { id: 'g_k04', nama: 'Piala Ikan Emas', emoji: '🏆' },
  K5: { id: 'g_k05', nama: 'Permata Biru', emoji: '💎' },
  K6: { id: 'g_k06', nama: 'Bakul Buah', emoji: '🧺' },
  K7: { id: 'g_k07', nama: 'Kulit Kerang', emoji: '🐚' },
  K8: { id: 'g_k08', nama: 'Bunga Raya', emoji: '🌸' },
  K9: { id: 'g_k09', nama: 'Kunci Emas', emoji: '🔑' },
  K10: { id: 'g_k10', nama: 'Gear Emas', emoji: '⚙️' },
  K11: { id: 'g_k11', nama: 'Wisel Kereta Api', emoji: '🚂' },
  K12: { id: 'g_k12', nama: 'Mahkota', emoji: '👑' },
};

const GameAsas = {
  skor: 0,
  kombo: 1,
  pemasa: 60,
  pemasaId: null,
  gameSemasa: null,

  soalanBaru(jawapan) {
    window.soalanSemasa = { jawapan };
  },

  tandaBetul(elemen) {
    document.querySelectorAll('[data-betul]').forEach((el) => el.removeAttribute('data-betul'));
    if (elemen && elemen.setAttribute) {
      elemen.setAttribute('data-betul', '1');
    }
  },

  betul(teksDisebut, elemen) {
    const tambah = 10 * this.kombo;
    this.skor += tambah;
    this.kombo = Math.min(5, this.kombo + 1);

    const elSkor = document.getElementById('gameSkor');
    const elKombo = document.getElementById('gameKombo');
    if (elSkor) elSkor.textContent = this.skor;
    if (elKombo) elKombo.textContent = `×${this.kombo}`;

    Bunyi.betul();
    if (teksDisebut) Suara.main(teksDisebut);

    if (elemen) {
      elemen.classList.add('animasi-betul');
      setTimeout(() => elemen.classList.remove('animasi-betul'), 600);

      // Tunjuk petunjuk skor berapung jika ada
      const popup = document.createElement('div');
      popup.className = 'popup-skor';
      popup.textContent = `+${tambah}`;
      const rect = elemen.getBoundingClientRect();
      popup.style.left = `${rect.left + rect.width / 2}px`;
      popup.style.top = `${rect.top}px`;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 800);
    }
  },

  salah(elemen) {
    this.kombo = 1;
    const elKombo = document.getElementById('gameKombo');
    if (elKombo) elKombo.textContent = '×1';

    Bunyi.salah();

    if (elemen) {
      elemen.classList.add('animasi-salah');
      setTimeout(() => elemen.classList.remove('animasi-salah'), 500);
    }
  },
};

function mainGame(t) {
  const g = GAME[t.id];
  if (!g) {
    alert(`Game untuk ${t.id} belum dibina!`);
    return;
  }

  // Henti game terdahulu jika ada
  if (GameAsas.gameSemasa && typeof GameAsas.gameSemasa.henti === 'function') {
    GameAsas.gameSemasa.henti();
  }
  if (GameAsas.pemasaId) {
    clearInterval(GameAsas.pemasaId);
    GameAsas.pemasaId = null;
  }

  GameAsas.gameSemasa = g;
  GameAsas.skor = 0;
  GameAsas.kombo = 1;

  const modCepat = !!(window.GAME_UJIAN && window.GAME_UJIAN.cepat);
  const masaMula = modCepat ? 8 : 60;

  function lancar() {
    skrin(`
      <div class="skrin-game-wrapper">
        <div class="game-bg-overlay" style="background-image: url('assets/v2/${g.latar || 'lok_k01'}.jpg');"></div>
        <header class="atas bar-game">
          <button id="btnKeluarGame" class="kecil btn-keluar-game" aria-label="Keluar">✕</button>
          <div class="game-stat">
            <span>⏱ <strong id="gameMasa">${masaMula}</strong>s</span>
            <span>⭐ <strong id="gameSkor">0</strong></span>
            <span class="kombo-tag">🔥 <strong id="gameKombo">×1</strong></span>
          </div>
        </header>
        <main id="gamePentas" class="game-pentas"></main>
      </div>
    `);

    document.getElementById('btnKeluarGame').onclick = () => {
      if (GameAsas.pemasaId) clearInterval(GameAsas.pemasaId);
      if (g.henti) g.henti();
      menuLokasi(t);
    };

    const pentas = document.getElementById('gamePentas');
    GameAsas.pemasa = masaMula;

    GameAsas.pemasaId = setInterval(() => {
      GameAsas.pemasa--;
      const elMasa = document.getElementById('gameMasa');
      if (elMasa) elMasa.textContent = GameAsas.pemasa;

      if (GameAsas.pemasa <= 0) {
        clearInterval(GameAsas.pemasaId);
        GameAsas.pemasaId = null;
        if (g.henti) g.henti();
        tamatGame(t, g);
      }
    }, 1000);

    g.mula(pentas, t, (hasil) => {
      if (GameAsas.pemasaId) clearInterval(GameAsas.pemasaId);
      if (g.henti) g.henti();
      tamatGame(t, g);
    });
  }

  if (modCepat) {
    lancar();
  } else {
    // Papar pengenalan maskot + arahan
    skrin(`
      <div class="game-intro-overlay">
        <div class="game-intro-box">
          <div class="game-intro-header">
            <span class="kod-badge">${t.id}</span>
            <h2>${esc(g.nama || t.tajuk)}</h2>
          </div>
          <div class="maskot-intro">
            ${imgV2('kancil_sapa', '🦌', 'kancil-intro-img')}
            <div class="belon-intro">
              <p>${esc(g.arahan || 'Mari bermain!')}</p>
              <button id="btnDengarArahan" class="btn-dengar">🔊 Dengar</button>
            </div>
          </div>
          <button id="btnMulaGame" class="besar">Mula!</button>
        </div>
      </div>
    `);

    Suara.main(g.arahan || 'Mari bermain!');
    document.getElementById('btnDengarArahan').onclick = () => Suara.main(g.arahan || 'Mari bermain!');

    document.getElementById('btnMulaGame').onclick = () => {
      // Kiraan 3-2-1
      let count = 3;
      skrin(`
        <div class="countdown-overlay">
          <div class="countdown-num" id="countNum">3</div>
        </div>
      `);
      Bunyi.betul();

      const cId = setInterval(() => {
        count--;
        const el = document.getElementById('countNum');
        if (count > 0) {
          if (el) el.textContent = count;
          Bunyi.betul();
        } else if (count === 0) {
          if (el) el.textContent = 'MULA!';
          Bunyi.menang();
        } else {
          clearInterval(cId);
          lancar();
        }
      }, 700);
    };
  }
}

function tamatGame(t, g) {
  const m = Murid.semasa();
  const kunciM = m ? Murid.kunci(m) : '';
  const skorAkhir = GameAsas.skor;

  // Kira bintang: ≥200=3★, ≥120=2★, ≥60=1★
  const b = skorAkhir >= 200 ? 3 : skorAkhir >= 120 ? 2 : skorAkhir >= 60 ? 1 : 0;

  // Simpan skor tertinggi & bintang
  const skorLama = m ? Simpan.get('mm2_game_' + kunciM + '_' + t.id, 0) : 0;
  const bLama = m ? Simpan.get('mm2_game_star_' + kunciM + '_' + t.id, 0) : 0;

  if (m) {
    if (skorAkhir > skorLama) Simpan.set('mm2_game_' + kunciM + '_' + t.id, skorAkhir);
    if (b > bLama) Simpan.set('mm2_game_star_' + kunciM + '_' + t.id, b);
  }

  const barang = GANJARAN_BARANG[t.id] || { id: 'g_' + t.id.toLowerCase(), nama: 'Ganjaran', emoji: '🎁' };
  const dapatBarangBaru = b >= 1 && !Murid.adaBarang(t.id);

  if (dapatBarangBaru) {
    Murid.beriBarang(t.id);
  }

  if (b >= 1) {
    Bunyi.menang();
  } else {
    Bunyi.salah();
  }

  const maskotImg = b >= 1 ? 'kancil_gembira' : 'kancil_fikir';
  const maskotEmoji = b >= 1 ? '🥳' : '🤔';
  const tajukMesej = b === 3 ? 'Luar Biasa!' : b === 2 ? 'Syabas!' : b === 1 ? 'Bagus!' : 'Cuba lagi!';

  skrin(`
    <div class="keputusan game-keputusan">
      <div class="maskot-keputusan">
        ${imgV2(maskotImg, maskotEmoji, 'img-maskot')}
      </div>
      <h2>${tajukMesej}</h2>
      <div class="bintang-besar">${'★'.repeat(b)}${'☆'.repeat(3 - b)}</div>
      <p class="markah">Skor: <strong>${skorAkhir}</strong> &nbsp;·&nbsp; Tertinggi: <strong>${Math.max(skorAkhir, skorLama)}</strong></p>

      ${
        dapatBarangBaru
          ? `
        <div class="ganjaran-box-dapat">
          <p class="ganjaran-tajuk">🎉 Kamu dapat ganjaran baharu!</p>
          <div class="ganjaran-badge">
            ${imgV2(barang.id, barang.emoji, 'ganjaran-img', barang.nama)}
            <span>${esc(barang.nama)}</span>
          </div>
        </div>
      `
          : ''
      }

      <div class="butang-butang">
        <button id="ulangGame" class="besar">↻ Main lagi</button>
        <button id="petaGame" class="besar kedua">🗺️ Peta</button>
      </div>
    </div>
  `);

  document.getElementById('ulangGame').onclick = () => mainGame(t);
  document.getElementById('petaGame').onclick = () => skrinPeta();
}

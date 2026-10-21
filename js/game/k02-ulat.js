// Game K2: Ulat Lapar (Suku Kata V+KV)

GAME['K2'] = {
  nama: 'Ulat Lapar',
  latar: 'lok_k02',
  arahan: 'Bantu ulat makan daun suku kata mengikut urutan!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();
    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];
    const sukuKolam = [...new Set(gambarSenarai.map((g) => g.w).concat(senaraiKata).flatMap(U.suku))];

    el.innerHTML = `
      <div class="ulat-game-container">
        <div class="ulat-header">
          <div id="ulatGambarBox" class="ulat-gambar-box"></div>
        </div>

        <div class="ulat-pentas">
          <div id="ulatBadanBox" class="ulat-badan-box">
            <div class="ulat-kepala">
              ${imgV2('s_ulat_kepala', '🐛', 'ulat-kepala-img sprite-img')}
            </div>
            <div id="ulatSegmenRow" class="ulat-segmen-row"></div>
          </div>
        </div>

        <div id="daunContainer" class="daun-container"></div>
      </div>
    `;

    const gambarBox = document.getElementById('ulatGambarBox');
    const segmenRow = document.getElementById('ulatSegmenRow');
    const daunBox = document.getElementById('daunContainer');

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      segmenRow.innerHTML = '';
      daunBox.innerHTML = '';
      soalanAktif = true;

      const g = U.pick(gambarSenarai, 1)[0] || { w: 'bu-ku', e: '📖' };
      const parts = U.suku(g.w);
      const jawapanPenuh = U.kata(g.w);

      GameAsas.soalanBaru(jawapanPenuh);
      gambarBox.appendChild(gambarEl(g.img || jawapanPenuh, g.e));

      let langkahIndeks = 0;

      // Pilih pengacau
      const pengacau = U.shuffle(sukuKolam.filter((s) => !parts.includes(s))).slice(0, 4 - parts.length);
      const semuaDaunSuku = U.shuffle([...parts, ...pengacau]);

      const daunButtons = [];

      semuaDaunSuku.forEach((suku) => {
        const btn = document.createElement('button');
        btn.className = 'daun-item';
        btn.innerHTML = `
          ${imgV2('s_daun', '🍃', 'daun-img sprite-img')}
          <span class="daun-label">${suku}</span>
        `;

        btn.dataset.suku = suku;
        daunBox.appendChild(btn);
        daunButtons.push(btn);

        btn.onclick = () => {
          if (!soalanAktif || btn.disabled) return;

          const sasaranSuku = parts[langkahIndeks];
          if (suku === sasaranSuku) {
            btn.disabled = true;
            btn.classList.add('dimakan');

            // Tambah segmen ulat
            const segmen = document.createElement('div');
            segmen.className = 'ulat-segmen';
            segmen.innerHTML = `
              ${imgV2('s_ulat_badan', '🟢', 'segmen-img sprite-img')}
              <span class="segmen-label">${suku}</span>
            `;
            segmenRow.appendChild(segmen);

            Suara.main(suku);
            langkahIndeks++;

            if (langkahIndeks < parts.length) {
              kemaskiniTanda();
            } else {
              soalanAktif = false;
              GameAsas.betul(jawapanPenuh, segmenRow);

              setTimeout(() => {
                if (GameAsas.pemasa > 0) {
                  buatSoalan();
                }
              }, 900);
            }
          } else {
            GameAsas.salah(btn);
          }
        };
      });

      const kemaskiniTanda = () => {
        const sasaranSuku = parts[langkahIndeks];
        const sasaranBtn = daunButtons.find((b) => !b.disabled && b.dataset.suku === sasaranSuku);
        GameAsas.tandaBetul(sasaranBtn);
      };

      kemaskiniTanda();
    };

    buatSoalan();
  },

  henti() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  },
};

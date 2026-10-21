// Game K6: Bakul Pasar ("ng")

GAME['K6'] = {
  nama: 'Bakul Pasar',
  latar: 'lok_k06',
  arahan: 'Asingkan perkataan ke dalam bakul ada "ng" atau tiada "ng"!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    // Data K6 (ada "ng")
    const k6Gambar = (tahap && tahap.gambar) || [];
    const k6Senarai = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];
    const k6Items = k6Gambar.map((g) => ({ w: g.w, e: g.e, img: g.img, adaNg: true }))
      .concat(k6Senarai.map((w) => ({ w, e: '📦', adaNg: true })));

    // Data K2 & K4 (tiada "ng")
    const k2 = DATA.tahap[1] || {};
    const k4 = DATA.tahap[3] || {};
    const k24Gambar = (k2.gambar || []).concat(k4.gambar || []);
    const k24Senarai = ((k2.senarai || '').split(' ')).concat((k4.senarai || '').split(' ')).filter(Boolean);

    const k24Items = k24Gambar.map((g) => ({ w: g.w, e: g.e, img: g.img, adaNg: false }))
      .concat(k24Senarai.map((w) => ({ w, e: '📦', adaNg: false })))
      .filter((item) => !U.kata(item.w).includes('ng'));

    el.innerHTML = `
      <div class="bakul-game-container">
        <div class="bakul-pentas">
          <div id="barangDropBox" class="barang-drop-box">
            <div id="barangCard" class="barang-card"></div>
          </div>

          <div class="senarai-bakul-row">
            <button id="bakulAda" class="bakul-item" data-kategori="ada ng">
              <div class="bakul-img-box">
                ${imgV2('s_bakul', '🧺', 'bakul-img sprite-img')}
              </div>
              <span class="bakul-label">ada <strong>ng</strong></span>
            </button>

            <button id="bakulTiada" class="bakul-item" data-kategori="tiada ng">
              <div class="bakul-img-box">
                ${imgV2('s_bakul', '🧺', 'bakul-img sprite-img')}
              </div>
              <span class="bakul-label">tiada <strong>ng</strong></span>
            </button>
          </div>
        </div>
      </div>
    `;

    const barangCard = document.getElementById('barangCard');
    const bakulAda = document.getElementById('bakulAda');
    const bakulTiada = document.getElementById('bakulTiada');

    let soalanAktif = true;

    const buatSoalan = () => {
      barangCard.innerHTML = '';
      barangCard.className = 'barang-card';
      soalanAktif = true;

      // Pilih 50% ada ng, 50% tiada ng
      const gunaAdaNg = Math.random() < 0.5;
      const pilItem = gunaAdaNg ? U.pick(k6Items, 1)[0] : U.pick(k24Items, 1)[0];

      const jawapanPenuh = U.kata(pilItem.w);
      const kategoriBetul = pilItem.adaNg ? 'ada ng' : 'tiada ng';

      GameAsas.soalanBaru(kategoriBetul);

      if (pilItem.img || pilItem.e) {
        barangCard.appendChild(gambarEl(pilItem.img || jawapanPenuh, pilItem.e));
      }
      const labelDiv = document.createElement('div');
      labelDiv.className = 'barang-label';
      labelDiv.textContent = jawapanPenuh;
      barangCard.appendChild(labelDiv);

      const bakulBetulEl = kategoriBetul === 'ada ng' ? bakulAda : bakulTiada;
      GameAsas.tandaBetul(bakulBetulEl);

      const kendalikanKetik = (bakulEl, kat) => {
        if (!soalanAktif) return;

        if (kat === kategoriBetul) {
          soalanAktif = false;
          barangCard.classList.add('jatuh-masuk');

          Suara.main(jawapanPenuh);
          GameAsas.betul(jawapanPenuh, bakulEl);

          setTimeout(() => {
            if (GameAsas.pemasa > 0) {
              buatSoalan();
            }
          }, 900);
        } else {
          GameAsas.salah(bakulEl);
        }
      };

      bakulAda.onclick = () => kendalikanKetik(bakulAda, 'ada ng');
      bakulTiada.onclick = () => kendalikanKetik(bakulTiada, 'tiada ng');
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

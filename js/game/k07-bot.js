// Game K7: Bot ke Pulau (Diftong ai, au, oi)

GAME['K7'] = {
  nama: 'Bot ke Pulau',
  latar: 'lok_k07',
  arahan: 'Kemudikan bot ke pulau diftong yang betul!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];

    const k7Items = gambarSenarai.map((g) => ({ w: g.w, e: g.e, img: g.img }))
      .concat(senaraiKata.map((w) => ({ w, e: '🏝️' })));

    // Fungsi pengenalan diftong
    const cariDiftong = (w) => {
      const kata = U.kata(w);
      if (kata.includes('ai')) return 'ai';
      if (kata.includes('au')) return 'au';
      if (kata.includes('oi')) return 'oi';
      return 'ai';
    };

    el.innerHTML = `
      <div class="bot-game-container">
        <div class="bot-header">
          <div id="botGambarBox" class="bot-gambar-box"></div>
          <div id="botTeksLabel" class="bot-teks-label"></div>
        </div>

        <div class="laut-pentas" id="lautPentas">
          <div class="senarai-pulau-row">
            <button class="pulau-item" data-diftong="ai" id="pulauAi">
              <div class="pulau-img-box">
                ${imgV2('s_pulau', '🏝️', 'pulau-img sprite-img')}
              </div>
              <span class="pulau-label">ai</span>
            </button>

            <button class="pulau-item" data-diftong="au" id="pulauAu">
              <div class="pulau-img-box">
                ${imgV2('s_pulau', '🏝️', 'pulau-img sprite-img')}
              </div>
              <span class="pulau-label">au</span>
            </button>

            <button class="pulau-item" data-diftong="oi" id="pulauOi">
              <div class="pulau-img-box">
                ${imgV2('s_pulau', '🏝️', 'pulau-img sprite-img')}
              </div>
              <span class="pulau-label">oi</span>
            </button>
          </div>

          <div id="botWrapper" class="bot-wrapper">
            <div class="bot-sprite-box">
              ${imgV2('s_bot', '⛵', 'bot-img sprite-img')}
            </div>
          </div>
        </div>
      </div>
    `;

    const laut = document.getElementById('lautPentas');
    const botWrapper = document.getElementById('botWrapper');
    const gambarBox = document.getElementById('botGambarBox');
    const teksLabel = document.getElementById('botTeksLabel');

    const pulauAi = document.getElementById('pulauAi');
    const pulauAu = document.getElementById('pulauAu');
    const pulauOi = document.getElementById('pulauOi');

    const pulauMap = { ai: pulauAi, au: pulauAu, oi: pulauOi };

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      teksLabel.innerHTML = '';
      botWrapper.className = 'bot-wrapper di-tengah';
      botWrapper.style.transform = 'translate(-50%, 0)';
      soalanAktif = true;

      const item = U.pick(k7Items, 1)[0] || { w: 'tu-pai', e: '🐿️' };
      const jawapanPenuh = U.kata(item.w);
      const diftongBetul = cariDiftong(item.w);

      GameAsas.soalanBaru(diftongBetul);

      if (item.img || item.e) {
        gambarBox.appendChild(gambarEl(item.img || jawapanPenuh, item.e));
      }
      teksLabel.textContent = jawapanPenuh;

      const pulauBetulEl = pulauMap[diftongBetul];
      GameAsas.tandaBetul(pulauBetulEl);

      const kendalikanKetik = (pulauEl, dif) => {
        if (!soalanAktif) return;

        if (dif === diftongBetul) {
          soalanAktif = false;

          // Serlahkan diftong dalam teks SELEPAS dijawab
          const regex = new RegExp(`(${diftongBetul})`, 'gi');
          teksLabel.innerHTML = jawapanPenuh.replace(regex, '<span class="diftong-serlah">$1</span>');

          // Belayar ke pulau
          const rectPulau = pulauEl.getBoundingClientRect();
          const rectLaut = laut.getBoundingClientRect();
          const targetX = rectPulau.left - rectLaut.left + rectPulau.width / 2;

          botWrapper.classList.add('belayar');
          botWrapper.style.transform = `translate(${targetX - rectLaut.width / 2}px, -120px)`;

          Suara.main(jawapanPenuh);
          GameAsas.betul(jawapanPenuh, pulauEl);

          setTimeout(() => {
            if (GameAsas.pemasa > 0) {
              buatSoalan();
            }
          }, 1000);
        } else {
          GameAsas.salah(pulauEl);
        }
      };

      pulauAi.onclick = () => kendalikanKetik(pulauAi, 'ai');
      pulauAu.onclick = () => kendalikanKetik(pulauAu, 'au');
      pulauOi.onclick = () => kendalikanKetik(pulauOi, 'oi');
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

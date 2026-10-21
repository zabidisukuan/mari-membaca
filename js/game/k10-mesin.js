// Game K10: Mesin Imbuhan

GAME['K10'] = {
  nama: 'Mesin Imbuhan',
  latar: 'lok_k10',
  arahan: 'Pilih imbuhan yang betul untuk dimasukkan ke dalam mesin!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    const imbuhanList = (tahap && tahap.imbuhan) || [];

    // Fallback daripada DATA jika tahap tiada imbuhan
    const fallbackTahap = (window.DATA && window.DATA.tahap && window.DATA.tahap.find((t) => t.id === 'K10')) || {};
    const senaraiImbuhan = imbuhanList.length ? imbuhanList : fallbackTahap.imbuhan || [];

    const SEMUA_IMBUHAN = ['me-', 'ber-', 'ter-', '-an', '-i', '-kan'];

    el.innerHTML = `
      <div class="mesin-game-container">
        <div class="corong-area">
          <div class="corong-label">Kata Dasar:</div>
          <div id="kataDasarCard" class="kata-dasar-card">masak</div>
        </div>

        <div class="mesin-pentas">
          <div id="mesinCard" class="mesin-card">
            <div class="mesin-sprite-wrap">
              ${imgV2('s_mesin', '⚙️', 'mesin-img sprite-img')}
            </div>
            <div id="panelButangImbuhan" class="panel-butang-imbuhan"></div>
          </div>
        </div>

        <div class="tali-sawat-area">
          <div class="tali-sawat-track"></div>
          <div id="hasilCard" class="hasil-card">?</div>
        </div>
      </div>
    `;

    const kataDasarCard = document.getElementById('kataDasarCard');
    const mesinCard = document.getElementById('mesinCard');
    const panelButang = document.getElementById('panelButangImbuhan');
    const hasilCard = document.getElementById('hasilCard');

    let soalanAktif = true;

    const buatSoalan = () => {
      panelButang.innerHTML = '';
      mesinCard.className = 'mesin-card';
      hasilCard.className = 'hasil-card';
      hasilCard.textContent = '?';
      soalanAktif = true;

      const item = U.pick(senaraiImbuhan, 1)[0] || ['masak', '-an', 'masakan'];
      const [kataDasar, imbuhanBetul, hasilPenuh] = item;

      GameAsas.soalanBaru(hasilPenuh);

      kataDasarCard.textContent = kataDasar;

      // Cari 2 pengacau imbuhan lain daripada set
      const pengacauBoleh = SEMUA_IMBUHAN.filter((imb) => imb !== imbuhanBetul);
      const pengacauPilihan = U.shuffle(pengacauBoleh).slice(0, 2);
      const pilihanImbuhan = U.shuffle([imbuhanBetul, ...pengacauPilihan]);

      const butangList = [];

      pilihanImbuhan.forEach((imb) => {
        const btn = document.createElement('button');
        btn.className = 'imbuhan-btn';
        btn.textContent = imb;
        btn.dataset.imbuhan = imb;

        panelButang.appendChild(btn);
        butangList.push(btn);

        if (imb === imbuhanBetul) {
          GameAsas.tandaBetul(btn);
        }

        btn.onclick = () => {
          if (!soalanAktif) return;

          if (imb === imbuhanBetul) {
            soalanAktif = false;
            butangList.forEach((b) => (b.disabled = true));

            // Animasi mesin bergoyang & hasil keluar
            mesinCard.classList.add('mesin-goyang');
            hasilCard.textContent = hasilPenuh;
            hasilCard.classList.add('hasil-keluar');

            GameAsas.betul(hasilPenuh, btn);

            this.timerId = setTimeout(() => {
              if (GameAsas.pemasa > 0) {
                buatSoalan();
              }
            }, 1200);
          } else {
            GameAsas.salah(btn);
          }
        };
      });
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

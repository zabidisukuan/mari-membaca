// Game K3: Kereta Api Suku Kata (V+KV+KV)

GAME['K3'] = {
  nama: 'Kereta Api Suku Kata',
  latar: 'lok_k03',
  arahan: 'Sambungkan gerabak suku kata mengikut gambar!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();
    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];
    const sukuKolam = [...new Set(gambarSenarai.map((g) => g.w).concat(senaraiKata).flatMap(U.suku))];

    el.innerHTML = `
      <div class="kereta-game-container">
        <div class="kereta-header">
          <div id="keretaGambarBox" class="kereta-gambar-box"></div>
        </div>

        <div class="landasan-wrapper">
          <div id="keretaTren" class="kereta-tren">
            <div class="kepala-kereta-box">
              ${imgV2('s_kepala_kereta', '🚂', 'kepala-img sprite-img')}
            </div>
            <div id="slotGerabakRow" class="slot-gerabak-row"></div>
          </div>
          <div class="landasan-garis"></div>
        </div>

        <div id="gerabakPilihanBox" class="gerabak-pilihan-box"></div>
      </div>
    `;

    const gambarBox = document.getElementById('keretaGambarBox');
    const trenBox = document.getElementById('keretaTren');
    const slotRow = document.getElementById('slotGerabakRow');
    const pilihanBox = document.getElementById('gerabakPilihanBox');

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      slotRow.innerHTML = '';
      pilihanBox.innerHTML = '';
      trenBox.classList.remove('kereta-jalan');
      soalanAktif = true;

      const g = U.pick(gambarSenarai, 1)[0] || { w: 'ke-me-ja', e: '👔' };
      const parts = U.suku(g.w);
      const jawapanPenuh = U.kata(g.w);

      GameAsas.soalanBaru(jawapanPenuh);
      gambarBox.appendChild(gambarEl(g.img || jawapanPenuh, g.e));

      // Sediakan slot gerabak kosong
      const slotList = [];
      parts.forEach(() => {
        const slot = document.createElement('div');
        slot.className = 'slot-gerabak kosong';
        slot.textContent = '?';
        slotRow.appendChild(slot);
        slotList.push(slot);
      });

      let langkahIndeks = 0;

      // Pilih pengacau
      const pengacau = U.shuffle(sukuKolam.filter((s) => !parts.includes(s))).slice(0, 5 - parts.length);
      const semuaPilihan = U.shuffle([...parts, ...pengacau]);

      const gerabakButtons = [];

      semuaPilihan.forEach((suku) => {
        const btn = document.createElement('button');
        btn.className = 'gerabak-item';
        btn.innerHTML = `
          ${imgV2('s_gerabak', '   ', 'gerabak-img sprite-img')}
          <span class="gerabak-label">${suku}</span>
        `;
        btn.dataset.suku = suku;
        pilihanBox.appendChild(btn);
        gerabakButtons.push(btn);

        btn.onclick = () => {
          if (!soalanAktif || btn.disabled) return;

          const sasaranSuku = parts[langkahIndeks];
          if (suku === sasaranSuku) {
            btn.disabled = true;
            btn.classList.add('dipilih');

            // Isi slot gerabak
            const targetSlot = slotList[langkahIndeks];
            targetSlot.className = 'slot-gerabak diisi';
            targetSlot.innerHTML = `
              ${imgV2('s_gerabak', '   ', 'gerabak-img sprite-img')}
              <span class="gerabak-label">${suku}</span>
            `;

            langkahIndeks++;

            if (langkahIndeks < parts.length) {
              Suara.main(suku);
              kemaskiniTanda();
            } else {
              soalanAktif = false;
              GameAsas.betul(jawapanPenuh, trenBox);
              trenBox.classList.add('kereta-jalan');

              this.timerId = setTimeout(() => {
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
        const sasaranBtn = gerabakButtons.find((b) => !b.disabled && b.dataset.suku === sasaranSuku);
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

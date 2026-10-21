// Game K8: Roda Bunga (Vokal Berganding)

GAME['K8'] = {
  nama: 'Roda Bunga',
  latar: 'lok_k08',
  arahan: 'Ketik kelopak suku kata mengikut urutan untuk membina perkataan!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];

    const k8Items = gambarSenarai.map((g) => ({ w: g.w, e: g.e, img: g.img }))
      .concat(senaraiKata.map((w) => ({ w, e: '🌸' })));

    const sukuKolam = [...new Set(k8Items.flatMap((item) => U.suku(item.w)))];

    el.innerHTML = `
      <div class="bunga-game-container">
        <div class="bunga-header">
          <div id="bungaGambarBox" class="bunga-gambar-box"></div>
          <div id="slotBungaRow" class="slot-bunga-row"></div>
        </div>

        <div class="bunga-pentas">
          <div id="rodaBunga" class="roda-bunga">
            <div class="pusat-bunga" id="pusatBunga">
              <span class="pusat-icon">🌸</span>
            </div>
            <div id="kelopakRing" class="kelopak-ring"></div>
          </div>
        </div>
      </div>
    `;

    const gambarBox = document.getElementById('bungaGambarBox');
    const slotRow = document.getElementById('slotBungaRow');
    const rodaBunga = document.getElementById('rodaBunga');
    const kelopakRing = document.getElementById('kelopakRing');

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      slotRow.innerHTML = '';
      kelopakRing.innerHTML = '';
      rodaBunga.className = 'roda-bunga';
      soalanAktif = true;

      const item = U.pick(k8Items, 1)[0] || { w: 'bu-ah', e: '🍎' };
      const parts = U.suku(item.w);
      const jawapanPenuh = U.kata(item.w);

      GameAsas.soalanBaru(jawapanPenuh);

      if (item.img || item.e) {
        gambarBox.appendChild(gambarEl(item.img || jawapanPenuh, item.e));
      }

      // Sediakan slot kosong
      const slotList = [];
      parts.forEach(() => {
        const slot = document.createElement('div');
        slot.className = 'slot-bunga kosong';
        slot.textContent = '?';
        slotRow.appendChild(slot);
        slotList.push(slot);
      });

      let langkahIndeks = 0;

      // Pilih 5-6 kelopak (termasuk suku kata perkataan sasaran + pengacau)
      const jumlahKelopak = Math.max(5, parts.length + 2);
      const pengacau = U.shuffle(sukuKolam.filter((s) => !parts.includes(s))).slice(0, jumlahKelopak - parts.length);
      const semuaKelopakSuku = U.shuffle([...parts, ...pengacau]);

      const kelopakButtons = [];

      const rW = rodaBunga.clientWidth || 280;
      const radius = Math.min(108, Math.floor((rW / 2) - 40)); // Jarak dinamik dari pusat bunga
      const total = semuaKelopakSuku.length;

      semuaKelopakSuku.forEach((suku, idx) => {
        const btn = document.createElement('button');
        btn.className = `kelopak-item kelopak-warna-${(idx % 5) + 1}`;
        btn.dataset.suku = suku;

        const angleDeg = (360 / total) * idx - 90; // Mula dari atas
        btn.style.transform = `rotate(${angleDeg}deg) translate(${radius}px) rotate(${-angleDeg}deg)`;

        btn.innerHTML = `<span class="kelopak-label">${suku}</span>`;

        kelopakRing.appendChild(btn);
        kelopakButtons.push(btn);

        btn.onclick = () => {
          if (!soalanAktif || btn.disabled) return;

          const sasaranSuku = parts[langkahIndeks];
          if (suku === sasaranSuku) {
            btn.disabled = true;
            btn.classList.add('dipilih');

            // Isi slot
            const targetSlot = slotList[langkahIndeks];
            targetSlot.className = 'slot-bunga diisi';
            targetSlot.textContent = suku;

            Suara.main(suku);
            langkahIndeks++;

            if (langkahIndeks < parts.length) {
              kemaskiniTanda();
            } else {
              soalanAktif = false;

              // Putar bunga
              rodaBunga.classList.add('bunga-putar');
              Suara.main(jawapanPenuh);
              GameAsas.betul(jawapanPenuh, rodaBunga);

              setTimeout(() => {
                if (GameAsas.pemasa > 0) {
                  buatSoalan();
                }
              }, 1100);
            }
          } else {
            GameAsas.salah(btn);
          }
        };
      });

      const kemaskiniTanda = () => {
        const sasaranSuku = parts[langkahIndeks];
        const sasaranBtn = kelopakButtons.find((b) => !b.disabled && b.dataset.suku === sasaranSuku);
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

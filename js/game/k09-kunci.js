// Game K9: Pilih Kunci (Digraf & Konsonan Bergabung)

GAME['K9'] = {
  nama: 'Pilih Kunci',
  latar: 'lok_k09',
  arahan: 'Pilih kunci yang betul untuk membuka pintu!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    const isiList = (tahap && tahap.isi) || [];
    const senaraiList = (tahap && tahap.senarai) || [];

    // Jika tiada data daripada tahap, guna data fallback daripada DATA
    const fallbackTahap = (window.DATA && window.DATA.tahap && window.DATA.tahap.find((t) => t.id === 'K9')) || {};
    const isi = isiList.length ? isiList : fallbackTahap.isi || [];
    const senarai = senaraiList.length ? senaraiList : fallbackTahap.senarai || [];

    const k9Items = [...isi, ...senarai];

    el.innerHTML = `
      <div class="kunci-game-container">
        <div class="kunci-header">
          <div id="kunciGambarBox" class="kunci-gambar-box"></div>
        </div>

        <div class="pintu-pentas">
          <div id="pintuCard" class="pintu-card">
            <div class="pintu-sprite-box">
              ${imgV2('s_pintu', '🚪', 'pintu-img sprite-img')}
            </div>
            <div id="pintuPerkataan" class="pintu-perkataan">__</div>
          </div>
        </div>

        <div id="kunciRow" class="kunci-row"></div>
      </div>
    `;

    const gambarBox = document.getElementById('kunciGambarBox');
    const pintuCard = document.getElementById('pintuCard');
    const pintuPerkataan = document.getElementById('pintuPerkataan');
    const kunciRow = document.getElementById('kunciRow');

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      kunciRow.innerHTML = '';
      pintuCard.className = 'pintu-card';
      soalanAktif = true;

      const item = U.pick(k9Items, 1)[0] || { w: 'khemah', blank: 'kh', opsyen: ['kh', 'sy', 'ng'], e: '⛺' };
      const jawapanPenuh = item.w;
      const jawapanBetul = item.blank || (item.opsyen && item.opsyen[0]) || 'kh';

      GameAsas.soalanBaru(jawapanPenuh);

      if (item.e || item.img) {
        gambarBox.appendChild(gambarEl(item.img || item.w, item.e));
      }

      // Papar perkataan berlubang (cth. __emah)
      const kataBerlubang = jawapanPenuh.replace(jawapanBetul, '__');
      pintuPerkataan.innerHTML = `<span class="kata-teks">${kataBerlubang}</span>`;

      // Sediakan 3 kunci pilihan dikocok
      const opsyenKocok = U.shuffle(item.opsyen || [jawapanBetul, 'sy', 'ng']);
      const kunciButtons = [];

      opsyenKocok.forEach((ops) => {
        const btn = document.createElement('button');
        btn.className = 'kunci-btn';
        btn.dataset.opsyen = ops;
        btn.innerHTML = `
          <div class="kunci-sprite-wrap">
            ${imgV2('s_kunci', '🔑', 'kunci-img sprite-img')}
          </div>
          <span class="kunci-label">${ops}</span>
        `;

        kunciRow.appendChild(btn);
        kunciButtons.push(btn);

        if (ops === jawapanBetul) {
          GameAsas.tandaBetul(btn);
        }

        btn.onclick = () => {
          if (!soalanAktif) return;

          if (ops === jawapanBetul) {
            soalanAktif = false;
            kunciButtons.forEach((b) => (b.disabled = true));

            btn.classList.add('kunci-masuk');
            pintuCard.classList.add('pintu-terbuka');
            pintuPerkataan.innerHTML = `<span class="kata-teks kata-penuh">${jawapanPenuh}</span>`;

            GameAsas.betul(jawapanPenuh, btn);

            this.timerId = setTimeout(() => {
              if (GameAsas.pemasa > 0) {
                buatSoalan();
              }
            }, 1100);
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

// Game K5: Katak Melompat (KVKKV & KVKVK)

GAME['K5'] = {
  nama: 'Katak Melompat',
  latar: 'lok_k05',
  arahan: 'Lompat atas batu suku kata untuk menyeberangi sungai!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();
    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];

    const k5Items = gambarSenarai.map((g) => ({ w: g.w, e: g.e, img: g.img }))
      .concat(senaraiKata.map((w) => ({ w, e: '📝' })));

    const sukuKolam = [...new Set(k5Items.flatMap((item) => U.suku(item.w)))];

    el.innerHTML = `
      <div class="katak-game-container">
        <div class="katak-header">
          <div id="katakGambarBox" class="katak-gambar-box"></div>
        </div>

        <div id="sungaiPentas" class="sungai-pentas">
          <div class="tebing tebing-atas">
            <span class="tebing-label">Seberang 🏁</span>
          </div>

          <div id="barisBatuContainer" class="baris-batu-container"></div>

          <div class="tebing tebing-bawah">
            <div id="katakEl" class="katak-posisi">
              ${imgV2('s_katak', '🐸', 'katak-img sprite-img')}
            </div>
          </div>
        </div>
      </div>
    `;

    const gambarBox = document.getElementById('katakGambarBox');
    const barisContainer = document.getElementById('barisBatuContainer');
    const katakEl = document.getElementById('katakEl');

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      barisContainer.innerHTML = '';
      soalanAktif = true;

      // Posisikan katak di tebing bawah asal
      katakEl.className = 'katak-posisi di-tebing-bawah';
      katakEl.style.left = '50%';
      katakEl.style.bottom = '10px';

      const item = U.pick(k5Items, 1)[0] || { w: 'cik-gu', e: '👩‍🏫' };
      const parts = U.suku(item.w);
      const jawapanPenuh = U.kata(item.w);

      GameAsas.soalanBaru(jawapanPenuh);
      if (item.img || item.e) {
        gambarBox.appendChild(gambarEl(item.img || jawapanPenuh, item.e));
      } else {
        gambarBox.innerHTML = `<span class="kata-sasaran-teks">${jawapanPenuh}</span>`;
      }

      let langkahIndeks = 0;
      const senaraiLangkahBatu = []; // simpan butang batu mengikut baris

      // Bina baris batu untuk setiap suku kata (baris 0 = terdekat dengan katak, baris N-1 = terdekat dengan tebing atas)
      parts.forEach((sukuBetul, idx) => {
        const barisDiv = document.createElement('div');
        barisDiv.className = 'baris-batu';
        barisDiv.dataset.langkah = idx;

        // Pilih 2 pengacau
        const pengacau = U.shuffle(sukuKolam.filter((s) => s !== sukuBetul)).slice(0, 2);
        const batuSuku = U.shuffle([sukuBetul, ...pengacau]);

        const batuInBaris = [];

        batuSuku.forEach((suku) => {
          const btn = document.createElement('button');
          btn.className = 'batu-item';
          btn.innerHTML = `
            ${imgV2('s_batu', '🪨', 'batu-img sprite-img')}
            <span class="batu-label">${suku}</span>
          `;
          btn.dataset.suku = suku;
          btn.dataset.baris = idx;

          barisDiv.appendChild(btn);
          batuInBaris.push(btn);

          btn.onclick = () => {
            if (!soalanAktif || btn.disabled) return;

            // Pastikan murid menekan batu pada baris langkah semasa
            if (parseInt(btn.dataset.baris, 10) !== langkahIndeks) return;

            const sasaranSuku = parts[langkahIndeks];
            if (suku === sasaranSuku) {
              btn.classList.add('dipijak');

              // Animasi katak melompat ke batu ini
              const rectBtn = btn.getBoundingClientRect();
              const rectSungai = document.getElementById('sungaiPentas').getBoundingClientRect();

              const posX = rectBtn.left - rectSungai.left + rectBtn.width / 2;
              const posY = rectSungai.bottom - rectBtn.bottom + rectBtn.height / 2;

              katakEl.className = 'katak-posisi melompat';
              katakEl.style.left = `${posX}px`;
              katakEl.style.bottom = `${posY}px`;

              langkahIndeks++;

              if (langkahIndeks < parts.length) {
                Suara.main(suku);
                kemaskiniTanda();
              } else {
                soalanAktif = false;
                // Katak melompat ke tebing atas
                setTimeout(() => {
                  katakEl.style.left = '50%';
                  katakEl.style.bottom = 'calc(100% - 40px)';
                  GameAsas.betul(jawapanPenuh, katakEl);
                }, 300);

                this.timerId = setTimeout(() => {
                  if (GameAsas.pemasa > 0) {
                    buatSoalan();
                  }
                }, 1000);
              }
            } else {
              GameAsas.salah(btn);
            }
          };
        });

        senaraiLangkahBatu.push(batuInBaris);
        // Masukkan baris ke container (baris terakhir di atas)
        barisContainer.insertBefore(barisDiv, barisContainer.firstChild);
      });

      const kemaskiniTanda = () => {
        const sasaranSuku = parts[langkahIndeks];
        const barisSemasa = senaraiLangkahBatu[langkahIndeks] || [];
        const batuBetul = barisSemasa.find((b) => b.dataset.suku === sasaranSuku);
        GameAsas.tandaBetul(batuBetul);
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

// Game K4: Tangkap Ikan (KVK)

GAME['K4'] = {
  nama: 'Tangkap Ikan',
  latar: 'lok_k04',
  arahan: 'Tangkap ikan yang membawa perkataan untuk gambar ini!',

  animFrameId: null,
  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();
    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];
    const semuaKata = [...new Set(gambarSenarai.map((g) => U.kata(g.w)).concat(senaraiKata.map(U.kata)))];

    el.innerHTML = `
      <div class="ikan-game-container">
        <div class="ikan-header">
          <div id="ikanGambarBox" class="ikan-gambar-box"></div>
        </div>

        <div id="kolamPentas" class="kolam-pentas">
          <div id="jaringDrop" class="jaring-drop">
            ${imgV2('s_jaring', '🕸️', 'jaring-img sprite-img')}
          </div>
        </div>
      </div>
    `;

    const gambarBox = document.getElementById('ikanGambarBox');
    const kolam = document.getElementById('kolamPentas');
    const jaringEl = document.getElementById('jaringDrop');

    let soalanAktif = true;
    let ikanList = [];

    const buatSoalan = () => {
      // Bersihkan ikan lama dari kolam (kecuali jaring)
      kolam.querySelectorAll('.ikan-item').forEach((el) => el.remove());
      jaringEl.classList.remove('aktif');
      ikanList = [];
      soalanAktif = true;

      const g = U.pick(gambarSenarai, 1)[0] || { w: 'ba-s', e: '🚌' };
      const jawapan = U.kata(g.w);

      GameAsas.soalanBaru(jawapan);
      gambarBox.innerHTML = '';
      gambarBox.appendChild(gambarEl(g.img || jawapan, g.e));

      // Cari pengacau dengan huruf awal sama atau panjang sama
      const lain = semuaKata.filter((w) => w !== jawapan);
      const dekat = U.shuffle(lain.filter((w) => w[0] === jawapan[0] || w.length === jawapan.length));
      const pengacau = [...new Set(dekat.concat(U.shuffle(lain)))].slice(0, 3);

      const pilihanKata = U.shuffle([jawapan, ...pengacau]);
      const yPositions = [8, 30, 52, 74];
      const shuffledY = U.shuffle(yPositions);

      pilihanKata.forEach((kata, idx) => {
        const btn = document.createElement('button');
        btn.className = 'ikan-item';

        const dir = idx % 2 === 0 ? 1 : -1; // 1 = ke kanan, -1 = ke kiri
        if (dir === -1) btn.classList.add('pusing');

        btn.innerHTML = `
          <div class="ikan-body">
            ${imgV2('s_ikan', '🐟', 'ikan-img sprite-img')}
          </div>
          <span class="ikan-label">${kata}</span>
        `;

        const startX = 5 + idx * 18; // Kedudukan permulaan di dalam kolam
        const posY = shuffledY[idx % shuffledY.length];
        const speed = 0.11 + Math.random() * 0.04; // Kelajuan berenang perlahan (8-10s merentasi)

        btn.style.left = `${startX}%`;
        btn.style.top = `${posY}%`;

        const state = { el: btn, kata, x: startX, y: posY, dir, speed, isTarget: kata === jawapan };
        ikanList.push(state);

        if (state.isTarget) {
          GameAsas.tandaBetul(btn);
        }

        btn.onclick = () => {
          if (!soalanAktif) return;

          if (kata === jawapan) {
            soalanAktif = false;

            // Turunkan jaring
            const rectBtn = btn.getBoundingClientRect();
            const rectKolam = kolam.getBoundingClientRect();
            const posX = rectBtn.left - rectKolam.left + rectBtn.width / 2;
            const posY = rectBtn.top - rectKolam.top + rectBtn.height / 2;

            jaringEl.style.left = `${posX}px`;
            jaringEl.style.top = `${posY}px`;
            jaringEl.classList.add('aktif');

            GameAsas.betul(jawapan, btn);

            setTimeout(() => {
              if (GameAsas.pemasa > 0) {
                buatSoalan();
              }
            }, 900);
          } else {
            GameAsas.salah(btn);
            // Ikan berenang laju sedikit bila disalah ketik
            state.speed *= 1.4;
          }
        };

        kolam.appendChild(btn);
      });

      // Gelung pergerakan ikan (berpatah balik di tepi kolam)
      let lastTime = performance.now();
      const gelungIkan = (now) => {
        const dt = Math.min(50, now - lastTime);
        lastTime = now;

        if (soalanAktif) {
          const kolamW = kolam.clientWidth || 360;
          ikanList.forEach((ik) => {
            const ikW = ik.el.clientWidth || 130;
            const maxPct = Math.max(10, ((kolamW - ikW) / kolamW) * 100);

            ik.x += ik.dir * ik.speed * (dt / 16);

            // Berpatah balik jika sampai ke tepi kolam
            if (ik.dir === 1 && ik.x >= maxPct) {
              ik.x = maxPct;
              ik.dir = -1;
              ik.el.classList.add('pusing');
            } else if (ik.dir === -1 && ik.x <= 0) {
              ik.x = 0;
              ik.dir = 1;
              ik.el.classList.remove('pusing');
            }

            ik.el.style.left = `${ik.x}%`;
          });
        }

        this.animFrameId = requestAnimationFrame(gelungIkan);
      };

      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.animFrameId = requestAnimationFrame(gelungIkan);
    };

    buatSoalan();
  },

  henti() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  },
};

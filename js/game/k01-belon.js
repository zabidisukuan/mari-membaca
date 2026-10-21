// Game K1: Pecah Belon (Huruf)

GAME['K1'] = {
  nama: 'Pecah Belon',
  latar: 'lok_k01',
  arahan: 'Pecahkan belon yang membawa huruf sasaran!',

  animFrameId: null,
  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();
    const hurufKolam = (tahap && tahap.huruf) || 'abcdefghijklmnopqrstuvwxyz'.split('');

    el.innerHTML = `
      <div class="belon-game-container">
        <div class="belon-header">
          <span class="arahan-teks">Pecahkan huruf:</span>
          <div class="sasaran-box">
            <span id="belonSasaran" class="huruf-sasaran">a</span>
            <button id="btnDengarHuruf" class="btn-dengar-mini">🔊</button>
          </div>
        </div>
        <div id="belonPentas" class="belon-pentas"></div>
      </div>
    `;

    const pentas = document.getElementById('belonPentas');
    const elSasaran = document.getElementById('belonSasaran');
    const btnDengar = document.getElementById('btnDengarHuruf');

    let soalanAktif = true;
    let belonList = [];

    const buatSoalan = () => {
      pentas.innerHTML = '';
      belonList = [];
      soalanAktif = true;

      const target = U.pick(hurufKolam, 1)[0];
      GameAsas.soalanBaru(target);
      elSasaran.textContent = target;

      Suara.main(target);
      btnDengar.onclick = () => Suara.main(target);

      // Cari pengacau huruf serupa
      const serupaStr = HURUF_SERUPA.filter((g) => g.includes(target)).join('');
      const pengacauBoleh = [...new Set(serupaStr.split('').concat(hurufKolam))].filter((h) => h !== target);
      const pengacauPilihan = U.shuffle(pengacauBoleh).slice(0, 3);

      const pilihanHuruf = U.shuffle([target, ...pengacauPilihan]);
      const xPositions = [12, 32, 52, 72, 88];
      const shuffledX = U.shuffle(xPositions);

      pilihanHuruf.forEach((h, idx) => {
        const belon = document.createElement('button');
        belon.className = 'belon-item';
        const hue = (idx * 75 + Math.floor(Math.random() * 40)) % 360;

        belon.innerHTML = `
          <div class="belon-body" style="filter: hue-rotate(${hue}deg);">
            ${imgV2('s_belon', '🎈', 'belon-img sprite-img')}
          </div>
          <span class="belon-label">${h}</span>
        `;

        const posX = shuffledX[idx % shuffledX.length];
        const startY = 100 + idx * 15; // Jarakkan sikit kedudukan awal Y
        const speed = 0.18 + Math.random() * 0.12; // Kelajuan terapung % per tick

        belon.style.left = `${posX}%`;
        belon.style.top = `${startY}%`;

        const state = { el: belon, h, y: startY, speed, isTarget: h === target };
        belonList.push(state);

        if (state.isTarget) {
          GameAsas.tandaBetul(belon);
        }

        belon.onclick = () => {
          if (!soalanAktif) return;

          if (h === target) {
            soalanAktif = false;
            belon.classList.add('pecah');
            GameAsas.betul(target, belon);

            setTimeout(() => {
              if (GameAsas.pemasa > 0) {
                buatSoalan();
              }
            }, 900);
          } else {
            belon.classList.add('pop-salah');
            GameAsas.salah(belon);
            setTimeout(() => belon.classList.remove('pop-salah'), 400);
          }
        };

        pentas.appendChild(belon);
      });

      // Gelung pergerakan belon
      let lastTime = performance.now();
      const gelungBelon = (now) => {
        const dt = Math.min(50, now - lastTime);
        lastTime = now;

        if (soalanAktif) {
          belonList.forEach((b) => {
            b.y -= b.speed * (dt / 16);
            if (b.y < -20) {
              b.y = 105; // Kitar semula ke bawah
            }
            b.el.style.top = `${b.y}%`;
          });
        }

        this.animFrameId = requestAnimationFrame(gelungBelon);
      };

      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.animFrameId = requestAnimationFrame(gelungBelon);
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

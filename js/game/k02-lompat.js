// Game K2: Lompat Hutan (Suku Kata KV) — gaya platform: ketik blok, watak melompat & menanduk blok dari bawah

GAME['K2'] = {
  nama: 'Lompat Hutan',
  latar: 'lok_k02',
  arahan: 'Ketik blok suku kata mengikut urutan untuk membina perkataan!',

  timers: [],
  animFrameId: null,

  mula(el, tahap, selesai) {
    this.henti();
    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];
    const sukuKolam = [...new Set(gambarSenarai.map((g) => g.w).concat(senaraiKata).flatMap(U.suku))];
    const watak = Murid.watak() || 'aiman';
    const POS_BLOK = [18, 50, 82]; // kedudukan tengah blok (% lebar dunia)

    el.innerHTML = `
      <div class="lompat-game">
        <div class="lompat-papan">
          <div id="lompatGambar"></div>
          <div id="lompatSlot" class="lompat-slot-baris"></div>
        </div>
        <div id="lompatDunia" class="lompat-dunia">
          <div id="lompatNyawa" class="lompat-nyawa"></div>
          <div id="lompatBlok"></div>
          <div id="lompatWatak" class="lompat-watak" style="left: 50%;">
            ${imgV2(watak + '_lari', '🏃', 'lompat-watak-img')}
          </div>
          <div id="lompatTanah" class="lompat-tanah"></div>
        </div>
      </div>
    `;

    const elGambar = document.getElementById('lompatGambar');
    const elSlot = document.getElementById('lompatSlot');
    const dunia = document.getElementById('lompatDunia');
    const elNyawa = document.getElementById('lompatNyawa');
    const elBlok = document.getElementById('lompatBlok');
    const elWatak = document.getElementById('lompatWatak');
    const tanah = document.getElementById('lompatTanah');

    let nyawa = 3;
    let sibuk = false;
    let tamat = false;
    let skrol = 0;
    let watakX = 50;
    let parts = [];
    let langkah = 0;

    const lukisNyawa = () => {
      elNyawa.innerHTML = [0, 1, 2].map((i) => `<span class="${i < nyawa ? '' : 'hilang'}">❤️</span>`).join('');
    };
    lukisNyawa();

    // Gerak watak ke kedudukan x (%), pusing muka ikut arah
    const gerakWatak = (x) => {
      elWatak.classList.toggle('ke-kiri', x < watakX);
      watakX = x;
      elWatak.style.left = `${x}%`;
    };

    // Satu set 3 blok: suku kata betul untuk slot semasa + 2 pengacau
    const buatBlok = () => {
      const betul = parts[langkah];
      const pengacau = U.shuffle(sukuKolam.filter((s) => s !== betul)).slice(0, 2);
      const pilihan = U.shuffle([betul, ...pengacau]);
      elBlok.innerHTML = '';
      pilihan.forEach((suku, i) => {
        const b = document.createElement('button');
        b.className = 'lompat-blok muncul';
        b.style.left = `${POS_BLOK[i]}%`;
        b.dataset.suku = suku;
        b.innerHTML = `${imgV2('s_blok', '🟨', 'lompat-blok-img')}<span class="lompat-blok-teks">${suku}</span>`;
        b.onclick = () => ketik(b, POS_BLOK[i]);
        elBlok.appendChild(b);
        if (suku === betul) GameAsas.tandaBetul(b);
      });
    };

    const buatSoalan = () => {
      const g = U.pick(gambarSenarai, 1)[0] || { w: 'bu-ku', e: '📗' };
      parts = U.suku(g.w);
      langkah = 0;
      GameAsas.soalanBaru(U.kata(g.w));
      elGambar.innerHTML = '';
      elGambar.appendChild(gambarEl(g.img || U.kata(g.w), g.e));
      elSlot.innerHTML = parts.map(() => '<span class="lompat-slot"></span>').join('');
      buatBlok();
      sibuk = false;
    };

    const syiling = (blok) => {
      const s = document.createElement('div');
      s.className = 'lompat-syiling';
      s.innerHTML = imgV2('s_syiling', '🪙', 'lompat-syiling-img');
      s.style.left = blok.style.left;
      dunia.appendChild(s);
      setTimeout(() => s.remove(), 700);
    };

    // Watak berlari ke kanan: latar & tanah bergerak, kemudian perkataan seterusnya
    const larike = () => {
      elBlok.querySelectorAll('.lompat-blok').forEach((b) => b.classList.add('pergi'));
      elWatak.classList.remove('ke-kiri');
      elWatak.classList.add('berlari');
      let mula = null;
      const gelung = (now) => {
        if (mula === null) mula = now;
        const t = now - mula;
        skrol += 6;
        dunia.style.backgroundPositionX = `${-skrol * 0.4}px`;
        tanah.style.backgroundPositionX = `${-skrol}px, 0`;
        if (t < 1100) {
          this.animFrameId = requestAnimationFrame(gelung);
        } else {
          elWatak.classList.remove('berlari');
          if (GameAsas.pemasa > 0 && !tamat) buatSoalan();
        }
      };
      this.animFrameId = requestAnimationFrame(gelung);
    };

    const ketik = (blok, x) => {
      if (sibuk || tamat) return;
      sibuk = true;
      gerakWatak(x);
      // Tunggu watak sampai di bawah blok, kemudian lompat
      this.tunda(() => {
        const rW = elWatak.getBoundingClientRect();
        const rB = blok.getBoundingClientRect();
        elWatak.style.setProperty('--tinggi', `${Math.max(40, rW.top - rB.bottom + 6)}px`);
        elWatak.classList.add('melompat');
        // Kepala sampai ke blok di puncak lompatan
        this.tunda(() => tanduk(blok), 230);
        this.tunda(() => elWatak.classList.remove('melompat'), 520);
      }, 320);
    };

    const tanduk = (blok) => {
      const suku = blok.dataset.suku;
      blok.classList.add('ditanduk');
      setTimeout(() => blok.classList.remove('ditanduk'), 300);

      if (suku === parts[langkah]) {
        syiling(blok);
        Bunyi.betul();
        const slot = elSlot.children[langkah];
        slot.textContent = suku;
        slot.classList.add('isi');
        langkah++;
        if (langkah < parts.length) {
          Suara.main(suku);
          this.tunda(() => { buatBlok(); sibuk = false; }, 450);
        } else {
          GameAsas.betul(U.kata(parts.join('-')), elSlot);
          this.tunda(larike, 500);
        }
      } else {
        blok.classList.add('salah');
        setTimeout(() => blok.classList.remove('salah'), 450);
        GameAsas.salah();
        nyawa--;
        lukisNyawa();
        this.tunda(() => elWatak.classList.add('jatuh'), 280);
        this.tunda(() => elWatak.classList.remove('jatuh'), 900);
        if (nyawa <= 0) {
          tamat = true;
          this.tunda(() => selesai({ nyawaHabis: true }), 1000);
        } else {
          this.tunda(() => { sibuk = false; }, 900);
        }
      }
    };

    buatSoalan();
  },

  // setTimeout yang dijejak supaya henti() boleh membatalkan semuanya
  tunda(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  },

  henti() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.timers.forEach(clearTimeout);
    this.timers = [];
  },
};

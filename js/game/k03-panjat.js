// Game K3: Panjat Bukit (Perkataan KVKVKV) — platform gaya Mario: murid gerak (← → / butang skrin) & lompat
// (Space / ↑ / butang ⤒), mendaki 3 tingkat platform dan memijak suku kata yang betul. Pengacau runtuh bila dipijak.
//
// Koordinat dunia dalam unit "u" = 1% tinggi pentas; y diukur dari permukaan tanah ke atas.

GAME['K3'] = {
  nama: 'Panjat Bukit',
  latar: 'lok_k03',
  masa: 120,
  arahan: 'Gerak dan lompat untuk memijak suku kata yang betul!',

  timers: [],
  animFrameId: null,
  lepasKekunci: null,

  mula(el, tahap, selesai) {
    this.henti();
    const gambarSenarai = (tahap && tahap.gambar) || [];
    const senaraiKata = (tahap && tahap.senarai && typeof tahap.senarai === 'string') ? tahap.senarai.split(' ') : [];
    const sukuKolam = [...new Set(gambarSenarai.map((g) => g.w).concat(senaraiKata).flatMap(U.suku))];
    const watak = Murid.watak() || 'aiman';
    const sentuh = window.matchMedia && matchMedia('(pointer: coarse)').matches;

    // Fizik (unit u & saat)
    const TANAH = 15;          // tinggi jalur tanah (u)
    const GRAVITI = 230;
    const LOMPAT = 104;        // laju awal lompat → puncak ≈ 23.5u (cukup untuk naik satu tingkat 18u)
    const LARI = 40;
    const PEMAIN_L = 14, PEMAIN_T = 20;
    const PLAT_L = 28, PLAT_T = 9;
    const TINGKAT_Y = [18, 36, 54];

    el.innerHTML = `
      <div class="lompat-game">
        <div class="lompat-papan">
          <div id="panjatGambar"></div>
          <div id="panjatSlot" class="lompat-slot-baris"></div>
        </div>
        <div id="panjatDunia" class="lompat-dunia panjat-dunia">
          <div id="panjatNyawa" class="lompat-nyawa"></div>
          <div id="panjatPetunjuk" class="panjat-petunjuk">${sentuh
            ? 'Tekan ◀ ▶ untuk bergerak, ⤒ untuk melompat'
            : '⬅️ ➡️ untuk bergerak · <b>Spacebar</b> untuk melompat'}</div>
          <div id="panjatAlam" class="panjat-alam">
            <div id="panjatWatak" class="panjat-watak">${imgV2(watak + '_lari', '🏃', 'lompat-watak-img')}</div>
          </div>
          <div id="panjatTanah" class="lompat-tanah"></div>
          <div class="panjat-kawal${sentuh ? ' tunjuk' : ''}">
            <div class="panjat-kawal-kiri">
              <button class="panjat-btn" data-kawal="kiri" aria-label="Kiri">◀</button>
              <button class="panjat-btn" data-kawal="kanan" aria-label="Kanan">▶</button>
            </div>
            <button class="panjat-btn panjat-btn-lompat" data-kawal="lompat" aria-label="Lompat">⤒</button>
          </div>
        </div>
      </div>
    `;

    const elGambar = document.getElementById('panjatGambar');
    const elSlot = document.getElementById('panjatSlot');
    const dunia = document.getElementById('panjatDunia');
    const alam = document.getElementById('panjatAlam');
    const elWatak = document.getElementById('panjatWatak');
    const elNyawa = document.getElementById('panjatNyawa');
    const tanah = document.getElementById('panjatTanah');
    this.tunda(() => document.getElementById('panjatPetunjuk')?.classList.add('hilang'), 5000);

    let nyawa = 3;
    let tamat = false;
    let bilKata = 0;
    let parts = [];
    let langkah = 0;
    let platform = [];  // { x, y, suku, betul, keadaan: 'aktif'|'kekal'|'runtuh', el, vy }
    let lebarDunia = 200;
    const p = { x: 12, y: 0, vx: 0, vy: 0, atas: null, diTanah: true, arahKiri: false };
    const kekunci = { kiri: false, kanan: false, lompat: false };
    let mintaLompat = false;

    const lukisNyawa = () => {
      elNyawa.innerHTML = [0, 1, 2].map((i) => `<span class="${i < nyawa ? '' : 'hilang'}">❤️</span>`).join('');
    };
    lukisNyawa();

    const buatPlatformEl = (pl) => {
      const d = document.createElement('div');
      d.className = 'panjat-platform muncul';
      d.innerHTML = `${imgV2('s_platform', '🟫', 'panjat-platform-img')}<span class="panjat-platform-teks">${pl.suku}</span>`;
      alam.appendChild(d);
      pl.el = d;
      if (pl.betul) GameAsas.tandaBetul(d);
      return d;
    };

    // Satu tingkat: platform betul + pengacau, semua dalam jangkauan lompatan dari platform betul sebelumnya
    const buatTingkat = (i, dariX) => {
      const sukar = bilKata >= 2;
      const offset = sukar ? [-30, 2, 34, 66] : [-22, 12, 46];
      const betul = parts[i];
      const pengacau = U.shuffle(sukuKolam.filter((s) => !parts.includes(s))).slice(0, offset.length - 1);
      const suku = U.shuffle([betul, ...pengacau]);
      offset.forEach((o, k) => {
        const x = Math.max(PLAT_L / 2 + 2, dariX + o);
        const pl = { x, y: TINGKAT_Y[i], suku: suku[k], betul: suku[k] === betul, keadaan: 'aktif', vy: 0 };
        platform.push(pl);
        buatPlatformEl(pl);
        lebarDunia = Math.max(lebarDunia, x + 60);
      });
    };

    const buatSoalan = () => {
      const g = U.pick(gambarSenarai, 1)[0] || { w: 'ke-la-pa', e: '🥥' };
      parts = U.suku(g.w);
      langkah = 0;
      GameAsas.soalanBaru(U.kata(g.w));
      elGambar.innerHTML = '';
      elGambar.appendChild(gambarEl(g.img || U.kata(g.w), g.e));
      elSlot.innerHTML = parts.map(() => '<span class="lompat-slot"></span>').join('');
      platform.forEach((pl) => pl.el.remove());
      alam.querySelectorAll('.panjat-bendera').forEach((b) => b.remove());
      platform = [];
      lebarDunia = 200;
      Object.assign(p, { x: 12, y: 0, vx: 0, vy: 0, atas: null, diTanah: true });
      buatTingkat(0, 42 + Math.random() * 8);
    };

    const syiling = (pl) => {
      const s = document.createElement('div');
      s.className = 'lompat-syiling';
      s.innerHTML = imgV2('s_syiling', '🪙', 'lompat-syiling-img');
      s.style.left = `calc(${pl.x} * var(--u))`;
      s.style.bottom = `calc(${TANAH + pl.y + PEMAIN_T} * var(--u))`;
      s.style.top = 'auto';
      alam.appendChild(s);
      setTimeout(() => s.remove(), 700);
    };

    const pijak = (pl) => {
      if (pl.keadaan !== 'aktif' || tamat) return;
      if (pl.betul) {
        pl.keadaan = 'kekal';
        pl.el.classList.add('betul');
        syiling(pl);
        Bunyi.betul();
        const slot = elSlot.children[langkah];
        slot.textContent = pl.suku;
        slot.classList.add('isi');
        // Pengacau tingkat ini hilang supaya laluan jelas
        platform.filter((q) => q.keadaan === 'aktif').forEach((q) => { q.keadaan = 'hilang'; q.el.classList.add('pudar'); });
        langkah++;
        if (langkah < parts.length) {
          Suara.main(pl.suku);
          this.tunda(() => buatTingkat(langkah, pl.x), 250);
        } else {
          const b = document.createElement('div');
          b.className = 'panjat-bendera';
          b.innerHTML = imgV2('s_bendera', '🚩', 'panjat-bendera-img');
          b.style.left = `calc(${pl.x + 4} * var(--u))`;
          b.style.bottom = `calc(${TANAH + pl.y} * var(--u))`;
          alam.appendChild(b);
          GameAsas.betul(U.kata(parts.join('-')), elSlot);
          bilKata++;
          this.tunda(() => { if (!tamat && GameAsas.pemasa > 0) buatSoalan(); }, 1800);
        }
      } else {
        pl.keadaan = 'runtuh';
        pl.el.classList.add('runtuh');
        GameAsas.salah();
        nyawa--;
        lukisNyawa();
        p.atas = null;
        p.vy = 20; // lantun kecil sebelum jatuh
        if (nyawa <= 0) {
          tamat = true;
          this.tunda(() => selesai({ nyawaHabis: true }), 1100);
        }
      }
    };

    // Ujian automatik: letak watak tepat di atas platform (elemen DOM) supaya ia mendarat
    this._ujiPijak = (elPl) => {
      const pl = platform.find((q) => q.el === elPl);
      if (pl) Object.assign(p, { x: pl.x, y: pl.y + 3, vx: 0, vy: -1, atas: null, diTanah: false });
    };

    // ---------- Kawalan ----------
    const peta = { ArrowLeft: 'kiri', ArrowRight: 'kanan', ArrowUp: 'lompat', ' ': 'lompat', Spacebar: 'lompat', a: 'kiri', d: 'kanan', w: 'lompat' };
    const tekan = (e) => {
      const k = peta[e.key];
      if (!k) return;
      e.preventDefault();
      if (k === 'lompat' && !kekunci.lompat) mintaLompat = true;
      kekunci[k] = true;
    };
    const lepas = (e) => {
      const k = peta[e.key];
      if (k) { kekunci[k] = false; e.preventDefault(); }
    };
    window.addEventListener('keydown', tekan);
    window.addEventListener('keyup', lepas);
    this.lepasKekunci = () => {
      window.removeEventListener('keydown', tekan);
      window.removeEventListener('keyup', lepas);
    };
    dunia.querySelectorAll('.panjat-btn').forEach((b) => {
      const k = b.dataset.kawal;
      const on = (e) => { e.preventDefault(); if (k === 'lompat') mintaLompat = true; kekunci[k] = true; b.classList.add('ditekan'); };
      const off = () => { kekunci[k] = false; b.classList.remove('ditekan'); };
      b.addEventListener('pointerdown', on);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => b.addEventListener(ev, off));
      b.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    // ---------- Gelung fizik ----------
    // Satu langkah fizik kecil (dt ≤ 1/60 s) supaya kelajuan sama walaupun peranti perlahan
    const langkahFizik = (dt) => {
      if (!tamat) {
        // Gerak mendatar
        p.vx = (kekunci.kanan ? LARI : 0) - (kekunci.kiri ? LARI : 0);
        if (p.vx) p.arahKiri = p.vx < 0;
        // Lompat (hanya bila berpijak)
        if (mintaLompat && (p.diTanah || p.atas)) {
          p.vy = LOMPAT;
          p.atas = null;
          p.diTanah = false;
        }
        mintaLompat = false;

        const yLama = p.y;
        p.x = Math.min(lebarDunia - PEMAIN_L / 2, Math.max(PEMAIN_L / 2, p.x + p.vx * dt));
        if (p.atas) {
          // Berjalan keluar dari tepi platform → jatuh
          if (Math.abs(p.x - p.atas.x) > PLAT_L / 2 + PEMAIN_L * 0.25 || p.atas.keadaan === 'runtuh' || p.atas.keadaan === 'hilang') p.atas = null;
          else p.y = p.atas.y;
        }
        if (!p.atas && !p.diTanah) {
          p.vy -= GRAVITI * dt;
          p.y += p.vy * dt;
          // Mendarat dari atas sahaja (platform satu hala)
          if (p.vy <= 0) {
            for (const pl of platform) {
              if (pl.keadaan === 'runtuh' || pl.keadaan === 'hilang') continue;
              if (yLama >= pl.y - 0.5 && p.y <= pl.y && Math.abs(p.x - pl.x) <= PLAT_L / 2 + PEMAIN_L * 0.25) {
                p.y = pl.y; p.vy = 0; p.atas = pl;
                pijak(pl);
                break;
              }
            }
          }
          if (p.y <= 0) { p.y = 0; p.vy = 0; p.diTanah = true; }
        } else if (!p.atas && p.diTanah && p.y > 0) {
          p.diTanah = false;
        }
        if (!p.atas && p.y > 0) p.diTanah = false;
      }
      platform.forEach((pl) => {
        if (pl.keadaan === 'runtuh') { pl.vy -= GRAVITI * dt; pl.y += pl.vy * dt; }
      });
    };

    let akhir = performance.now();
    const gelung = (now) => {
      let baki = Math.min(0.25, (now - akhir) / 1000);
      akhir = now;
      while (baki > 0) {
        const dt = Math.min(baki, 1 / 60);
        langkahFizik(dt);
        baki -= dt;
      }
      const H = dunia.clientHeight || 400;
      const u = H / 100;
      dunia.style.setProperty('--u', `${u}px`);
      const lebarPandang = dunia.clientWidth / u;

      platform.forEach((pl) => {
        pl.el.style.left = `${(pl.x - PLAT_L / 2) * u}px`;
        pl.el.style.bottom = `${(TANAH + pl.y - PLAT_T) * u}px`;
        if (pl.y < -40 && pl.el.isConnected) pl.el.remove();
      });

      // Watak & kamera
      elWatak.style.left = `${(p.x - PEMAIN_L / 2) * u}px`;
      elWatak.style.bottom = `${(TANAH + p.y) * u}px`;
      elWatak.classList.toggle('ke-kiri', p.arahKiri);
      elWatak.classList.toggle('berlari', !!p.vx && (p.diTanah || !!p.atas));
      elWatak.classList.toggle('di-udara', !p.diTanah && !p.atas);
      const kamera = Math.max(0, Math.min(lebarDunia - lebarPandang, p.x - lebarPandang * 0.4));
      alam.style.transform = `translateX(${-kamera * u}px)`;
      dunia.style.backgroundPositionX = `${-kamera * u * 0.3}px`;
      tanah.style.backgroundPositionX = `${-kamera * u}px, 0`;

      this.animFrameId = requestAnimationFrame(gelung);
    };

    buatSoalan();
    this.animFrameId = requestAnimationFrame(gelung);
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
    if (this.lepasKekunci) {
      this.lepasKekunci();
      this.lepasKekunci = null;
    }
  },
};

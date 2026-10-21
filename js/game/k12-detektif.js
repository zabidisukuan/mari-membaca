// Game K12: Detektif Cerita (Kefahaman Petikan)

function cariBarisJawapan(teksArray, jawapanStr) {
  if (!Array.isArray(teksArray) || !teksArray.length || !jawapanStr) {
    console.warn('CariBarisJawapan: teksArray atau jawapanStr tidak sah:', teksArray, jawapanStr);
    return 0;
  }

  // Kata umum / kata gelaran yang diabaikan untuk carian kata kunci khusus
  const KATA_UMUM = new Set([
    'ya', 'tidak', 'ini', 'di', 'semasa', 'bas', 'doktor', 'bapa', 'kak', 'cikgu', 'ia', 'itu', 'ada', 'yang'
  ]);

  const perkataanJawapan = jawapanStr
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .split(/\s+/)
    .filter((w) => w && !KATA_UMUM.has(w));

  const senaraiCari = perkataanJawapan.length > 0
    ? perkataanJawapan
    : jawapanStr.toLowerCase().replace(/[^a-z0-9\- ]/g, '').split(/\s+/).filter((w) => w !== 'ya' && w !== 'tidak');

  for (let i = 0; i < teksArray.length; i++) {
    const barisBersih = teksArray[i].toLowerCase().replace(/[^a-z0-9\- ]/g, '');
    for (const kw of senaraiCari) {
      if (barisBersih.includes(kw)) {
        return i;
      }
    }
  }

  // Jika tiada match dengan kata khusus, cuba sebarang perkataan dari jawapanStr
  const kataSemua = jawapanStr.toLowerCase().replace(/[^a-z0-9\- ]/g, '').split(/\s+/).filter((w) => w !== 'ya' && w !== 'tidak');
  for (let i = 0; i < teksArray.length; i++) {
    const barisBersih = teksArray[i].toLowerCase().replace(/[^a-z0-9\- ]/g, '');
    for (const kw of kataSemua) {
      if (barisBersih.includes(kw)) {
        return i;
      }
    }
  }

  console.warn('⚠️ CariBarisJawapan: Tiada baris ditemui untuk jawapan:', jawapanStr, 'dalam teks:', teksArray);
  return 0;
}

GAME['K12'] = {
  nama: 'Detektif Cerita',
  latar: 'lok_k12',
  arahan: 'Ketik baris petikan yang mengandungi jawapan!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    const petikanList = (tahap && tahap.petikan) || [];

    // Fallback daripada DATA jika tahap tiada petikan
    const fallbackTahap = (window.DATA && window.DATA.tahap && window.DATA.tahap.find((t) => t.id === 'K12')) || {};
    const senaraiPetikan = petikanList.length ? petikanList : fallbackTahap.petikan || [];

    // Kumpulkan semua pasangan { petikan, soalan }
    const kolamSoalan = senaraiPetikan.flatMap((p) =>
      (p.soalan || []).map((s) => ({ petikan: p, soalan: s }))
    );

    el.innerHTML = `
      <div class="detektif-game-container">
        <div class="soalan-detektif-box">
          <span class="kanta-header-icon">
            ${imgV2('s_kanta', '🔍', 'kanta-header-img sprite-img')}
          </span>
          <h3 id="teksSoalanDetektif" class="teks-soalan-detektif">Soalan...</h3>
        </div>

        <div class="petikan-detektif-card">
          <div id="petikanGambarBox" class="petikan-gambar-box"></div>
          <div id="barisTeksList" class="baris-teks-list"></div>
        </div>

        <div id="jawapanBanner" class="jawapan-banner" hidden></div>
      </div>
    `;

    const teksSoalan = document.getElementById('teksSoalanDetektif');
    const gambarBox = document.getElementById('petikanGambarBox');
    const barisTeksList = document.getElementById('barisTeksList');
    const jawapanBanner = document.getElementById('jawapanBanner');

    let soalanAktif = true;

    const buatSoalan = () => {
      gambarBox.innerHTML = '';
      barisTeksList.innerHTML = '';
      jawapanBanner.hidden = true;
      jawapanBanner.className = 'jawapan-banner';
      soalanAktif = true;

      const item = U.pick(kolamSoalan, 1)[0] || {
        petikan: {
          img: 'bas_kuning',
          e: '🚌',
          teks: ['Ini bas.', 'Ini bas bapa Abu.', 'Bapa Abu baru beli bas.', 'Bas ini berwarna kuning.'],
        },
        soalan: { q: 'Ini bas siapa?', opsyen: ['Bapa Abu', 'Kak Ros', 'Doktor Ramli'] },
      };

      const p = item.petikan;
      const s = item.soalan;
      const jawapanBetul = s.opsyen[0];
      const barisBetulIdx = cariBarisJawapan(p.teks, jawapanBetul);

      GameAsas.soalanBaru(jawapanBetul);

      teksSoalan.textContent = s.q;
      gambarBox.appendChild(gambarEl(p.img, p.e));

      const barisButtons = [];

      p.teks.forEach((barisTeks, idx) => {
        const btn = document.createElement('button');
        btn.className = 'baris-btn';
        btn.innerHTML = `
          <span class="kanta-indicator">
            ${imgV2('s_kanta', '🔍', 'kanta-baris-img sprite-img')}
          </span>
          <span class="baris-teks-isi">${barisTeks}</span>
        `;

        barisTeksList.appendChild(btn);
        barisButtons.push(btn);

        if (idx === barisBetulIdx) {
          GameAsas.tandaBetul(btn);
        }

        btn.onclick = () => {
          if (!soalanAktif) return;

          // Alihkan penunjuk kanta ke baris yang diketik
          barisButtons.forEach((b) => b.classList.remove('kanta-aktif'));
          btn.classList.add('kanta-aktif');

          if (idx === barisBetulIdx) {
            soalanAktif = false;
            barisButtons.forEach((b) => (b.disabled = true));

            btn.classList.add('baris-diserlah-betul');

            jawapanBanner.hidden = false;
            jawapanBanner.innerHTML = `Jawapan: <strong>${jawapanBetul}</strong>`;
            jawapanBanner.classList.add('banner-muncul');

            GameAsas.betul(jawapanBetul, btn);

            this.timerId = setTimeout(() => {
              if (GameAsas.pemasa > 0) {
                buatSoalan();
              }
            }, 1400);
          } else {
            btn.classList.add('baris-diserlah-salah');
            GameAsas.salah(btn);
            setTimeout(() => btn.classList.remove('baris-diserlah-salah'), 500);
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

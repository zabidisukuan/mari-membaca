// Game K11: Kereta Api Ayat (Membaca Ayat)

GAME['K11'] = {
  nama: 'Kereta Api Ayat',
  latar: 'lok_k11',
  arahan: 'Sambungkan gerabak perkataan mengikut urutan ayat!',

  timerId: null,

  mula(el, tahap, selesai) {
    this.henti();

    const ayatList = (tahap && tahap.ayat) || [];

    // Fallback daripada DATA jika tahap tiada ayat
    const fallbackTahap = (window.DATA && window.DATA.tahap && window.DATA.tahap.find((t) => t.id === 'K11')) || {};
    const senaraiAyat = ayatList.length ? ayatList : fallbackTahap.ayat || [];

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
      trenBox.className = 'kereta-tren';
      soalanAktif = true;

      const item = U.pick(senaraiAyat, 1)[0] || {
        s: 'Mereka sedang membaca buku cerita.',
        img: 'ayat01',
        e: '📚',
      };
      const ayatLengkap = item.s;
      const perkataanList = ayatLengkap.split(' ');

      GameAsas.soalanBaru(ayatLengkap);
      gambarBox.appendChild(gambarEl(item.img || ayatLengkap, item.e));

      // Sediakan slot gerabak kosong mengikut bilangan perkataan
      const slotList = [];
      perkataanList.forEach(() => {
        const slot = document.createElement('div');
        slot.className = 'slot-gerabak kosong';
        slot.textContent = '?';
        slotRow.appendChild(slot);
        slotList.push(slot);
      });

      let langkahIndeks = 0;

      // Kocok perkataan untuk pilihan gerabak
      // Gunakan objek dengan id unik untuk menangani perkataan berulang dalam ayat
      const gerabakObjList = U.shuffle(
        perkataanList.map((kata, idx) => ({ id: idx, kata }))
      );

      const gerabakButtons = [];

      gerabakObjList.forEach((obj) => {
        const btn = document.createElement('button');
        btn.className = 'gerabak-item';
        btn.innerHTML = `
          ${imgV2('s_gerabak', '   ', 'gerabak-img sprite-img')}
          <span class="gerabak-label">${obj.kata}</span>
        `;
        btn.dataset.id = obj.id;
        btn.dataset.kata = obj.kata;

        pilihanBox.appendChild(btn);
        gerabakButtons.push({ btn, obj });

        btn.onclick = () => {
          if (!soalanAktif || btn.disabled) return;

          const sasaranKata = perkataanList[langkahIndeks];
          if (obj.kata === sasaranKata) {
            btn.disabled = true;
            btn.classList.add('dipilih');

            // Isi slot gerabak
            const targetSlot = slotList[langkahIndeks];
            targetSlot.className = 'slot-gerabak diisi';
            targetSlot.innerHTML = `
              ${imgV2('s_gerabak', '   ', 'gerabak-img sprite-img')}
              <span class="gerabak-label">${obj.kata}</span>
            `;

            langkahIndeks++;

            if (langkahIndeks < perkataanList.length) {
              kemaskiniTanda();
            } else {
              soalanAktif = false;
              GameAsas.betul(ayatLengkap, trenBox);
              trenBox.classList.add('kereta-jalan');

              this.timerId = setTimeout(() => {
                if (GameAsas.pemasa > 0) {
                  buatSoalan();
                }
              }, 1300);
            }
          } else {
            GameAsas.salah(btn);
          }
        };
      });

      const kemaskiniTanda = () => {
        const sasaranKata = perkataanList[langkahIndeks];
        // Cari SATU gerabak yang belum digunakan dan sepadan dengan sasaran
        const sasaranPadan = gerabakButtons.find(
          (item) => !item.btn.disabled && item.obj.kata === sasaranKata
        );
        if (sasaranPadan) {
          GameAsas.tandaBetul(sasaranPadan.btn);
        }
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

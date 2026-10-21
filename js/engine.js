// Enjin game: skrin, murid, kemajuan (bintang), suara dan penghantaran markah ke Google Sheet.

const Simpan = {
  get(k, def) {
    try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch { return def; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storan disekat: teruskan tanpa simpan */ }
  },
};

// ---------- Bunyi kesan (WebAudio, tiada fail) ----------
const Bunyi = (() => {
  let ctx;
  function nada(freqs, dur = 0.12, type = 'sine') {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = f;
        const t = ctx.currentTime + i * dur;
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.6);
        o.connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + dur * 1.7);
      });
    } catch { /* tiada audio */ }
  }
  return {
    betul: () => nada([660, 880]),
    salah: () => nada([220, 180], 0.15, 'triangle'),
    menang: () => nada([523, 659, 784, 1047], 0.14),
  };
})();

// ---------- Suara: fail assets/audio/<id>.wav jika ada, jika tiada guna suara pelayar ms-MY ----------
const Suara = (() => {
  let fail = new Set();
  let suaraMs = null;
  const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);

  fetch('assets/audio/index.json').then((r) => (r.ok ? r.json() : [])).then((l) => (fail = new Set(l))).catch(() => {});
  function cariSuara() {
    if (!('speechSynthesis' in window)) return;
    suaraMs = speechSynthesis.getVoices().find((v) => /^ms([-_]|$)/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { cariSuara(); speechSynthesis.onvoiceschanged = cariSuara; }

  const ada = (teks) => fail.has(slug(teks)) || !!suaraMs;

  function main(teks) {
    const id = slug(teks);
    if (fail.has(id)) {
      new Audio(`assets/audio/${id}.wav`).play().catch(() => {});
    } else if (suaraMs) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(teks);
      u.voice = suaraMs; u.lang = suaraMs.lang; u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  }

  function butang(teks) {
    const b = U.el('button', 'butang-suara', '🔊');
    b.setAttribute('aria-label', 'Dengar');
    b.onclick = () => main(teks);
    // Senarai fail dimuat secara async; sembunyi butang jika tiada sumber suara
    b.hidden = !ada(teks);
    setTimeout(() => (b.hidden = !ada(teks)), 800);
    return b;
  }

  return { main, butang, slug };
})();

// ---------- Murid & kemajuan ----------
const Murid = {
  semasa: () => Simpan.get('mm_murid', null),
  kunci: (m) => [m.kodSekolah, m.nama, m.tahun, m.kelas].map((x) => String(x).trim().toLowerCase()).join('|'),
  set(m) {
    Simpan.set('mm_murid', m);
    const senarai = Simpan.get('mm_senarai_murid', []).filter((x) => Murid.kunci(x) !== Murid.kunci(m));
    Simpan.set('mm_senarai_murid', [m, ...senarai].slice(0, 40));
  },
  kemajuan: () => Simpan.get('mm_kemajuan_' + Murid.kunci(Murid.semasa()), {}),
  simpanKemajuan(id, peratus) {
    const k = Murid.kemajuan();
    if (!k[id] || peratus > k[id]) k[id] = peratus;
    Simpan.set('mm_kemajuan_' + Murid.kunci(Murid.semasa()), k);
  },
};

const bintang = (p) => (p >= 90 ? 3 : p >= 70 ? 2 : p >= 50 ? 1 : 0);
const LULUS = 50;

// ---------- Hantar markah (dengan baris gilir luar talian) ----------
const Markah = {
  hantar(konstruk, peratus) {
    const m = Murid.semasa();
    const q = Simpan.get('mm_giliran', []);
    q.push({ kodSekolah: m.kodSekolah, namaSekolah: m.namaSekolah, nama: m.nama, tahun: m.tahun, kelas: m.kelas, konstruk, peratus });
    Simpan.set('mm_giliran', q);
    return Markah.flush();
  },
  async flush() {
    if (!CONFIG.URL_MARKAH) return false;
    let q = Simpan.get('mm_giliran', []);
    while (q.length) {
      try {
        // text/plain + no-cors elak preflight CORS; Apps Script tetap menerima badan JSON
        await fetch(CONFIG.URL_MARKAH, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(q[0]) });
      } catch {
        return false;
      }
      q = Simpan.get('mm_giliran', []).slice(1);
      Simpan.set('mm_giliran', q);
    }
    return true;
  },
};
window.addEventListener('online', () => Markah.flush());

// ---------- Skrin ----------
const app = document.getElementById('app');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
let modGuru = Simpan.get('mm_mod_guru', false);

function skrin(html) {
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

function skrinDaftar() {
  const p = new URLSearchParams(location.search);
  const m = Murid.semasa() || {};
  const nilai = (k, param) => esc(p.get(param) || m[k] || '');
  const senarai = Simpan.get('mm_senarai_murid', []);
  skrin(`
    <div class="daftar">
      <h1 class="tajuk-utama">Mari Membaca</h1>
      <p class="sub">Konstruk 1–12</p>
      ${senarai.length ? `<div class="murid-lama"><p>Pilih nama anda:</p>${senarai.map((s, i) =>
        `<button class="chip" data-i="${i}">${esc(s.nama)} <small>${esc(s.tahun)} ${esc(s.kelas)}</small></button>`).join('')}</div><p class="atau">atau daftar baharu</p>` : ''}
      <form id="borang" autocomplete="off">
        <label>Kod sekolah<input name="kodSekolah" required value="${nilai('kodSekolah', 'kod')}"></label>
        <label>Nama sekolah<input name="namaSekolah" required value="${nilai('namaSekolah', 'sekolah')}"></label>
        <label>Nama murid<input name="nama" required value=""></label>
        <div class="dua">
          <label>Tahun<select name="tahun" required>${[1, 2, 3, 4, 5, 6].map((t) =>
            `<option ${String(t) === (p.get('tahun') || m.tahun || '1') ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
          <label>Kelas<input name="kelas" required value="${nilai('kelas', 'kelas')}"></label>
        </div>
        <button class="besar" type="submit">Mula ▶</button>
      </form>
    </div>`);
  app.querySelectorAll('.chip').forEach((b) => (b.onclick = () => { Murid.set(senarai[b.dataset.i]); skrinPeta(); }));
  document.getElementById('borang').onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    for (const k in f) f[k] = f[k].trim().replace(/\s+/g, ' ');
    f.kodSekolah = f.kodSekolah.toUpperCase();
    Murid.set(f);
    skrinPeta();
  };
}

function skrinPeta() {
  const m = Murid.semasa();
  const k = Murid.kemajuan();
  const kad = DATA.tahap.map((t, i) => {
    const p = k[t.id];
    const buka = modGuru || i === 0 || (k[DATA.tahap[i - 1].id] || 0) >= LULUS;
    const b = p == null ? 0 : bintang(p);
    return `<button class="tahap ${buka ? '' : 'kunci'} ${p != null ? 'siap' : ''}" data-i="${i}" ${buka ? '' : 'disabled'}>
      <span class="ikon">${buka ? t.ikon : '🔒'}</span>
      <span class="kod">${t.id}</span>
      <span class="nama">${t.tajuk}</span>
      <span class="bintang">${'★'.repeat(b)}${'☆'.repeat(3 - b)}</span>
      ${p != null ? `<span class="peratus">${p}%</span>` : ''}
    </button>`;
  }).join('');
  skrin(`
    <header class="atas">
      <h1 id="logo">Mari Membaca</h1>
      <div class="murid">👤 ${esc(m.nama)} <small>(${esc(m.tahun)} ${esc(m.kelas)})</small> <button id="tukar" class="kecil">Tukar</button></div>
    </header>
    ${modGuru ? '<p class="guru">Mod guru: semua tahap dibuka. <button id="tutupGuru" class="kecil">Tutup</button></p>' : ''}
    <div class="peta">${kad}</div>
    <p class="status" id="status"></p>`);
  app.querySelectorAll('.tahap').forEach((b) => (b.onclick = () => mainTahap(DATA.tahap[b.dataset.i])));
  document.getElementById('tukar').onclick = skrinDaftar;
  // Ketik logo 5 kali untuk mod guru
  let ketik = 0;
  document.getElementById('logo').onclick = () => {
    if (++ketik >= 5) { modGuru = true; Simpan.set('mm_mod_guru', true); skrinPeta(); }
  };
  const tg = document.getElementById('tutupGuru');
  if (tg) tg.onclick = () => { modGuru = false; Simpan.set('mm_mod_guru', false); skrinPeta(); };
  const tertunda = Simpan.get('mm_giliran', []).length;
  if (tertunda) document.getElementById('status').textContent = `${tertunda} markah belum dihantar. Akan dihantar apabila ada internet.`;
}

function mainTahap(t) {
  const soalan = binaSoalan(t);
  let i = 0, betul = 0;
  skrin(`
    <header class="atas main">
      <button id="keluar" class="kecil" aria-label="Keluar">✕</button>
      <div class="kemajuan"><div id="bar"></div></div>
      <span class="label">${t.id}</span>
    </header>
    <main id="pentas"></main>`);
  document.getElementById('keluar').onclick = skrinPeta;
  const pentas = document.getElementById('pentas');
  const bar = document.getElementById('bar');

  function seterusnya() {
    bar.style.width = `${(i / soalan.length) * 100}%`;
    if (i >= soalan.length) return tamat();
    const q = soalan[i];
    window.soalanSemasa = q; // untuk ujian automatik
    render(q, pentas, (ok) => {
      if (ok) betul++;
      Bunyi.betul();
      Suara.main(q.suara);
      pentas.querySelector('.kad-soalan').classList.add('berjaya');
      i++;
      setTimeout(seterusnya, q.type === 'susun' || q.type === 'faham' ? 1800 : 1200);
    });
  }

  async function tamat() {
    const peratus = Math.round((betul / soalan.length) * 100);
    Murid.simpanKemajuan(t.id, peratus);
    const b = bintang(peratus);
    if (b) Bunyi.menang();
    const idx = DATA.tahap.indexOf(t);
    const lagi = DATA.tahap[idx + 1];
    skrin(`
      <div class="keputusan">
        <h2>${b >= 2 ? 'Syabas!' : b === 1 ? 'Bagus!' : 'Cuba lagi!'}</h2>
        <div class="bintang-besar">${'★'.repeat(b)}${'☆'.repeat(3 - b)}</div>
        <p class="markah">${betul} / ${soalan.length} betul &nbsp;·&nbsp; <b>${peratus}%</b></p>
        <p class="status" id="status">Menghantar markah…</p>
        <div class="butang-butang">
          <button id="ulang" class="besar kedua">↻ Ulang</button>
          ${lagi && (peratus >= LULUS || modGuru) ? '<button id="lagi" class="besar">Seterusnya ▶</button>' : ''}
          <button id="peta" class="besar kedua">🗺️ Peta</button>
        </div>
      </div>`);
    document.getElementById('ulang').onclick = () => mainTahap(t);
    document.getElementById('peta').onclick = skrinPeta;
    const bl = document.getElementById('lagi');
    if (bl) bl.onclick = () => mainTahap(lagi);
    const ok = await Markah.hantar(t.id, peratus);
    const st = document.getElementById('status');
    if (st) st.textContent = ok ? '✔ Markah telah dihantar kepada guru.' : 'Markah disimpan. Akan dihantar apabila ada internet.';
  }

  seterusnya();
}

Markah.flush();
Murid.semasa() ? skrinPeta() : skrinDaftar();

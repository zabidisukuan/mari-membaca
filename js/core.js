// Teras enjin game v2: Storan, Bunyi, Suara, Murid, Markah, UI Skrin & Mod Guru.

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
    pecah: () => nada([1200, 400], 0.05, 'square'),
  };
})();

// ---------- Suara: fail assets/audio/<id>.wav jika ada, jika tiada guna suara pelayar ms-MY ----------
// Fail dinyahkod sekali ke dalam Web Audio (cache) dan senyap di awal/akhir dilangkau supaya suara keluar serta-merta.
const Suara = (() => {
  let fail = new Set();
  let suaraMs = null;
  let audioSemasa = null;
  let sumberSemasa = null;
  let giliran = 0; // bertambah setiap kali suara dihentikan, supaya callback suara lama diabaikan
  // Naikkan nombor ini setiap kali fail audio diganti, supaya telefon tidak guna salinan lama dari cache
  const VERSI_AUDIO = 10;
  const url = (id) => `assets/audio/${id}.wav?v=${VERSI_AUDIO}`;
  const slug = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);

  const sedia = fetch('assets/audio/index.json').then((r) => (r.ok ? r.json() : [])).then((l) => (fail = new Set(l))).catch(() => {});
  function cariSuara() {
    if (!('speechSynthesis' in window)) return;
    suaraMs = speechSynthesis.getVoices().find((v) => /^ms([-_]|$)/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { cariSuara(); speechSynthesis.onvoiceschanged = cariSuara; }

  const ada = (teks) => fail.has(slug(teks)) || !!suaraMs;

  // Web Audio: pelayar (terutama iPhone) hanya benarkan bunyi selepas sentuhan pertama
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = AC ? new AC() : null;
  if (ctx) {
    const buka = () => { if (ctx.state === 'suspended') ctx.resume(); };
    ['pointerdown', 'touchend', 'keydown'].forEach((e) => document.addEventListener(e, buka, { capture: true, passive: true }));
  }

  // Cache id -> Promise<{ buf, mula, tempoh }>, dihadkan supaya memori telefon tidak penuh
  const cache = new Map();
  const HAD_CACHE = 150;
  function muat(id) {
    if (cache.has(id)) return cache.get(id);
    const p = fetch(url(id))
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((ab) => new Promise((ok, gagal) => ctx.decodeAudioData(ab, ok, gagal)))
      .then((buf) => {
        // Cari permulaan dan akhir suara (abaikan senyap), tinggalkan jidar kecil
        const d = buf.getChannelData(0), ambang = 0.02;
        let i = 0, j = d.length - 1;
        while (i < j && Math.abs(d[i]) < ambang) i++;
        while (j > i && Math.abs(d[j]) < ambang) j--;
        const mula = Math.max(0, i / buf.sampleRate - 0.03);
        const tempoh = Math.min(buf.duration, j / buf.sampleRate + 0.08) - mula;
        return { buf, mula, tempoh };
      });
    p.catch(() => cache.delete(id));
    cache.set(id, p);
    if (cache.size > HAD_CACHE) cache.delete(cache.keys().next().value);
    return p;
  }

  // Muat awal senarai teks (contohnya semua perkataan satu lokasi) semasa murid masih membaca menu
  function pramuat(senarai) {
    if (!ctx) return;
    sedia.then(() => {
      const ids = [...new Set(senarai.map(slug))].filter((id) => fail.has(id) && !cache.has(id));
      let k = 0;
      const seterusnya = () => { if (k < ids.length) muat(ids[k++]).catch(() => {}).finally(seterusnya); };
      for (let n = 0; n < 4; n++) seterusnya(); // 4 muat turun serentak
    });
  }

  function henti() {
    giliran++;
    if (sumberSemasa) {
      try { sumberSemasa.stop(); } catch (e) {}
      sumberSemasa = null;
    }
    if (audioSemasa) {
      audioSemasa.pause();
      audioSemasa.currentTime = 0;
      audioSemasa = null;
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  function mainFail(id, tamat) {
    const a = new Audio(url(id));
    audioSemasa = a;
    a.onended = tamat;
    a.play().catch(tamat);
  }

  // selepas: dipanggil apabila suara tamat (tidak dipanggil jika suara dihentikan oleh suara lain)
  function main(teks, selepas) {
    if (!teks) return;
    henti();
    const g = giliran;
    const tamat = () => { if (selepas && g === giliran) selepas(); };
    const id = slug(teks);
    if (fail.has(id) && ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      muat(id).then(({ buf, mula, tempoh }) => {
        if (g !== giliran) return;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.onended = () => { if (sumberSemasa === src) sumberSemasa = null; tamat(); };
        sumberSemasa = src;
        src.start(0, mula, tempoh);
      }).catch(() => { if (g === giliran) mainFail(id, tamat); });
    } else if (fail.has(id)) {
      mainFail(id, tamat);
    } else if (suaraMs) {
      const u = new SpeechSynthesisUtterance(teks);
      u.voice = suaraMs; u.lang = suaraMs.lang; u.rate = 0.8;
      u.onend = tamat;
      speechSynthesis.speak(u);
    } else {
      tamat();
    }
  }

  function butang(teks) {
    const b = document.createElement('button');
    b.className = 'butang-suara';
    b.innerHTML = '🔊';
    b.setAttribute('aria-label', 'Dengar');
    b.onclick = () => main(teks);
    b.hidden = !ada(teks);
    setTimeout(() => (b.hidden = !ada(teks)), 800);
    return b;
  }

  return { main, henti, pramuat, butang, slug };
})();

// ---------- Murid & kemajuan ----------
const Murid = {
  semasa: () => Simpan.get('mm_murid', null),
  kunci: (m) => [m.kodSekolah, m.nama, m.tahun, m.kelas].map((x) => String(x || '').trim().toLowerCase()).join('|'),
  set(m) {
    Simpan.set('mm_murid', m);
    const senarai = Simpan.get('mm_senarai_murid', []).filter((x) => Murid.kunci(x) !== Murid.kunci(m));
    Simpan.set('mm_senarai_murid', [m, ...senarai].slice(0, 40));
  },
  watak: () => {
    const m = Murid.semasa();
    if (!m) return 'aiman';
    return Simpan.get('mm2_watak_' + Murid.kunci(m), null);
  },
  setWatak(w) {
    const m = Murid.semasa();
    if (m) Simpan.set('mm2_watak_' + Murid.kunci(m), w);
  },
  kemajuan: () => {
    const m = Murid.semasa();
    return m ? Simpan.get('mm_kemajuan_' + Murid.kunci(m), {}) : {};
  },
  simpanKemajuan(id, peratus) {
    const m = Murid.semasa();
    if (!m) return;
    const k = Murid.kemajuan();
    if (!k[id] || peratus > k[id]) k[id] = peratus;
    Simpan.set('mm_kemajuan_' + Murid.kunci(m), k);
  },
  adaBarang(id) {
    const m = Murid.semasa();
    if (!m) return false;
    const kM = Murid.kunci(m);
    const numStr = String(id).replace(/[^0-9]/g, '');
    const num = parseInt(numStr, 10);
    const tId = 'K' + (isNaN(num) ? String(id).toUpperCase().replace(/^K/, '') : num);
    return Simpan.get('mm2_beg_' + kM + '_' + tId, false) || Simpan.get('mm2_game_star_' + kM + '_' + tId, 0) >= 1;
  },
  beriBarang(id) {
    const m = Murid.semasa();
    if (!m) return;
    const kM = Murid.kunci(m);
    const numStr = String(id).replace(/[^0-9]/g, '');
    const num = parseInt(numStr, 10);
    const tId = 'K' + (isNaN(num) ? String(id).toUpperCase().replace(/^K/, '') : num);
    Simpan.set('mm2_beg_' + kM + '_' + tId, true);
  },
};

// ---------- Pensel: dikumpul di Latihan, digunakan untuk pecah belon dalam game ----------
const Pensel = {
  kunci(id) {
    const m = Murid.semasa();
    return 'mm2_pensel_' + (m ? Murid.kunci(m) : 'tetamu') + '_' + id;
  },
  baki: (id) => Simpan.get(Pensel.kunci(id), 0),
  tambah(id, n) { Simpan.set(Pensel.kunci(id), Pensel.baki(id) + n); },
  // Tolak satu pensel; pulangkan baki selepas digunakan
  guna(id) {
    const b = Math.max(0, Pensel.baki(id) - 1);
    Simpan.set(Pensel.kunci(id), b);
    return b;
  },
};
const PENSEL_BETUL = 3;

const bintang = (p) => (p >= 90 ? 3 : p >= 70 ? 2 : p >= 50 ? 1 : 0);
const LULUS = 50;

// ---------- Hantar markah (dengan baris gilir luar talian) ----------
const Markah = {
  hantar(konstruk, peratus) {
    const m = Murid.semasa();
    if (!m) return Promise.resolve(false);
    const q = Simpan.get('mm_giliran', []);
    q.push({ kodSekolah: m.kodSekolah, namaSekolah: m.namaSekolah, nama: m.nama, tahun: m.tahun, kelas: m.kelas, konstruk, peratus });
    Simpan.set('mm_giliran', q);
    return Markah.flush();
  },
  async flush() {
    if (typeof CONFIG === 'undefined' || !CONFIG.URL_MARKAH) return false;
    let q = Simpan.get('mm_giliran', []);
    while (q.length) {
      try {
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
  Suara.henti();
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

// Laluan aset v2: semua PNG lutsinar kecuali latar peta (JPG)
function laluanV2(id) {
  return `assets/v2/${id}.${id === 'peta_pulau' ? 'jpg' : 'png'}`;
}

// Pembantu imej Aset v2 dengan sandaran onerror
function imgV2(id, fallbackEmoji = '✨', cls = '', alt = '') {
  const safeAlt = esc(alt);
  const safeCls = esc(cls);
  return `<img src="${laluanV2(id)}" alt="${safeAlt}" class="${safeCls}" onerror="this.onerror=null;const s=document.createElement('span');s.className='img-fallback ${safeCls}';s.innerHTML='${fallbackEmoji}';this.replaceWith(s);">`;
}

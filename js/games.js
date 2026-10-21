// Bina soalan bagi setiap tahap dan papar setiap jenis soalan.
// Setiap soalan: { type, ... }. render(soalan, el, selesai) memanggil selesai(betulKaliPertama).

const U = {
  shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  pick(a, n) { return U.shuffle(a).slice(0, n); },
  kata: (w) => w.replace(/-/g, ''),
  suku: (w) => w.split('-'),
  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  },
};

// ---------- Pembina soalan ----------

const HURUF_SERUPA = ['bdpq', 'mnwu', 'iljt', 'aoec', 'hnr', 'ftk', 'gqy', 'kxz', 'svz', 'vwy'];

function soalanHuruf(target, semua) {
  const serupa = HURUF_SERUPA.filter((g) => g.includes(target)).join('').split('').filter((h) => h !== target);
  const lain = U.shuffle([...new Set(serupa)]).concat(U.shuffle(semua.filter((h) => h !== target)));
  const opsyen = [target, ...[...new Set(lain)].slice(0, 3)];
  return { type: 'huruf', target, opsyen: U.shuffle(opsyen), suara: target };
}

function soalanBina(g, kolam, ikutHuruf) {
  const parts = ikutHuruf ? U.kata(g.w).split('') : U.suku(g.w);
  const pengacau = U.shuffle([...new Set(kolam)].filter((p) => !parts.includes(p))).slice(0, 2);
  return {
    type: 'bina', img: g.img || U.kata(g.w), e: g.e, parts,
    jubin: U.shuffle(parts.concat(pengacau)), ikutHuruf, suara: U.kata(g.w),
  };
}

function soalanCantum(parts, senarai) {
  const jawapan = parts.join('');
  const calon = [parts.slice().reverse().join('')]
    .concat(U.shuffle(senarai.map(U.kata).filter((w) => w.length === jawapan.length)))
    .concat(U.shuffle(senarai.map(U.kata)));
  const opsyen = [jawapan, ...[...new Set(calon)].filter((w) => w !== jawapan).slice(0, 2)];
  return { type: 'cantum', parts, jawapan, opsyen: U.shuffle(opsyen), suara: jawapan };
}

function soalanPilih(g, calonKata) {
  const jawapan = U.kata(g.w);
  const lain = [...new Set(calonKata.map(U.kata))].filter((w) => w !== jawapan);
  // Utamakan pengacau yang bermula dengan huruf sama atau sama panjang supaya murid perlu membaca
  const dekat = U.shuffle(lain.filter((w) => w[0] === jawapan[0] || w.length === jawapan.length));
  const pengacau = [...new Set(dekat.concat(U.shuffle(lain)))].slice(0, 2);
  return { type: 'pilih', img: g.img || jawapan, e: g.e, jawapan, opsyen: U.shuffle([jawapan, ...pengacau]), suara: jawapan };
}

function soalanIsi(perkataan, mula, panjang, opsyen, g) {
  return {
    type: 'isi', img: g && (g.img || U.kata(g.w)), e: g && g.e,
    sebelum: perkataan.slice(0, mula), selepas: perkataan.slice(mula + panjang),
    jawapan: opsyen[0], opsyen: U.shuffle(opsyen), suara: perkataan,
  };
}

// K6: kosongkan suku kata yang mengandungi "ng"
function soalanNg(g) {
  const parts = U.suku(g.w);
  const i = parts.findIndex((p) => p.includes('ng'));
  const s = parts[i];
  const mula = parts.slice(0, i).join('').length;
  return soalanIsi(U.kata(g.w), mula, s.length, [s, s.replace('ng', 'n'), s.replace('ng', 'm')], g.e ? g : null);
}

// K7: kosongkan diftong
function soalanDiftong(g) {
  const w = U.kata(g.w);
  const m = /ai|au|oi/.exec(w);
  return soalanIsi(w, m.index, 2, [m[0], ...['ai', 'au', 'oi'].filter((d) => d !== m[0])], g.e ? g : null);
}

// K9: kosongkan digraf / konsonan bergabung
function soalanDigraf(item) {
  return soalanIsi(item.w, item.w.indexOf(item.blank), item.blank.length, item.opsyen, item.e ? item : null);
}

function soalanImbuhan([dasar, imb, jawapan]) {
  const naif = imb.endsWith('-') ? imb.slice(0, -1) + dasar : dasar + imb.slice(1);
  const calon = [naif, 'me' + dasar, 'ber' + dasar, 'ter' + dasar, dasar + 'an', dasar + 'kan', dasar + 'i']
    .filter((w, i, a) => w !== jawapan && a.indexOf(w) === i);
  // Sentiasa sertakan bentuk naif yang salah (cth. mebaca) jika berbeza daripada jawapan
  const pengacau = (naif !== jawapan ? [naif] : []).concat(U.shuffle(calon.filter((w) => w !== naif))).slice(0, 2);
  return { type: 'imbuhan', dasar, imb, jawapan, opsyen: U.shuffle([jawapan, ...pengacau]), suara: jawapan };
}

function soalanSusun(a) {
  const kata = a.s.split(' ');
  return { type: 'susun', img: a.img, e: a.e, parts: kata, jubin: U.shuffle(kata), suara: a.s };
}

function soalanFaham(p, s) {
  return {
    type: 'faham', img: p.img, e: p.e, teks: p.teks, q: s.q,
    jawapan: s.opsyen[0], opsyen: U.shuffle(s.opsyen), suara: s.opsyen[0],
  };
}

function binaSoalan(t) {
  const senarai = t.senarai && typeof t.senarai === 'string' ? t.senarai.split(' ') : [];
  const gambar = U.shuffle(t.gambar || []);
  const sukuKolam = senarai.concat((t.gambar || []).map((g) => g.w)).flatMap(U.suku);
  const binaGambar = (n) => gambar.slice(0, n).map((g) => soalanBina(g, sukuKolam));
  const cantumSenarai = (n) => U.pick(senarai, n).map((w) => soalanCantum(U.suku(w), senarai));

  switch (t.id) {
    case 'K1':
      return U.pick(t.huruf, 8).map((h) => soalanHuruf(h, t.huruf));
    case 'K2': case 'K3': case 'K5':
      return U.shuffle(binaGambar(5).concat(cantumSenarai(3)));
    case 'K4': {
      const huruf = 'abcdefghijklmnoprstu'.split('');
      return U.shuffle(gambar.slice(0, 5).map((g) => soalanPilih(g, senarai))
        .concat(gambar.slice(5, 8).map((g) => soalanBina(g, huruf, true))));
    }
    case 'K6':
      return U.shuffle(binaGambar(4).concat(U.pick(senarai, 4).map((w) => soalanNg({ w }))));
    case 'K7':
      return U.shuffle(gambar.slice(0, 4).map(soalanDiftong).concat(U.pick(senarai, 4).map((w) => soalanDiftong({ w }))));
    case 'K8': {
      const cantum = U.pick(t.cantum.split(' '), 4).map((c) => soalanCantum(c.split('+'), senarai));
      return U.shuffle(cantum.concat(binaGambar(4)));
    }
    case 'K9':
      return U.shuffle(U.pick(t.isi, 5).concat(U.pick(t.senarai, 3)).map(soalanDigraf));
    case 'K10': {
      const pilih = gambar.slice(0, 3).map((g) => soalanPilih(g, t.gambar.map((x) => x.w)));
      return U.shuffle(pilih.concat(U.pick(t.imbuhan, 5).map(soalanImbuhan)));
    }
    case 'K11':
      return U.pick(t.ayat, 5).map(soalanSusun);
    case 'K12':
      return U.pick(t.petikan, 2).flatMap((p) => p.soalan.map((s) => soalanFaham(p, s)));
  }
  return [];
}

// ---------- Paparan ----------

function gambarEl(img, e) {
  const box = U.el('div', 'gambar');
  const fallback = () => { box.innerHTML = `<span class="emoji">${e || '❓'}</span>`; };
  if (!img) { fallback(); return box; }
  const im = new Image();
  im.alt = '';
  im.onerror = fallback;
  im.src = `assets/img/${img}.jpg`;
  box.appendChild(im);
  return box;
}

function arahanEl(teks) { return U.el('p', 'arahan', teks); }

// Butang pilihan jawapan; salah → goyang & dimatikan, betul → selesai
function pilihanEl(opsyen, jawapan, selesai, kelasTambahan) {
  const wrap = U.el('div', 'pilihan ' + (kelasTambahan || ''));
  let salah = false;
  for (const o of opsyen) {
    const b = U.el('button', 'pil', o);
    b.onclick = () => {
      if (o === jawapan) {
        b.classList.add('betul');
        wrap.querySelectorAll('button').forEach((x) => (x.disabled = true));
        selesai(!salah);
      } else {
        salah = true;
        b.classList.add('salah');
        b.disabled = true;
        Bunyi.salah();
      }
    };
    wrap.appendChild(b);
  }
  return wrap;
}

// Ketik jubin untuk isi slot mengikut urutan; ketik slot untuk buang semula
function binaEl(q, selesai) {
  const wrap = U.el('div', 'bina' + (q.type === 'susun' ? ' susun' : ''));
  const slotRow = U.el('div', 'slot-baris');
  const jubinRow = U.el('div', 'jubin-baris');
  const isi = [];
  let salah = false;
  const slots = q.parts.map(() => {
    const s = U.el('button', 'slot');
    s.onclick = () => {
      const i = slots.indexOf(s);
      if (i >= isi.length) return;
      // Pulangkan jubin dari slot ini dan semua slot selepasnya
      isi.splice(i).forEach((j) => { j.jubin.disabled = false; });
      lukis();
    };
    slotRow.appendChild(s);
    return s;
  });
  const lukis = () => slots.forEach((s, i) => {
    s.textContent = isi[i] ? isi[i].teks : '';
    s.classList.toggle('penuh', !!isi[i]);
  });
  q.jubin.forEach((teks) => {
    const j = U.el('button', 'jubin', teks);
    j.onclick = () => {
      if (isi.length >= slots.length) return;
      isi.push({ teks, jubin: j });
      j.disabled = true;
      lukis();
      if (isi.length === slots.length) semak();
    };
    jubinRow.appendChild(j);
  });
  function semak() {
    if (isi.every((x, i) => x.teks === q.parts[i])) {
      slotRow.classList.add('betul');
      jubinRow.querySelectorAll('button').forEach((x) => (x.disabled = true));
      slots.forEach((s) => (s.disabled = true));
      selesai(!salah);
    } else {
      salah = true;
      Bunyi.salah();
      slotRow.classList.add('goyang');
      setTimeout(() => {
        slotRow.classList.remove('goyang');
        isi.splice(0).forEach((x) => { x.jubin.disabled = false; });
        lukis();
      }, 600);
    }
  }
  wrap.append(slotRow, jubinRow);
  return wrap;
}

function render(q, el, selesai) {
  el.innerHTML = '';
  const kad = U.el('div', 'kad-soalan');
  switch (q.type) {
    case 'huruf': {
      kad.append(arahanEl('Cari huruf ini:'));
      const sasaran = U.el('div', 'huruf-besar', q.target);
      kad.append(sasaran, Suara.butang(q.target), pilihanEl(q.opsyen, q.target, selesai, 'belon'));
      break;
    }
    case 'bina':
      kad.append(arahanEl(q.ikutHuruf ? 'Susun huruf mengikut gambar:' : 'Cantumkan suku kata mengikut gambar:'),
        gambarEl(q.img, q.e), binaEl(q, selesai));
      break;
    case 'cantum':
      kad.append(arahanEl('Cantumkan suku kata. Pilih perkataan yang betul:'),
        U.el('div', 'persamaan', q.parts.map((p) => `<span>${p}</span>`).join('<b>+</b>') + '<b>=</b><span class="tanya">?</span>'),
        pilihanEl(q.opsyen, q.jawapan, selesai));
      break;
    case 'pilih':
      kad.append(arahanEl('Pilih perkataan yang sesuai dengan gambar:'), gambarEl(q.img, q.e), pilihanEl(q.opsyen, q.jawapan, selesai));
      break;
    case 'isi': {
      kad.append(arahanEl('Lengkapkan perkataan:'));
      if (q.img) kad.append(gambarEl(q.img, q.e));
      const perkataan = U.el('div', 'perkataan-isi', `${q.sebelum}<span class="kosong">?</span>${q.selepas}`);
      kad.append(perkataan, pilihanEl(q.opsyen, q.jawapan, (ok) => {
        perkataan.innerHTML = `${q.sebelum}<span class="kosong diisi">${q.jawapan}</span>${q.selepas}`;
        selesai(ok);
      }));
      break;
    }
    case 'imbuhan':
      kad.append(arahanEl('Tambah imbuhan. Pilih perkataan yang betul:'),
        U.el('div', 'persamaan', `<span>${q.dasar}</span><b>+</b><span class="imb">${q.imb}</span><b>=</b><span class="tanya">?</span>`),
        pilihanEl(q.opsyen, q.jawapan, selesai));
      break;
    case 'susun':
      kad.append(arahanEl('Susun perkataan menjadi ayat yang betul:'), gambarEl(q.img, q.e), binaEl(q, selesai));
      break;
    case 'faham': {
      const petikan = U.el('div', 'petikan');
      petikan.append(gambarEl(q.img, q.e), U.el('div', 'teks-petikan', q.teks.map((l) => `<p>${l}</p>`).join('')));
      kad.append(petikan, U.el('p', 'soalan-faham', q.q), pilihanEl(q.opsyen, q.jawapan, selesai, 'panjang'));
      break;
    }
  }
  el.appendChild(kad);
}

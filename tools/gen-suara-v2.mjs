// Jana suara maskot v2 (sapaan lokasi, arahan game, ayat tutorial) dengan Gemini TTS.
// Guna: $env:GEMINI_API_KEY="..."; node tools/gen-suara-v2.mjs [--sampel] [--senarai]
// Teks dikumpul terus daripada js/peta.js, js/game/*.js dan js/tutorial.js supaya sentiasa sepadan dengan kod.
// Output: assets/audio/<slug>.wav dan kemas kini assets/audio/index.json.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const OUT = path.join(root, 'assets', 'audio');
const KEY = process.env.GEMINI_API_KEY;
// Model 2.5 mengikut arahan loghat (model 3.8 membaca arahan dengan kuat); Flash Kore dipilih guru selepas banding sampel
const MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
const ARAHAN = 'Read the following in Malaysian Malay with a Malaysian accent and intonation (NOT Indonesian), like a warm Malaysian kindergarten teacher: ';
const VOICE = process.env.GEMINI_VOICE || 'Kore';

// Mesti sama dengan Suara.slug dalam js/core.js
const slug = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);

// Huruf tunggal, singkatan (KVK) dan simbol (+, =, bu-ku) dibaca model dengan sebutan Indonesia atau janggal.
// Untuk ayat ini, teks yang dihantar ke TTS dieja ikut sebutan Malaysia; nama fail tetap ikut teks asal (yang dipaparkan).
const SEBUTAN = {
  'Huruf vokal ada 5: a, e, i, o, u. Mari sebut huruf vokal bersama-sama!': 'Huruf vokal ada lima: ei, i, ai, o, yu. Mari sebut huruf vokal bersama-sama!',
  'Huruf-huruf lain dipanggil huruf konsonan. Contohnya b, c, d, f, g.': 'Huruf-huruf lain dipanggil huruf konsonan. Contohnya bi, si, di, ef, ji.',
  'Awas! Jangan keliru dengan huruf yang bentuknya hampir sama seperti b, d, p, dan q.': 'Awas! Jangan keliru dengan huruf yang bentuknya hampir sama seperti bi, di, pi, dan kiu.',
  'Huruf konsonan dan vokal bercantum menjadi suku kata. Contohnya, b + a = ba.': 'Huruf konsonan dan vokal bercantum menjadi suku kata. Contohnya, bi, ei, ba.',
  'Mari cuba cantumkan huruf lain! k + u = ku.': 'Mari cuba cantumkan huruf lain! Kei, yu, ku.',
  'Dua suku kata bercantum: di + a = dia.': 'Dua suku kata bercantum: di, a, dia.',
  'Dua suku kata bercantum menjadi satu perkataan: bu + ku = buku.': 'Dua suku kata bercantum menjadi satu perkataan: bu, ku, buku.',
  'Mari sebut dan baca perkataan bu-ku!': 'Mari sebut dan baca perkataan bu, ku!',
  'Satu lagi contoh perkataan dua suku kata: ka-ki.': 'Satu lagi contoh perkataan dua suku kata: ka, ki.',
  'Perkataan ini terbina daripada tiga suku kata: ke + la + pa = kelapa.': 'Perkataan ini terbina daripada tiga suku kata: ke, la, pa, kelapa.',
  'Mari sebut dan baca perkataan ke-la-pa!': 'Mari sebut dan baca perkataan ke, la, pa!',
  'Lihat contoh perkataan tiga suku kata ini pula: to-ma-to.': 'Lihat contoh perkataan tiga suku kata ini pula: to, ma, to.',
  'Suku kata KVK (Konsonan-Vokal-Konsonan) mempunyai tiga huruf dan dibaca satu bunyi.': 'Suku kata kei vi kei, iaitu konsonan, vokal, konsonan, mempunyai tiga huruf dan dibaca satu bunyi.',
  'Contoh lain perkataan KVK: jam.': 'Contoh lain perkataan kei vi kei: jam.',
  'Mari sebut dan baca perkataan ja-rum!': 'Mari sebut dan baca perkataan ja, rum!',
  'Mari cuba baca perkataan bis-kut!': 'Mari cuba baca perkataan bis, kut!',
  'Huruf "n" dan "g" apabila bersama-sama menghasilkan satu bunyi "ng".': 'Huruf en dan ji apabila bersama-sama menghasilkan satu bunyi ng.',
  'Lihat bunyi "ng" di hujung perkataan u-dang.': 'Lihat bunyi ng di hujung perkataan u, dang.',
  'Mari sebut perkataan ja-gung bersama Sang Kancil!': 'Mari sebut perkataan ja, gung bersama Sang Kancil!',
  'Diftong ialah dua huruf vokal yang dibaca sebagai satu geluncuran bunyi. Contohnya "ai" dalam mi-sai.': 'Diftong ialah dua huruf vokal yang dibaca sebagai satu geluncuran bunyi. Contohnya ai dalam mi, sai.',
  'Diftong "au" seperti dalam perkataan pi-sau.': 'Diftong au seperti dalam perkataan pi, sau.',
  'Diftong "oi" seperti dalam perkataan ko-boi.': 'Diftong oi seperti dalam perkataan ko, boi.',
  'Mari sebut dan baca perkataan bu-a-ya!': 'Mari sebut dan baca perkataan bu, a, ya!',
  'Kata dasar boleh ditambah imbuhan di hadapan, seperti baca + me- = membaca.': 'Kata dasar boleh ditambah imbuhan di hadapan, seperti baca, tambah me, menjadi membaca.',
  'Mari cuba imbuhan ber- dengan kata dasar main: main + ber- = bermain.': 'Mari cuba imbuhan ber dengan kata dasar main: main, tambah ber, menjadi bermain.',
  'Imbuhan -an juga boleh ditambah di belakang kata dasar: masak + -an = masakan.': 'Imbuhan an juga boleh ditambah di belakang kata dasar: masak, tambah an, menjadi masakan.',
};

function kumpulTeks() {
  const t = new Set();
  const baca = (f) => fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of baca('js/peta.js').matchAll(/sapaan:\s*'([^']+)'/g)) t.add(m[1]);
  for (const f of fs.readdirSync(path.join(root, 'js', 'game'))) {
    for (const m of baca(`js/game/${f}`).matchAll(/arahan:\s*'([^']+)'/g)) t.add(m[1]);
  }
  t.add('Mari bermain!');
  // TUTORIAL ialah data biasa di peringkat atas tutorial.js; jalankan dalam vm dengan stub minimum
  const ctx = { U: { kata: (w) => String(w).replace(/-/g, '') }, DATA: { tahap: [] }, console, document: {}, window: {} };
  vm.createContext(ctx);
  vm.runInContext(baca('js/tutorial.js') + ';this.__T = TUTORIAL;', ctx);
  for (const v of Object.values(ctx.__T)) v.langkah.forEach((l) => t.add(l.teks));
  return [...t];
}

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

async function jana(teks) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: ARAHAN + teks }] }],
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { languageCode: 'ms-MY', voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
    }),
  });
  if (!res.ok) throw Object.assign(new Error(`${res.status} ${(await res.text()).slice(0, 600)}`), { status: res.status });
  const j = await res.json();
  const b64 = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!b64) throw new Error('Tiada audio (' + (j.candidates?.[0]?.finishReason || '?') + ')');
  return wav(Buffer.from(b64, 'base64'));
}

const semua = kumpulTeks();
if (process.argv.includes('--senarai')) { semua.forEach((t) => console.log(t)); process.exit(0); }
if (!KEY) { console.error('Sila tetapkan GEMINI_API_KEY.'); process.exit(1); }
// --sebutan: jana semula hanya ayat dalam SEBUTAN; --semua: jana semula semua ayat (fail lama ditimpa)
const semula = process.argv.includes('--sebutan') || process.argv.includes('--semua') || process.argv.includes('--ayat');
// --ayat <fail.txt>: jana semula hanya ayat yang disenaraikan (satu ayat sebaris, teks asal seperti dipaparkan)
const iAyat = process.argv.indexOf('--ayat');
const pilihan = iAyat > 0 ? new Set(fs.readFileSync(process.argv[iAyat + 1], 'utf8').split(/\r?\n/).map((x) => x.trim()).filter(Boolean)) : null;
const senarai = pilihan ? semua.filter((t) => pilihan.has(t)) : process.argv.includes('--sebutan') ? semua.filter((t) => SEBUTAN[t]) : process.argv.includes('--sampel') ? semua.slice(0, 3) : semua;
// --sejak <masa ISO>: sambung kerja yang terhenti (cth. had kuota harian); langkau fail yang sudah dijana selepas masa itu
const iSejak = process.argv.indexOf('--sejak');
const sejak = iSejak > 0 ? new Date(process.argv[iSejak + 1]).getTime() : 0;
const todo = (semula ? senarai : senarai.filter((t) => !fs.existsSync(path.join(OUT, slug(t) + '.wav'))))
  .filter((t) => !sejak || !fs.existsSync(path.join(OUT, slug(t) + '.wav')) || fs.statSync(path.join(OUT, slug(t) + '.wav')).mtimeMs < sejak);
console.log(`${todo.length} daripada ${semua.length} ayat perlu dijana (model ${MODEL})`);

let gagal = 0;
for (const t of todo) {
  let ok = false;
  for (let c = 1; c <= 4 && !ok; c++) {
    try {
      const audio = await jana(SEBUTAN[t] || t);
      // ~13 aksara sesaat; jauh lebih panjang bermakna arahan turut dibaca, jadi cuba lagi
      const saat = (audio.length - 44) / 48000, had = (SEBUTAN[t] || t).length / 13 * 1.8 + 2;
      if (saat > had) throw new Error(`terlalu panjang (${saat.toFixed(1)}s > ${had.toFixed(1)}s)`);
      fs.writeFileSync(path.join(OUT, slug(t) + '.wav'), audio);
      console.log('✔', t);
      ok = true;
    } catch (e) {
      if (e.status === 429 && /per_day/.test(e.message)) { console.log('Kuota harian habis. Sambung kemudian dengan --sejak.'); process.exit(2); }
      if (e.status === 429 && c === 4) break;
      await new Promise((r) => setTimeout(r, e.status === 429 ? 30000 : 3000));
      if (c === 4) console.log('✘', t, e.message);
    }
  }
  if (!ok) gagal++;
  await new Promise((r) => setTimeout(r, 6500));
}
const ada = fs.readdirSync(OUT).filter((f) => f.endsWith('.wav')).map((f) => f.slice(0, -4));
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(ada));
console.log(`Selesai. ${ada.length} fail dalam index.json, ${gagal} gagal.`);

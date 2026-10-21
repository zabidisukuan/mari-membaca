// Jana fail suara sebutan menggunakan Gemini TTS.
// Guna:  $env:GEMINI_API_KEY="..."; node tools/gen-audio.mjs [--sampel]
//   --sampel : jana 3 contoh sahaja untuk didengar dahulu.
// Output: assets/audio/<slug>.wav + assets/audio/index.json (senarai fail yang wujud, dibaca oleh game).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const DATA = require(path.join(root, 'js', 'data.js'));
const OUT = path.join(root, 'assets', 'audio');
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
const VOICE = process.env.GEMINI_VOICE || 'Kore';

// Mesti sama dengan Suara.slug dalam js/engine.js
const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);
const kata = (w) => w.replace(/-/g, '');

function semuaTeks() {
  const t = new Set();
  for (const k of DATA.tahap) {
    (k.huruf || []).forEach((h) => t.add(h));
    (k.gambar || []).forEach((g) => t.add(kata(g.w)));
    if (typeof k.senarai === 'string') k.senarai.split(' ').forEach((w) => t.add(kata(w)));
    else (k.senarai || []).forEach((g) => t.add(g.w));
    (k.isi || []).forEach((g) => t.add(g.w));
    (k.cantum || '').split(' ').filter(Boolean).forEach((c) => t.add(c.replace('+', '')));
    (k.imbuhan || []).forEach((i) => t.add(i[2]));
    (k.ayat || []).forEach((a) => t.add(a.s));
    (k.petikan || []).forEach((p) => p.soalan.forEach((s) => t.add(s.opsyen[0])));
  }
  return [...t];
}

// Nama huruf mengikut sebutan Bahasa Melayu; huruf tunggal sahaja mengelirukan model TTS
const NAMA_HURUF = {
  a: 'a', b: 'bi', c: 'si', d: 'di', e: 'i', f: 'ef', g: 'ji', h: 'eic', i: 'ai', j: 'je', k: 'ke', l: 'el', m: 'em',
  n: 'en', o: 'o', p: 'pi', q: 'kiu', r: 'ar', s: 'es', t: 'ti', u: 'yu', v: 'vi', w: 'dabliu', x: 'eks', y: 'wai', z: 'zed',
};

const sebutan = (teks) => (teks.length === 1 ? NAMA_HURUF[teks] || teks : teks);

function arahan(teks) {
  return `Say slowly and clearly in Malaysian Malay, like a kind teacher to a young child: ${sebutan(teks)}`;
}

// Satu permintaan untuk banyak perkataan; jeda panjang antara perkataan supaya boleh dipotong ikut senyap
function arahanKumpulan(senarai) {
  return 'Read this list of Malaysian Malay words slowly and clearly, like a kind teacher to a young child. ' +
    'Say each word exactly once, and pause for about one full second after every word: ' +
    senarai.map((t) => sebutan(t) + '.').join(' ');
}

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// Pulangkan PCM 16-bit mono 24kHz
async function jana(prompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`${res.status} ${body.slice(0, 200)}`);
    err.status = res.status;
    const m = /"retryDelay":\s*"(\d+)s"/.exec(body);
    err.tunggu = m ? Number(m[1]) * 1000 : 0;
    throw err;
  }
  const j = await res.json();
  const b64 = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!b64) throw new Error('Tiada audio dalam respons');
  return Buffer.from(b64, 'base64');
}

// Potong PCM kepada segmen bunyi yang dipisahkan oleh senyap >= minSenyap ms
function potongIkutSenyap(pcm, minSenyap = 380) {
  const RATE = 24000, WIN = 480; // tetingkap 20ms
  const n = Math.floor(pcm.length / 2 / WIN);
  const rms = [];
  let puncak = 0;
  for (let w = 0; w < n; w++) {
    let s = 0;
    for (let i = 0; i < WIN; i++) { const v = pcm.readInt16LE((w * WIN + i) * 2); s += v * v; }
    rms.push(Math.sqrt(s / WIN));
    puncak = Math.max(puncak, rms[w]);
  }
  const ambang = puncak * 0.04;
  const minWin = Math.ceil(minSenyap / 20);
  const segmen = [];
  let mula = -1, senyap = 0;
  for (let w = 0; w < n; w++) {
    if (rms[w] > ambang) {
      if (mula < 0) mula = w;
      senyap = 0;
    } else if (mula >= 0 && ++senyap >= minWin) {
      segmen.push([mula, w - senyap + 1]);
      mula = -1; senyap = 0;
    }
  }
  if (mula >= 0) segmen.push([mula, n]);
  // Buang bunyi pendek (<120ms) seperti nafas atau klik
  const PAD = 4; // 80ms ruang sebelum/selepas
  return segmen.filter(([a, b]) => b - a >= 6).map(([a, b]) => {
    const s = Math.max(0, a - PAD) * WIN * 2, e = Math.min(n, b + PAD) * WIN * 2;
    return pcm.subarray(s, e);
  });
}

if (!KEY) {
  console.error('Sila tetapkan GEMINI_API_KEY (dapatkan di https://aistudio.google.com/apikey).');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
const sampel = process.argv.includes('--sampel');
const senarai = sampel ? ['buku', 'khianat', 'Ini bas bapa Abu.'] : semuaTeks();
const todo = senarai.filter((t) => !fs.existsSync(path.join(OUT, slug(t) + '.wav')));
console.log(`${todo.length} fail suara perlu dijana (model ${MODEL})`);

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
const JARAK = Number(process.env.GEMINI_JARAK_MS || 6500); // ~9 permintaan seminit, bawah had kadar
const SAIZ = Number(process.env.GEMINI_KUMPULAN || 15);

// Perkataan tunggal dikumpul; ayat/frasa dijana satu demi satu
const tunggal = todo.filter((t) => !t.includes(' '));
const kerja = [];
for (let i = 0; i < tunggal.length; i += SAIZ) kerja.push(tunggal.slice(i, i + SAIZ));
todo.filter((t) => t.includes(' ')).forEach((t) => kerja.push([t]));

let gagal = 0, berhenti = false;
async function cuba(fn, label) {
  for (let n = 1; n <= 4; n++) {
    const mula = Date.now();
    try {
      const hasil = await fn();
      await tidur(Math.max(0, JARAK - (Date.now() - mula)));
      return hasil;
    } catch (e) {
      if (e.status === 429 && e.tunggu > 10 * 60 * 1000) {
        console.log('Kuota harian habis; berhenti. Jalankan semula kemudian.');
        berhenti = true;
        return null;
      }
      if (n === 4) { console.log('✘', label, e.message); return null; }
      await tidur(e.status === 429 ? Math.max(e.tunggu, 20000) : 3000);
    }
  }
}

for (const k of kerja) {
  if (berhenti) break;
  if (k.length === 1) {
    const pcm = await cuba(() => jana(arahan(k[0])), k[0]);
    if (pcm) { fs.writeFileSync(path.join(OUT, slug(k[0]) + '.wav'), wav(pcm)); console.log('✔', k[0]); } else gagal++;
    continue;
  }
  // Kumpulan: terima hanya jika bilangan segmen tepat sama dengan bilangan perkataan
  const seg = await cuba(async () => {
    const s = potongIkutSenyap(await jana(arahanKumpulan(k)));
    if (s.length !== k.length) throw new Error(`segmen ${s.length} ≠ ${k.length}`);
    return s;
  }, k.join(','));
  if (seg) {
    k.forEach((t, i) => fs.writeFileSync(path.join(OUT, slug(t) + '.wav'), wav(seg[i])));
    console.log('✔', k.join(' '));
  } else {
    gagal += k.length;
  }
}
const ada = fs.readdirSync(OUT).filter((f) => f.endsWith('.wav')).map((f) => f.slice(0, -4));
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(ada));
console.log(`Selesai. ${ada.length} fail dalam index.json, ${gagal} gagal.`);
if (berhenti) process.exitCode = 2;

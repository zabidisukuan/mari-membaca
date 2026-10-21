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

function arahan(teks) {
  if (teks.length === 1) return `Sebut nama huruf Rumi ini dalam Bahasa Melayu Malaysia, sekali sahaja, dengan jelas: ${teks}`;
  return `Baca dengan jelas dan perlahan dalam Bahasa Melayu Malaysia (bukan Indonesia), seperti guru kepada murid Tahun 1: ${teks}`;
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
      contents: [{ parts: [{ text: arahan(teks) }] }],
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const b64 = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!b64) throw new Error('Tiada audio dalam respons');
  return wav(Buffer.from(b64, 'base64'));
}

if (!KEY) {
  console.error('Sila tetapkan GEMINI_API_KEY (dapatkan di https://aistudio.google.com/apikey).');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });
const sampel = process.argv.includes('--sampel');
const senarai = sampel ? ['buku', 'khianat', 'Ini bas bapa Abu.'] : semuaTeks();
const todo = senarai.filter((t) => !fs.existsSync(path.join(OUT, slug(t) + '.wav')));
console.log(`${todo.length} fail suara perlu dijana`);

let gagal = 0;
for (const t of todo) {
  for (let cuba = 1; cuba <= 4; cuba++) {
    try {
      fs.writeFileSync(path.join(OUT, slug(t) + '.wav'), await jana(t));
      console.log('✔', t);
      break;
    } catch (e) {
      // Had kadar: tunggu dan cuba semula
      const tunggu = /429/.test(e.message) ? 30000 * cuba : 2000;
      if (cuba === 4) { console.log('✘', t, e.message); gagal++; } else await new Promise((r) => setTimeout(r, tunggu));
    }
  }
}
const ada = fs.readdirSync(OUT).filter((f) => f.endsWith('.wav')).map((f) => f.slice(0, -4));
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(ada));
console.log(`Selesai. ${ada.length} fail dalam index.json, ${gagal} gagal.`);

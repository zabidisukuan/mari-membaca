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
const MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts';
const VOICE = process.env.GEMINI_VOICE || 'Kore';

// Mesti sama dengan Suara.slug dalam js/core.js
const slug = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);

// Huruf tunggal dibaca model dengan sebutan Indonesia (be, de, pe, ki). Untuk ayat ini, teks yang dihantar ke TTS
// dieja ikut sebutan Malaysia; nama fail tetap ikut teks asal (yang dipaparkan).
const SEBUTAN = {
  'Huruf vokal ada 5: a, e, i, o, u. Mari sebut bunyi huruf vokal bersama-sama!': 'Huruf vokal ada lima: a, i, ai, o, yu. Mari sebut bunyi huruf vokal bersama-sama!',
  'Huruf-huruf lain dipanggil huruf konsonan. Contohnya b, c, d, f, g.': 'Huruf-huruf lain dipanggil huruf konsonan. Contohnya bi, si, di, ef, ji.',
  'Awas! Jangan keliru dengan huruf yang bentuknya hampir sama seperti b, d, p, dan q.': 'Awas! Jangan keliru dengan huruf yang bentuknya hampir sama seperti bi, di, pi, dan kiu.',
  'Huruf konsonan dan vokal bercantum menjadi suku kata. Contohnya, b + a = ba.': 'Huruf konsonan dan vokal bercantum menjadi suku kata. Contohnya, bi, a, ba.',
  'Mari cuba cantumkan huruf lain! k + u = ku.': 'Mari cuba cantumkan huruf lain! Ke, yu, ku.',
  'Dua suku kata bercantum: di + a = dia.': 'Dua suku kata bercantum: di, a, dia.',
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
  // Teks biasa tanpa arahan: model 3.8 menyebut BM dengan tepat dan tidak membaca arahan
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: teks }] }],
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { languageCode: 'ms-MY', voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
    }),
  });
  if (!res.ok) throw Object.assign(new Error(`${res.status} ${(await res.text()).slice(0, 200)}`), { status: res.status });
  const j = await res.json();
  const b64 = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!b64) throw new Error('Tiada audio (' + (j.candidates?.[0]?.finishReason || '?') + ')');
  return wav(Buffer.from(b64, 'base64'));
}

const semua = kumpulTeks();
if (process.argv.includes('--senarai')) { semua.forEach((t) => console.log(t)); process.exit(0); }
if (!KEY) { console.error('Sila tetapkan GEMINI_API_KEY.'); process.exit(1); }
// --sebutan: jana semula hanya ayat dalam SEBUTAN (fail lama ditimpa)
const semula = process.argv.includes('--sebutan');
const senarai = semula ? semua.filter((t) => SEBUTAN[t]) : process.argv.includes('--sampel') ? semua.slice(0, 3) : semua;
const todo = semula ? senarai : senarai.filter((t) => !fs.existsSync(path.join(OUT, slug(t) + '.wav')));
console.log(`${todo.length} daripada ${semua.length} ayat perlu dijana (model ${MODEL})`);

let gagal = 0;
for (const t of todo) {
  let ok = false;
  for (let c = 1; c <= 4 && !ok; c++) {
    try {
      fs.writeFileSync(path.join(OUT, slug(t) + '.wav'), await jana(SEBUTAN[t] || t));
      console.log('✔', t);
      ok = true;
    } catch (e) {
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

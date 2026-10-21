// Jana gambar game menggunakan Codex CLI (ChatGPT image generation).
// Guna: node tools/gen-images.mjs [bilangan-serentak]
// Gambar asal (PNG besar) disimpan ke assets/img-src/<id>.png; yang sudah wujud dilangkau.
// Kemudian jalankan tools/resize-images.ps1 untuk hasilkan assets/img/<id>.jpg.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const DATA = require(path.join(root, 'js', 'data.js'));

const CODEX = process.env.CODEX_BIN || findCodex();
const OUT = path.join(root, 'assets', 'img-src');
const GEN = path.join(os.homedir(), '.codex', 'generated_images');
const CONCURRENCY = Number(process.argv[2] || 4);

const STYLE = "Cute flat cartoon illustration for a Malaysian Year 1 children's reading app. " +
  'Single subject centered, plain pure white background, thick soft dark outlines, bright cheerful colours, ' +
  'simple shapes, no written words, no letters, no watermark. Subject: ';

function findCodex() {
  const base = path.join(process.env.LOCALAPPDATA || '', 'OpenAI', 'Codex', 'bin');
  // Pilih codex.exe dalam subfolder yang paling baru diubah (versi lama di akar bin/ gagal baca senarai model)
  const dirs = fs.readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory())
    .map((d) => path.join(base, d.name, 'codex.exe')).filter((p) => fs.existsSync(p))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return dirs[0] || path.join(base, 'codex.exe');
}

function generate(item) {
  return new Promise((resolve) => {
    const prompt = `Use your image generation tool to create exactly ONE image. ${STYLE}${item.en}. ` +
      'Do not create or modify any files. Reply only with DONE.';
    // stdin mesti 'ignore': codex exec menunggu stdin jika ia paip yang terbuka
    const p = spawn(CODEX, ['exec', '--skip-git-repo-check', '-C', os.tmpdir(), prompt], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let log = '';
    p.stdout.on('data', (d) => (log += d));
    p.stderr.on('data', (d) => (log += d));
    p.on('close', () => {
      const m = log.match(/session id:\s*([0-9a-f-]{36})/i);
      const dir = m && path.join(GEN, m[1]);
      const png = dir && fs.existsSync(dir) && fs.readdirSync(dir).filter((f) => f.endsWith('.png'))[0];
      if (png) {
        fs.copyFileSync(path.join(dir, png), path.join(OUT, `${item.id}.png`));
        resolve(true);
      } else {
        fs.appendFileSync(path.join(OUT, '_gagal.log'), `${item.id}\n${log.slice(-1500)}\n\n`);
        resolve(false);
      }
    });
  });
}

fs.mkdirSync(OUT, { recursive: true });
const todo = DATA.senaraiGambar().filter((g) => !fs.existsSync(path.join(OUT, `${g.id}.png`)));
console.log(`Codex: ${CODEX}\n${todo.length} gambar perlu dijana (serentak: ${CONCURRENCY})`);

let i = 0, ok = 0, fail = 0;
async function worker() {
  while (i < todo.length) {
    const item = todo[i++];
    const t0 = Date.now();
    const good = await generate(item);
    good ? ok++ : fail++;
    console.log(`${good ? '✔' : '✘'} ${item.id} (${Math.round((Date.now() - t0) / 1000)}s)  [${ok + fail}/${todo.length}]`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Selesai: ${ok} berjaya, ${fail} gagal.`);

import fs from 'fs';
import path from 'path';

const audioDir = path.join(process.cwd(), 'assets', 'audio');
const outputReportPath = path.join(process.cwd(), 'docs', 'laporan-audio.txt');

function dapatkanTempohWav(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.length < 44) return 0;

    // Semak penanda RIFF & WAVE
    if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
      return 0;
    }

    let byteRate = 0;
    let dataSize = 0;
    let offset = 12;

    while (offset < buf.length - 8) {
      const chunkId = buf.toString('ascii', offset, offset + 4);
      const chunkSize = buf.readUInt32LE(offset + 4);

      if (chunkId === 'fmt ') {
        byteRate = buf.readUInt32LE(offset + 16);
      } else if (chunkId === 'data') {
        dataSize = chunkSize;
        break;
      }

      offset += 8 + chunkSize;
      if (chunkSize % 2 !== 0) offset += 1;
    }

    if (byteRate > 0 && dataSize > 0) {
      return dataSize / byteRate;
    }
  } catch (err) {
    console.error(`Gagal membaca ${filePath}:`, err.message);
  }
  return 0;
}

// Semak semua fail .wav
if (!fs.existsSync(audioDir)) {
  console.error(`Direktori tidak dijumpai: ${audioDir}`);
  process.exit(1);
}

const files = fs.readdirSync(audioDir).filter((f) => f.endsWith('.wav'));
const hasil = [];

for (const f of files) {
  const fullPath = path.join(audioDir, f);
  const durasi = dapatkanTempohWav(fullPath);
  const slug = f.replace(/\.wav$/, '');

  // Kriteria luar biasa panjang:
  // - Huruf / suku kata / perkataan pendek (slug <= 15 aksara) dengan tempoh > 2.5 saat.
  // - Perkataan / frasa sederhana (slug <= 30 aksara) dengan tempoh > 4.0 saat.
  // - Ayat (slug > 30 aksara) dengan tempoh > 7.0 saat.
  const nisbahPanjang = durasi / Math.max(1, slug.length);

  let isu = null;
  if (slug.length <= 15 && durasi > 2.5) {
    isu = 'Teks pendek tetapi tempoh melebihi 2.5s (potensi bacaan berganda)';
  } else if (slug.length <= 30 && durasi > 4.0) {
    isu = 'Frasa sederhana tetapi tempoh melebihi 4.0s (potensi bacaan berganda)';
  } else if (durasi > 7.0) {
    isu = 'Ayat panjang melebihi 7.0s (potensi bacaan berganda/senggang panjang)';
  }

  if (isu) {
    hasil.push({ file: f, durasi, slug, length: slug.length, isu });
  }
}

hasil.sort((a, b) => b.durasi - a.durasi);

let laporan = `===================================================\n`;
laporan += `LAPORAN SEMAKAN FAIL AUDIO BERGANDA & DURATION ANOMALY\n`;
laporan += `===================================================\n\n`;
laporan += `Jumlah fail .wav diperiksa : ${files.length}\n`;
laporan += `Jumlah fail berpotensi isu : ${hasil.length}\n\n`;
laporan += `Senarai fail audio berpotensi mempunyai bacaan berganda:\n`;
laporan += `---------------------------------------------------\n`;

if (hasil.length === 0) {
  laporan += `Tiada fail audio yang tempohnya luar biasa panjang dijumpai.\n`;
} else {
  hasil.forEach((item, idx) => {
    laporan += `${idx + 1}. ${item.file}\n`;
    laporan += `   Tempoh : ${item.durasi.toFixed(2)} saat\n`;
    laporan += `   Panjang teks slug : ${item.length} aksara\n`;
    laporan += `   Sebab  : ${item.isu}\n\n`;
  });
}

fs.mkdirSync(path.dirname(outputReportPath), { recursive: true });
fs.writeFileSync(outputReportPath, laporan, 'utf8');
console.log(`Laporan telah dijana di: ${outputReportPath}`);

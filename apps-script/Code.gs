// Terima markah daripada game "Mari Membaca" dan simpan dalam sheet Papan Markah Game Intervensi.
// Lajur: A KOD SEKOLAH, B NAMA SEKOLAH, C NAMA MURID, D TAHUN, E KELAS, F..Q = K1..K12.
// Satu baris setiap murid; setiap lajur K menyimpan peratus terbaik.

const SHEET_ID = '1zV5LaJaqE55Y-ojAk3dCJKbZJ5qrvZCdMGQJgA6RLjI';
const SHEET_NAME = 'Sheet1';
const COL_K1 = 6;

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    return json_(simpanMarkah_(d));
  } catch (err) {
    return json_({ ok: false, ralat: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, mesej: 'Pelayan markah Mari Membaca aktif.' });
}

function simpanMarkah_(d) {
  const m = /^K([1-9]|1[0-2])$/.exec(String(d.konstruk || ''));
  const peratus = Math.round(Number(d.peratus));
  if (!m || !(peratus >= 0 && peratus <= 100)) return { ok: false, ralat: 'Data markah tidak sah' };
  const murid = {
    kod: bersih_(d.kodSekolah), sekolah: bersih_(d.namaSekolah), nama: bersih_(d.nama),
    tahun: bersih_(d.tahun), kelas: bersih_(d.kelas),
  };
  if (!murid.nama) return { ok: false, ralat: 'Nama murid kosong' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const last = sh.getLastRow();
    const rows = last > 1 ? sh.getRange(2, 1, last - 1, 5).getValues() : [];
    const kunci = (k, n, t, c) => [k, n, t, c].map((x) => String(x).trim().toLowerCase()).join('|');
    const cari = kunci(murid.kod, murid.nama, murid.tahun, murid.kelas);
    let row = 0;
    for (let i = 0; i < rows.length; i++) {
      if (kunci(rows[i][0], rows[i][2], rows[i][3], rows[i][4]) === cari) { row = i + 2; break; }
    }
    if (!row) {
      row = last + 1;
      sh.getRange(row, 1, 1, 5).setValues([[murid.kod, murid.sekolah, murid.nama, murid.tahun, murid.kelas]]);
    }
    const sel = sh.getRange(row, COL_K1 + Number(m[1]) - 1);
    const lama = sel.getValue();
    const terbaik = lama === '' || peratus > Number(lama);
    if (terbaik) sel.setValue(peratus);
    return { ok: true, baris: row, disimpan: terbaik ? peratus : Number(lama) };
  } finally {
    lock.releaseLock();
  }
}

// Elak teks yang dibaca sebagai formula oleh Sheets
function bersih_(s) {
  s = String(s == null ? '' : s).trim().slice(0, 100);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Jalankan sekali dari editor Apps Script untuk memberi kebenaran akses sheet.
function benarkanAkses() {
  Logger.log(SpreadsheetApp.openById(SHEET_ID).getName());
}

// Titik permulaan aplikasi v2

Markah.flush();

// Daftar Service Worker
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Mula skrin
const muridSemasa = Murid.semasa();
if (!muridSemasa) {
  skrinDaftar();
} else {
  const watak = Murid.watak();
  if (!watak) {
    skrinPilihWatak();
  } else {
    skrinPeta();
  }
}

// Titik permulaan aplikasi v2

Markah.flush();

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

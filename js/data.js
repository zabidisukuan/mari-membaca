// Kandungan game, ditranskrip daripada "Bahan Baca K1-K12" (Mari Membaca Konstruk 1-12).
// Suku kata dipisahkan dengan '-'. Item bergambar: e = emoji sandaran, en = prompt jana gambar (English).
// Nama fail gambar = perkataan tanpa '-', atau `img` jika diberi.

const DATA = {
  tahap: [
    {
      id: 'K1', tajuk: 'Kenal Huruf', ikon: '🔤',
      huruf: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    },
    {
      id: 'K2', tajuk: 'Suku Kata KV', ikon: '🧩',
      gambar: [
        { w: 'bu-ku', e: '📗', en: 'a closed green hardcover book' },
        { w: 'ka-ki', e: '🦶', en: 'a human foot' },
        { w: 'la-ri', e: '🏃', en: 'a Malaysian boy running fast' },
        { w: 'ci-li', e: '🌶️', en: 'a long red chili pepper' },
        { w: 'gu-ru', e: '👨‍🏫', en: 'a friendly Malaysian male teacher pointing at a green chalkboard' },
        { w: 'ti-su', e: '🧻', en: 'a box of tissue paper with a tissue sticking out' },
        { w: 'ru-sa', e: '🦌', en: 'a deer with antlers standing' },
        { w: 'fo-to', e: '🖼️', en: 'a framed photo of a beach with an umbrella' },
        { w: 'mu-ka', e: '🙂', en: 'a smiling man face with a moustache' },
        { w: 'gi-gi', e: '🦷', en: 'a smiling mouth showing clean white teeth' },
        { w: 'to-pi', e: '🧢', en: 'a red baseball cap' },
        { w: 'ja-ri', e: '✋', en: 'an open hand showing five fingers' },
      ],
      senarai: 'ba-ca ba-tu bo-la bi-la cu-ba cu-ci ca-tu ci-ku da-gu du-ri da-du da-da fe-ri gu-si gu-li ha-ri ha-ti bi-ru lo-ri nu-ri pi-lu ka-ta ra-sa sa-tu su-ka ta-li wa-li yo-yo me-ja so-fa pe-ta be-ca pa-di li-ma pa-su la-ci si-ku sa-wi pa-lu du-ku ro-ti ma-ta',
    },
    {
      id: 'K3', tajuk: 'Perkataan KVKVKV', ikon: '🚣',
      gambar: [
        { w: 'ke-ta-wa', e: '😂', en: 'a yellow smiley face laughing out loud' },
        { w: 'ba-te-ri', e: '🔋', en: 'a single battery' },
        { w: 'te-la-ga', e: '🪣', en: 'a traditional stone water well with a wooden roof and bucket' },
        { w: 'le-la-ki', e: '👨', en: 'a friendly Malaysian man with a moustache, upper body' },
        { w: 'ke-me-ja', e: '👔', en: 'a light blue long-sleeve button shirt' },
        { w: 'ke-la-pa', e: '🥥', en: 'two coconuts, one cracked open, with palm leaves' },
        { w: 'ka-me-ra', e: '📷', en: 'a black photo camera' },
        { w: 'pe-ra-hu', e: '🛶', en: 'a wooden traditional Malay boat' },
        { w: 'me-na-ra', e: '🗼', en: 'a stone tower with small windows' },
        { w: 'pu-te-ri', e: '👸', en: 'a princess in a pink gown with a small crown' },
        { w: 'da-ha-ga', e: '🥤', en: 'a thirsty boy with tongue out looking at a glass of water' },
        { w: 'to-ma-to', e: '🍅', en: 'a ripe red tomato' },
      ],
      senarai: 'ba-ha-ya ca-ha-ya da-ha-ga ke-re-ta ke-ce-wa le-la-ki be-ru-du pe-ra-hu ke-pa-la to-ma-to re-ba-na ke-ru-si ke-la-di me-na-ra pu-te-ri pu-te-ra wa-ni-ta pe-ta-ni de-li-ma ke-ba-ya bo-ne-ka ce-ri-ta ne-ge-ri be-ri-ta ke-ra-ni ke-ra-bu ge-ru-di se-ro-ja be-ra-da se-pa-tu ke-me-ja pa-ha-la ba-ha-sa',
    },
    {
      id: 'K4', tajuk: 'Perkataan KVK', ikon: '🚌',
      gambar: [
        { w: 'gam', e: '🧴', en: 'a white bottle of glue with an orange cap' },
        { w: 'pin', e: '🧷', en: 'a safety pin' },
        { w: 'bas', e: '🚌', en: 'a red city bus' },
        { w: 'gol', e: '🥅', en: 'a football goal post with a net' },
        { w: 'jet', e: '✈️', en: 'a grey fighter jet plane flying' },
        { w: 'tin', e: '🥫', en: 'a red tin can' },
        { w: 'bot', e: '🚢', en: 'a small white motor boat on water' },
        { w: 'tas', e: '👜', en: 'a red handbag' },
        { w: 'rak', e: '📚', en: 'a wooden bookshelf with books' },
        { w: 'kek', e: '🎂', en: 'a birthday cake with candles' },
        { w: 'sos', e: '🍅', en: 'a red bottle of chili sauce' },
        { w: 'jam', e: '⏰', en: 'a round wall clock' },
      ],
      senarai: 'bas bom bot but dam dan das dal gas gam gol gun jam jus jet jag kek kan kon kit lam lom lin len mun mis mak mas nak nas sos cek sut tat sen kot pos cam pam sin tas tos tun lut',
    },
    {
      id: 'K5', tajuk: 'Perkataan KVKKV & KVKVK', ikon: '🍪',
      gambar: [
        { w: 'cik-gu', e: '👩‍🏫', en: 'a friendly Malaysian female teacher wearing a tudung, standing at a whiteboard' },
        { w: 'lam-pu', e: '💡', en: 'a table lamp with a red lampshade' },
        { w: 'bom-ba', e: '👨‍🚒', en: 'a Malaysian firefighter in a yellow-brown uniform and helmet holding a hose' },
        { w: 'ja-rum', e: '🪡', en: 'a sewing needle with a thread' },
        { w: 'da-tuk', e: '👴', en: 'a kind old Malaysian grandfather with glasses and white moustache' },
        { w: 'bis-kut', e: '🍪', en: 'a round chocolate chip cookie with a bite taken' },
        { w: 'a-wan', e: '☁️', en: 'a fluffy white cloud on a light blue sky patch' },
        { w: 'e-nam', e: '6️⃣', en: 'a big bold red number 6 digit' },
        { w: 'cin-cin', e: '💍', en: 'a silver ring with a purple diamond' },
        { w: 'ban-tal', e: '🛏️', en: 'a soft light green pillow' },
        { w: 'cer-min', e: '🪞', en: 'an oval mirror with a golden frame' },
        { w: 'pos-men', e: '📮', en: 'a smiling Malaysian postman in a blue uniform and cap holding a letter' },
      ],
      senarai: 'dak-wat dis-ket dok-tor mas-jid pis-tol pen-sel sam-pan lom-pat dom-pet ba-dak ci-cak hu-tan ko-tak ke-tam la-nun li-pas ma-sak pa-gar po-kok ti-kus e-mas o-tak ja-lan ka-nan ka-sut ku-lit tan-das mi-num ne-nek pu-tih re-hat lu-kis ta-hun se-mut si-lat po-lis pa-nas ra-jin ma-las ta-nah su-rat si-kat ro-jak',
    },
    {
      id: 'K6', tajuk: 'Perkataan "ng"', ikon: '🍌',
      gambar: [
        { w: 'u-dang', e: '🦐', en: 'an orange shrimp' },
        { w: 'lo-ceng', e: '🔔', en: 'a golden bell' },
        { w: 'pi-sang', e: '🍌', en: 'a yellow banana' },
        { w: 'ki-lang', e: '🏭', en: 'a factory building with chimneys and smoke' },
        { w: 'tu-lang', e: '🦴', en: 'a white bone' },
        { w: 'ja-gung', e: '🌽', en: 'an ear of yellow corn with green husk' },
        { w: 'ting-kap', e: '🪟', en: 'a wooden window with blue glass panes' },
        { w: 'o-rang', e: '🧑', en: 'a friendly Malaysian man, upper body' },
        { w: 'hi-dung', e: '👃', en: 'a human nose' },
      ],
      senarai: 'ping-gang pe-gang hi-dung tu-lang lang-sat ke-rang mu-sang sa-rang go-reng pi-ring te-pung ko-song le-sung ja-ring ka-rung bu-tang pe-ning so-tong ca-cing la-lang pa-tung ga-sing sa-rung pu-sing a-sing ku-cing a-lang pe-kung bi-sing ju-rang ba-tang pan-jang',
    },
    {
      id: 'K7', tajuk: 'Diftong ai, au, oi', ikon: '🐯',
      gambar: [
        { w: 'mi-sai', e: '🥸', en: 'a black curly moustache' },
        { w: 'tu-pai', e: '🐿️', en: 'a brown squirrel' },
        { w: 'ha-ri-mau', e: '🐯', en: 'a Malayan tiger standing' },
        { w: 'pu-lau', e: '🏝️', en: 'a small sandy island with one coconut tree' },
        { w: 'tem-bi-kai', e: '🍉', en: 'a slice of red watermelon' },
        { w: 'ko-boi', e: '🤠', en: 'a cowboy boy with a hat sitting on a tree stump' },
        { w: 'ran-tai', e: '📿', en: 'a black bead chain necklace' },
        { w: 'pi-sau', e: '🔪', en: 'a kitchen knife' },
        { w: 'li-mau', e: '🍊', en: 'an orange fruit with a leaf' },
      ],
      senarai: 'pa-kai bo-roi ker-bau mi-sai sa-lai ba-lai boi-kot hi-jau a-tau ran-tai si-lau wa-hai ke-ma-rau pu-lau ka-lau tu-pai gu-lai le-rai do-doi am-boi pe-tai li-mau lam-bai pi-sau ka-loi kel-dai se-rai pan-tau',
    },
    {
      id: 'K8', tajuk: 'Vokal Berganding', ikon: '🐊',
      cantum: 'di+a pi+sau pu+lau bu+ah du+it bu+ih ka+in la+uk li+ar ti+up',
      gambar: [
        { w: 'bu-ah', e: '🍎', en: 'a red apple fruit' },
        { w: 'bu-a-ya', e: '🐊', en: 'a green crocodile' },
        { w: 'bi-o-la', e: '🎻', en: 'a violin with a bow' },
        { w: 'ka-in', e: '🧣', en: 'a folded piece of colourful batik cloth' },
        { w: 'du-it', e: '💵', en: 'some paper money notes and coins' },
        { w: 'da-un', e: '🍃', en: 'a single green leaf' },
        { w: 'la-ut', e: '🌊', en: 'a calm blue sea with small waves' },
        { w: 'pi-a-no', e: '🎹', en: 'a black upright piano' },
        { w: 'tu-a-la', e: '🧺', en: 'a folded blue bath towel' },
        { w: 'be-ru-ang', e: '🐻', en: 'a brown bear' },
      ],
      senarai: 'sa-at sa-ins ka-in bu-ah bu-a-ya bi-o-la mu-zi-um ha-li-a la-uk su-ap ku-il ku-ah tu-a-la be-ru-ang du-it ga-un pi-a-no ke-lu-ar lu-as mu-ti-a-ra se-mu-a si-a-pa mu-at la-ut su-a-mi da-un di-a ce-ri-a',
    },
    {
      id: 'K9', tajuk: 'Digraf & Konsonan Bergabung', ikon: '🦁',
      // blank = bahagian yang dikosongkan, opsyen = pilihan jawapan (yang pertama betul)
      isi: [
        { w: 'tangan', blank: 'ng', opsyen: ['ng', 'ny', 'kh'], e: '✋', en: 'an open hand palm' },
        { w: 'bunga', blank: 'ng', opsyen: ['ng', 'ny', 'sy'], e: '🌸', en: 'a purple flower' },
        { w: 'telinga', blank: 'ng', opsyen: ['ng', 'ny', 'kh'], e: '👂', en: 'a human ear' },
        { w: 'pelangi', blank: 'ng', opsyen: ['ng', 'ny', 'sy'], e: '🌈', en: 'a rainbow with small clouds' },
        { w: 'singa', blank: 'ng', opsyen: ['ng', 'ny', 'kh'], e: '🦁', en: 'a lion' },
        { w: 'khemah', blank: 'kh', opsyen: ['kh', 'sy', 'ng'], e: '⛺', en: 'a blue camping tent on grass' },
        { w: 'syiling', blank: 'sy', opsyen: ['sy', 'kh', 'ny'], e: '🪙', en: 'a stack of gold and silver coins' },
        { w: 'syampu', blank: 'sy', opsyen: ['sy', 'kh', 'ng'], e: '🧴', en: 'two colourful shampoo bottles' },
        { w: 'krayon', blank: 'kr', opsyen: ['kr', 'dr', 'br'], e: '🖍️', en: 'a few colourful wax crayons' },
        { w: 'skuter', blank: 'sk', opsyen: ['sk', 'st', 'kr'], e: '🛵', en: 'a red motor scooter' },
        { w: 'aiskrim', blank: 'kr', opsyen: ['kr', 'dr', 'bl'], e: '🍦', en: 'an ice cream cone with pink and white scoops' },
        { w: 'troli', blank: 'tr', opsyen: ['tr', 'dr', 'br'], e: '🛒', en: 'a supermarket shopping trolley' },
        { w: 'traktor', blank: 'tr', opsyen: ['tr', 'kr', 'dr'], e: '🚜', en: 'a green farm tractor' },
        { w: 'stadium', blank: 'st', opsyen: ['st', 'sk', 'bl'], e: '🏟️', en: 'a big round sports stadium' },
        { w: 'klinik', blank: 'kl', opsyen: ['kl', 'bl', 'kr'], e: '🏥', en: 'a small clinic building with a red cross sign' },
        { w: 'strawberi', blank: 'st', opsyen: ['st', 'sk', 'sp'], e: '🍓', en: 'a red strawberry' },
      ],
      senarai: [
        { w: 'khabar', blank: 'kh', opsyen: ['kh', 'sy', 'ng'] },
        { w: 'khidmat', blank: 'kh', opsyen: ['kh', 'sy', 'ny'] },
        { w: 'khusus', blank: 'kh', opsyen: ['kh', 'sy', 'ng'] },
        { w: 'syabas', blank: 'sy', opsyen: ['sy', 'kh', 'ny'] },
        { w: 'syukur', blank: 'sy', opsyen: ['sy', 'kh', 'ng'] },
        { w: 'ngeri', blank: 'ng', opsyen: ['ng', 'ny', 'kh'] },
        { w: 'lengan', blank: 'ng', opsyen: ['ng', 'ny', 'sy'] },
        { w: 'drama', blank: 'dr', opsyen: ['dr', 'br', 'kr'] },
        { w: 'blok', blank: 'bl', opsyen: ['bl', 'kl', 'br'] },
        { w: 'brek', blank: 'br', opsyen: ['br', 'bl', 'dr'] },
        { w: 'stesen', blank: 'st', opsyen: ['st', 'sk', 'sp'] },
        { w: 'global', blank: 'gl', opsyen: ['gl', 'bl', 'kl'] },
      ],
    },
    {
      id: 'K10', tajuk: 'Imbuhan', ikon: '✏️',
      // [kata dasar, imbuhan, jawapan]
      imbuhan: [
        ['masak', '-an', 'masakan'], ['lukis', '-an', 'lukisan'], ['cari', '-an', 'carian'], ['buai', '-an', 'buaian'], ['cantum', '-an', 'cantuman'], ['baca', '-an', 'bacaan'],
        ['mula', '-i', 'mulai'], ['penuh', '-i', 'penuhi'], ['jalan', '-i', 'jalani'], ['suka', '-i', 'sukai'], ['rasa', '-i', 'rasai'],
        ['guna', '-kan', 'gunakan'], ['tutup', '-kan', 'tutupkan'], ['ambil', '-kan', 'ambilkan'], ['siap', '-kan', 'siapkan'], ['lepas', '-kan', 'lepaskan'], ['masuk', '-kan', 'masukkan'],
        ['baca', 'me-', 'membaca'], ['masak', 'me-', 'memasak'], ['tari', 'me-', 'menari'], ['lukis', 'me-', 'melukis'], ['cari', 'me-', 'mencari'], ['lawat', 'me-', 'melawat'],
        ['diri', 'ber-', 'berdiri'], ['lari', 'ber-', 'berlari'], ['main', 'ber-', 'bermain'], ['tanya', 'ber-', 'bertanya'], ['gurau', 'ber-', 'bergurau'], ['duri', 'ber-', 'berduri'],
        ['tutup', 'ter-', 'tertutup'], ['sepak', 'ter-', 'tersepak'], ['lepas', 'ter-', 'terlepas'], ['guris', 'ter-', 'terguris'], ['pulang', 'ter-', 'terpulang'],
      ],
      gambar: [
        { w: 'membaca', e: '📖', en: 'a Malaysian girl wearing a tudung sitting and reading a book' },
        { w: 'memasak', e: '🍳', en: 'a Malaysian mother cooking with a frying pan in the kitchen' },
        { w: 'menari', e: '💃', en: 'a Malaysian girl dancing happily' },
        { w: 'melukis', e: '🎨', en: 'a Malaysian boy painting a picture on an easel' },
        { w: 'berlari', e: '🏃', en: 'two Malaysian children running a race' },
        { w: 'bermain', e: '⚽', en: 'Malaysian children playing with a ball in a field' },
      ],
    },
    {
      id: 'K11', tajuk: 'Membaca Ayat', ikon: '📖',
      ayat: [
        { s: 'Mereka sedang membaca buku cerita.', img: 'ayat01', e: '📚', en: 'three Malaysian children sitting together reading a storybook' },
        { s: 'Kami belajar melukis dan mewarna di sekolah tadi.', img: 'ayat02', e: '🖍️', en: 'Malaysian school children drawing and colouring pictures at a classroom table' },
        { s: 'Suria dan Aidil sedang bermain pasir di taman.', img: 'ayat03', e: '🏖️', en: 'a Malaysian girl and boy playing in a sandbox at a playground' },
        { s: 'Rania bermain dam ular bersama dengan adiknya.', img: 'ayat04', e: '🎲', en: 'a Malaysian girl and her little brother playing a snakes and ladders board game on a mat' },
        { s: 'Asrul mempunyai lori mainan berwarna kuning.', img: 'ayat05', e: '🚚', en: 'a Malaysian boy lying on the floor playing with a yellow toy truck' },
        { s: 'Amirah suka menolong ibunya memasak di dapur.', img: 'ayat06', e: '🍲', en: 'a Malaysian girl helping her mother cook in the kitchen' },
        { s: 'Kamal dan Amin sedang bermain bola sepak.', img: 'ayat07', e: '⚽', en: 'two Malaysian boys playing football' },
        { s: 'Adri sibuk mengulangkaji pelajarannya di rumah.', img: 'ayat08', e: '✍️', en: 'a Malaysian boy studying and writing at a desk at home' },
        { s: 'Siti suka menari pada masa lapang.', img: 'ayat09', e: '💃', en: 'a Malaysian girl dancing happily with music notes around' },
        { s: 'Aminah rajin menyapu halaman rumahnya.', img: 'ayat10', e: '🧹', en: 'a Malaysian girl wearing a tudung sweeping the front yard of a house with a broom' },
      ],
    },
    {
      id: 'K12', tajuk: 'Kefahaman', ikon: '🧠',
      petikan: [
        {
          img: 'bas_kuning', e: '🚌', en: 'a yellow school bus with happy children waving from the windows',
          teks: ['Ini bas.', 'Ini bas bapa Abu.', 'Bapa Abu baru beli bas.', 'Bas ini berwarna kuning.'],
          soalan: [
            { q: 'Ini bas siapa?', opsyen: ['Bapa Abu', 'Kak Ros', 'Doktor Ramli'] },
            { q: 'Adakah ini bas baru?', opsyen: ['Ya, bas ini baru.', 'Tidak, bas ini lama.'] },
            { q: 'Apakah warna bas ini?', opsyen: ['Kuning', 'Merah', 'Biru'] },
          ],
        },
        {
          img: 'doktor', e: '👨‍⚕️', en: 'a friendly Malaysian male doctor in a white coat with a stethoscope holding a clipboard',
          teks: ['Ini doktor.', 'Ini Doktor Ramli.', 'Doktor bekerja di hospital.', 'Doktor rawat pesakit.'],
          soalan: [
            { q: 'Siapakah dia?', opsyen: ['Doktor Ramli', 'Bapa Abu', 'Cikgu Ramli'] },
            { q: 'Di manakah doktor bekerja?', opsyen: ['Di hospital', 'Di sekolah', 'Di kedai'] },
            { q: 'Apakah tugas doktor?', opsyen: ['Rawat pesakit', 'Memandu bas', 'Menjual kuih'] },
          ],
        },
        {
          img: 'payung', e: '☂️', en: 'an open rainbow-coloured umbrella',
          teks: ['Ini payung.', 'Ini payung Kak Ros.', 'Payung ini berwarna-warni.', 'Payung digunakan semasa hujan.'],
          soalan: [
            { q: 'Ini payung siapa?', opsyen: ['Kak Ros', 'Bapa Abu', 'Doktor Ramli'] },
            { q: 'Apakah warna payung ini?', opsyen: ['Berwarna-warni', 'Hitam', 'Putih'] },
            { q: 'Bilakah payung digunakan?', opsyen: ['Semasa hujan', 'Semasa tidur', 'Semasa makan'] },
          ],
        },
      ],
    },
  ],
};

// Semua gambar yang diperlukan: { id, en }. Digunakan oleh game dan tools/gen-images.mjs.
DATA.senaraiGambar = function () {
  const out = [];
  for (const t of DATA.tahap) {
    for (const g of t.gambar || []) out.push({ id: g.img || g.w.replace(/-/g, ''), en: g.en });
    for (const g of t.isi || []) out.push({ id: g.img || g.w, en: g.en });
    for (const g of t.ayat || []) out.push({ id: g.img, en: g.en });
    for (const g of t.petikan || []) out.push({ id: g.img, en: g.en });
  }
  const seen = new Set();
  return out.filter((g) => !seen.has(g.id) && seen.add(g.id));
};

if (typeof module !== 'undefined') module.exports = DATA;

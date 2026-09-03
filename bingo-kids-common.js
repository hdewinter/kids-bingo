// Gedeelde logica voor Kids Bingo — bingo met plaatjes (emoji) i.p.v. getallen.
// Gebaseerd op de structuur van Bingo 2.0 (bingo-common.js): seeded kaartgeneratie,
// intypbare code, QR-encodering en check-logica — maar i.p.v. genummerde kolom-
// ranges trekt elke kaart willekeurige plaatjes uit een gekozen thema.
//
// Kaartformaten (altijd vierkant):
//   kids3 (3x3, 9 plaatjes, geen vrij vakje)
//   kids4 (4x4, 16 plaatjes, geen vrij vakje)
//   kids5 (5x5, 24 plaatjes + 1 gratis vakje in het midden)
// Winnen: alleen met een volle kaart (net als 30-bal Speed in Bingo 2.0).
//
// Zelf een thema toevoegen: zie README.md — voeg een blok toe aan KIDS_THEMES
// hieronder met minimaal 25 items (voor de 5x5-kaart) en de app pikt het
// automatisch op, overal (trekker, kaartgenerator, check).

/* ---------- Thema-definities ---------- */
/* Elk thema heeft minimaal 25 items zodat ook de 5x5-kaart altijd genoeg
   unieke plaatjes heeft. id's zijn stabiel per thema (thema-prefix + volgnr)
   — verander bestaande id's niet, dat kan oude codes/QR's laten breken. */
const KIDS_THEMES = {
  dieren: {
    id: 'dieren', label: 'Dieren', icon: '🐾',
    items: [
      {emoji:'🐶',label:'Hond'},{emoji:'🐱',label:'Kat'},{emoji:'🐭',label:'Muis'},
      {emoji:'🐹',label:'Hamster'},{emoji:'🐰',label:'Konijn'},{emoji:'🦊',label:'Vos'},
      {emoji:'🐻',label:'Beer'},{emoji:'🐼',label:'Panda'},{emoji:'🐨',label:'Koala'},
      {emoji:'🐯',label:'Tijger'},{emoji:'🦁',label:'Leeuw'},{emoji:'🐮',label:'Koe'},
      {emoji:'🐷',label:'Varken'},{emoji:'🐸',label:'Kikker'},{emoji:'🐵',label:'Aap'},
      {emoji:'🐔',label:'Kip'},{emoji:'🐧',label:'Pinguïn'},{emoji:'🐦',label:'Vogel'},
      {emoji:'🐤',label:'Kuiken'},{emoji:'🦆',label:'Eend'},{emoji:'🦅',label:'Arend'},
      {emoji:'🦉',label:'Uil'},{emoji:'🦇',label:'Vleermuis'},{emoji:'🐺',label:'Wolf'},
      {emoji:'🐴',label:'Paard'},{emoji:'🦄',label:'Eenhoorn'},{emoji:'🐝',label:'Bij'},
      {emoji:'🐛',label:'Rups'},{emoji:'🦋',label:'Vlinder'},{emoji:'🐌',label:'Slak'},
      {emoji:'🐞',label:'Lieveheersbeestje'},{emoji:'🐜',label:'Mier'}
    ]
  },
  boerderij: {
    id: 'boerderij', label: 'Boerderij', icon: '🚜',
    items: [
      {emoji:'🐮',label:'Koe'},{emoji:'🐷',label:'Varken'},{emoji:'🐔',label:'Kip'},
      {emoji:'🐑',label:'Schaap'},{emoji:'🐐',label:'Geit'},{emoji:'🐴',label:'Paard'},
      {emoji:'🦆',label:'Eend'},{emoji:'🐇',label:'Konijn'},{emoji:'🌾',label:'Graan'},
      {emoji:'🚜',label:'Tractor'},{emoji:'🧑\u200d🌾',label:'Boer'},{emoji:'🐕',label:'Hond'},
      {emoji:'🐈',label:'Kat'},{emoji:'🥚',label:'Ei'},{emoji:'🧀',label:'Kaas'},
      {emoji:'🥛',label:'Melk'},{emoji:'🌽',label:'Maïs'},{emoji:'🍎',label:'Appel'},
      {emoji:'🍅',label:'Tomaat'},{emoji:'🥕',label:'Wortel'},{emoji:'🎃',label:'Pompoen'},
      {emoji:'🌻',label:'Zonnebloem'},{emoji:'🍇',label:'Druiven'},{emoji:'🪣',label:'Emmer'},
      {emoji:'🧺',label:'Mand'},{emoji:'🏡',label:'Boerderij'},{emoji:'🛖',label:'Schuur'},
      {emoji:'🦃',label:'Kalkoen'},{emoji:'🐁',label:'Muis'},{emoji:'🐖',label:'Big'}
    ]
  },
  ruimte: {
    id: 'ruimte', label: 'Ruimte', icon: '🚀',
    items: [
      {emoji:'🚀',label:'Raket'},{emoji:'🛸',label:'UFO'},{emoji:'🌍',label:'Aarde'},
      {emoji:'🌕',label:'Volle maan'},{emoji:'🌖',label:'Afnemende maan'},{emoji:'🌗',label:'Halve maan'},
      {emoji:'🌘',label:'Wassende maansikkel'},{emoji:'🌑',label:'Nieuwe maan'},{emoji:'🌒',label:'Jonge maansikkel'},
      {emoji:'🌓',label:'Eerste kwartier'},{emoji:'🌔',label:'Wassende maan'},{emoji:'☀️',label:'Zon'},
      {emoji:'⭐',label:'Ster'},{emoji:'✨',label:'Sterretjes'},{emoji:'💫',label:'Duizelig'},
      {emoji:'☄️',label:'Komeet'},{emoji:'🪐',label:'Saturnus'},{emoji:'🛰️',label:'Satelliet'},
      {emoji:'👨\u200d🚀',label:'Astronaut'},{emoji:'👽',label:'Alien'},{emoji:'🌌',label:'Melkweg'},
      {emoji:'🔭',label:'Telescoop'},{emoji:'🌟',label:'Fonkelster'},{emoji:'🌚',label:'Maangezicht (donker)'},
      {emoji:'🌝',label:'Maangezicht (licht)'},{emoji:'🪨',label:'Maansteen'},{emoji:'🌠',label:'Vallende ster'},
      {emoji:'🧑\u200d🚀',label:'Ruimtevaarder'},{emoji:'🌎',label:'Aarde (Amerika)'},{emoji:'🌏',label:'Aarde (Azië)'}
    ]
  },
  zee: {
    id: 'zee', label: 'Zee', icon: '🌊',
    items: [
      {emoji:'🐠',label:'Vis'},{emoji:'🐟',label:'Visje'},{emoji:'🐡',label:'Kogelvis'},
      {emoji:'🦈',label:'Haai'},{emoji:'🐙',label:'Octopus'},{emoji:'🦑',label:'Inktvis'},
      {emoji:'🦀',label:'Krab'},{emoji:'🦞',label:'Kreeft'},{emoji:'🦐',label:'Garnaal'},
      {emoji:'🐚',label:'Schelp'},{emoji:'🐬',label:'Dolfijn'},{emoji:'🐳',label:'Walvis'},
      {emoji:'🐋',label:'Grote walvis'},{emoji:'🦭',label:'Zeehond'},{emoji:'🐢',label:'Schildpad'},
      {emoji:'🌊',label:'Golf'},{emoji:'⚓',label:'Anker'},{emoji:'🚢',label:'Schip'},
      {emoji:'⛵',label:'Zeilboot'},{emoji:'🏖️',label:'Strand'},{emoji:'🏝️',label:'Eiland'},
      {emoji:'🧜\u200d♀️',label:'Zeemeermin'},{emoji:'🪸',label:'Koraal'},{emoji:'🦦',label:'Otter'},
      {emoji:'🦆',label:'Eend'},{emoji:'🐊',label:'Krokodil'},{emoji:'🐳',label:'Walvis (2)'},
      {emoji:'🎣',label:'Vissen'},{emoji:'🚤',label:'Speedboot'},{emoji:'🛟',label:'Zwemband'}
    ]
  },
  vervoer: {
    id: 'vervoer', label: 'Vervoer', icon: '🚗',
    items: [
      {emoji:'🚗',label:'Auto'},{emoji:'🚕',label:'Taxi'},{emoji:'🚙',label:'SUV'},
      {emoji:'🚌',label:'Bus'},{emoji:'🚎',label:'Tram'},{emoji:'🏎️',label:'Racewagen'},
      {emoji:'🚓',label:'Politieauto'},{emoji:'🚑',label:'Ambulance'},{emoji:'🚒',label:'Brandweerwagen'},
      {emoji:'🚐',label:'Bestelbus'},{emoji:'🚚',label:'Vrachtwagen'},{emoji:'🚛',label:'Grote vrachtwagen'},
      {emoji:'🚜',label:'Tractor'},{emoji:'🛵',label:'Scooter'},{emoji:'🏍️',label:'Motor'},
      {emoji:'🚲',label:'Fiets'},{emoji:'🛴',label:'Step'},{emoji:'🚂',label:'Trein'},
      {emoji:'🚆',label:'Sneltrein'},{emoji:'🚊',label:'Metro'},{emoji:'🚁',label:'Helikopter'},
      {emoji:'✈️',label:'Vliegtuig'},{emoji:'🛩️',label:'Klein vliegtuig'},{emoji:'🚀',label:'Raket'},
      {emoji:'⛵',label:'Zeilboot'},{emoji:'🚤',label:'Speedboot'},{emoji:'🛳️',label:'Cruiseschip'},
      {emoji:'⚓',label:'Anker'},{emoji:'🚦',label:'Verkeerslicht'},{emoji:'🅿️',label:'Parkeerplek'}
    ]
  },
  fruitgroente: {
    id: 'fruitgroente', label: 'Fruit & Groente', icon: '🍎',
    items: [
      {emoji:'🍎',label:'Rode appel'},{emoji:'🍏',label:'Groene appel'},{emoji:'🍐',label:'Peer'},
      {emoji:'🍊',label:'Sinaasappel'},{emoji:'🍋',label:'Citroen'},{emoji:'🍌',label:'Banaan'},
      {emoji:'🍉',label:'Watermeloen'},{emoji:'🍇',label:'Druiven'},{emoji:'🍓',label:'Aardbei'},
      {emoji:'🫐',label:'Bosbes'},{emoji:'🍒',label:'Kers'},{emoji:'🍑',label:'Perzik'},
      {emoji:'🥭',label:'Mango'},{emoji:'🍍',label:'Ananas'},{emoji:'🥥',label:'Kokosnoot'},
      {emoji:'🥝',label:'Kiwi'},{emoji:'🍅',label:'Tomaat'},{emoji:'🥑',label:'Avocado'},
      {emoji:'🍆',label:'Aubergine'},{emoji:'🥔',label:'Aardappel'},{emoji:'🥕',label:'Wortel'},
      {emoji:'🌽',label:'Maïs'},{emoji:'🥒',label:'Komkommer'},{emoji:'🥦',label:'Broccoli'},
      {emoji:'🧄',label:'Knoflook'},{emoji:'🧅',label:'Ui'},{emoji:'🥬',label:'Sla'},
      {emoji:'🫑',label:'Paprika'},{emoji:'🌶️',label:'Chilipeper'},{emoji:'🍄',label:'Paddenstoel'}
    ]
  },
  feest: {
    id: 'feest', label: 'Speelgoed & Feest', icon: '🎉',
    items: [
      {emoji:'🎈',label:'Ballon'},{emoji:'🎉',label:'Confetti'},{emoji:'🎊',label:'Slingers'},
      {emoji:'🎁',label:'Cadeau'},{emoji:'🪅',label:'Piñata'},{emoji:'🧸',label:'Knuffelbeer'},
      {emoji:'🪀',label:'Jojo'},{emoji:'🪁',label:'Vlieger'},{emoji:'🎯',label:'Dartbord'},
      {emoji:'🎨',label:'Palet'},{emoji:'🖍️',label:'Krijtjes'},{emoji:'🧩',label:'Puzzel'},
      {emoji:'🪄',label:'Toverstaf'},{emoji:'🎭',label:'Theatermasker'},{emoji:'🎪',label:'Circus'},
      {emoji:'🎠',label:'Draaimolen'},{emoji:'🎡',label:'Reuzenrad'},{emoji:'🎢',label:'Achtbaan'},
      {emoji:'🎲',label:'Dobbelsteen'},{emoji:'🃏',label:'Speelkaart'},{emoji:'🎳',label:'Bowlen'},
      {emoji:'🥁',label:'Trommel'},{emoji:'🎸',label:'Gitaar'},{emoji:'🎺',label:'Trompet'},
      {emoji:'🎻',label:'Viool'},{emoji:'🎹',label:'Piano'},{emoji:'🎷',label:'Saxofoon'},
      {emoji:'🎂',label:'Verjaardagstaart'},{emoji:'🥳',label:'Feestneus'},{emoji:'🎀',label:'Strik'}
    ]
  },
  winterfeest: {
    id: 'winterfeest', label: 'Sinterklaas & Kerst', icon: '🎄',
    items: [
      {emoji:'🎁',label:'Cadeau'},{emoji:'🍫',label:'Chocolade'},{emoji:'👞',label:'Schoen zetten'},
      {emoji:'🥕',label:'Wortel voor het paard'},{emoji:'🌰',label:'Kastanje'},{emoji:'🎉',label:'Confetti'},
      {emoji:'🎊',label:'Slingers'},{emoji:'🕯️',label:'Kaars'},{emoji:'🌟',label:'Fonkelster'},
      {emoji:'⭐',label:'Ster'},{emoji:'✨',label:'Sterretjes'},{emoji:'🔔',label:'Belletje'},
      {emoji:'🎄',label:'Kerstboom'},{emoji:'🎅',label:'Kerstman'},{emoji:'🤶',label:'Kerstvrouw'},
      {emoji:'⛄',label:'Sneeuwpop'},{emoji:'❄️',label:'Sneeuwvlok'},{emoji:'☃️',label:'Sneeuwman'},
      {emoji:'🧤',label:'Want'},{emoji:'🧣',label:'Sjaal'},{emoji:'🧦',label:'Sok'},
      {emoji:'🥾',label:'Laars'},{emoji:'🎶',label:'Muzieknoot'},{emoji:'🥁',label:'Trommel'},
      {emoji:'✉️',label:'Verlanglijstje'},{emoji:'🐴',label:'Paard'},{emoji:'🎶',label:'Sinterklaasliedje'},
      {emoji:'🍬',label:'Snoepgoed'},{emoji:'🥮',label:'Kruidnoten'},{emoji:'🎇',label:'Vuurwerk'}
    ]
  },
  weer: {
    id: 'weer', label: 'Weer & Natuur', icon: '🌈',
    items: [
      {emoji:'☀️',label:'Zon'},{emoji:'🌤️',label:'Zon met wolk'},{emoji:'⛅',label:'Halfbewolkt'},
      {emoji:'☁️',label:'Wolk'},{emoji:'🌦️',label:'Regenbui met zon'},{emoji:'🌧️',label:'Regen'},
      {emoji:'⛈️',label:'Onweer'},{emoji:'🌩️',label:'Bliksem'},{emoji:'🌨️',label:'Sneeuwbui'},
      {emoji:'❄️',label:'Sneeuwvlok'},{emoji:'☃️',label:'Sneeuwman'},{emoji:'🌪️',label:'Tornado'},
      {emoji:'🌈',label:'Regenboog'},{emoji:'☔',label:'Paraplu'},{emoji:'💧',label:'Druppel'},
      {emoji:'🌊',label:'Golf'},{emoji:'🔥',label:'Vuur'},{emoji:'🌋',label:'Vulkaan'},
      {emoji:'🏔️',label:'Besneeuwde berg'},{emoji:'⛰️',label:'Berg'},{emoji:'🌲',label:'Naaldboom'},
      {emoji:'🌳',label:'Boom'},{emoji:'🌴',label:'Palmboom'},{emoji:'🍁',label:'Herfstblad'},
      {emoji:'🍂',label:'Vallende blaadjes'},{emoji:'🌺',label:'Hibiscus'},{emoji:'🌸',label:'Kersenbloesem'},
      {emoji:'🌼',label:'Madeliefje'},{emoji:'🌷',label:'Tulp'},{emoji:'🌻',label:'Zonnebloem'}
    ]
  },
  snoep: {
    id: 'snoep', label: 'Eten & Snoep', icon: '🍰',
    items: [
      {emoji:'🍕',label:'Pizza'},{emoji:'🍔',label:'Hamburger'},{emoji:'🍟',label:'Frietjes'},
      {emoji:'🌭',label:'Hotdog'},{emoji:'🥪',label:'Broodje'},{emoji:'🌮',label:'Taco'},
      {emoji:'🌯',label:'Wrap'},{emoji:'🥗',label:'Salade'},{emoji:'🍝',label:'Pasta'},
      {emoji:'🍰',label:'Taart'},{emoji:'🧁',label:'Cupcake'},{emoji:'🍩',label:'Donut'},
      {emoji:'🍪',label:'Koekje'},{emoji:'🍫',label:'Chocolade'},{emoji:'🍬',label:'Snoepje'},
      {emoji:'🍭',label:'Lolly'},{emoji:'🍦',label:'IJsje'},{emoji:'🍨',label:'Softijs'},
      {emoji:'🥧',label:'Appeltaart'},{emoji:'🥨',label:'Pretzel'},{emoji:'🍿',label:'Popcorn'},
      {emoji:'🧇',label:'Wafel'},{emoji:'🥞',label:'Pannenkoek'},{emoji:'🍳',label:'Gebakken ei'},
      {emoji:'🥓',label:'Spek'},{emoji:'🍗',label:'Kippenpoot'},{emoji:'🍣',label:'Sushi'},
      {emoji:'🍤',label:'Tempura'},{emoji:'🧃',label:'Sapje'},{emoji:'🥤',label:'Drankje'}
    ]
  }
};
const DEFAULT_THEME_ID = 'dieren';

/* ---------- Kaartformaten (variant-definities) ---------- */
const KIDS_VARIANTS = {
  kids3: {
    id: 'kids3', label: 'Klein (3x3)', rows: 3, cols: 3,
    hasFreeSpace: false, freeSpace: null,
    cardsPerPage: 9, printCols: 3,
    description: 'Kleine kaart met 9 plaatjes, geen vrij vakje. Fijn voor de allerkleinsten.'
  },
  kids4: {
    id: 'kids4', label: 'Middel (4x4)', rows: 4, cols: 4,
    hasFreeSpace: false, freeSpace: null,
    cardsPerPage: 4, printCols: 2,
    description: 'Kaart met 16 plaatjes, geen vrij vakje.'
  },
  kids5: {
    id: 'kids5', label: 'Groot (5x5)', rows: 5, cols: 5,
    hasFreeSpace: true, freeSpace: {r:2,c:2},
    cardsPerPage: 4, printCols: 2,
    description: 'Grote kaart met 24 plaatjes en een gratis vakje in het midden.'
  }
};
const DEFAULT_VARIANT_ID = 'kids4';

/* Zorgt dat elk thema-item een stabiel, kort id heeft (thema-prefix + volgnummer).
   Wordt 1x opgebouwd zodra dit bestand laadt. */
(function assignItemIds(){
  Object.values(KIDS_THEMES).forEach(theme => {
    theme.items.forEach((item, i) => {
      item.id = theme.id + '-' + String(i+1).padStart(2,'0');
    });
    theme.itemById = {};
    theme.items.forEach(item => { theme.itemById[item.id] = item; });
  });
})();

/* ---------- Seeded RNG (mulberry32) — identiek aan Bingo 2.0 ---------- */
function mulberry32(seed){
  let s = seed >>> 0;
  return function(){
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleWith(arr, rng){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(rng()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function randomSeed(){
  return Math.floor(Math.random()*4294967295);
}

/* ---------- Kaartgeneratie ---------- */
function generateKidsGrid(theme, variant, rng){
  const need = variant.rows*variant.cols - (variant.hasFreeSpace ? 1 : 0);
  const ids = theme.items.map(it => it.id);
  const picked = shuffleWith(ids, rng).slice(0, need);
  const grid = Array.from({length:variant.rows}, () => Array(variant.cols).fill(null));
  let idx = 0;
  for(let r=0;r<variant.rows;r++){
    for(let c=0;c<variant.cols;c++){
      if(variant.hasFreeSpace && variant.freeSpace.r === r && variant.freeSpace.c === c){
        grid[r][c] = 'FREE';
      } else {
        grid[r][c] = picked[idx++];
      }
    }
  }
  return grid;
}

function generateKidsCard(themeId, variantId, seed, cardIndex){
  const theme = KIDS_THEMES[themeId];
  const variant = KIDS_VARIANTS[variantId];
  const rng = mulberry32(seed);
  const grid = generateKidsGrid(theme, variant, rng);
  return {
    themeId, variantId, grid, seed, cardIndex,
    code: encodeTextCode(themeId, variantId, seed, cardIndex)
  };
}

function generateCardsForVariant(themeId, variantId, count){
  const cards = [];
  for(let i=0;i<count;i++){
    const seed = randomSeed();
    cards.push(generateKidsCard(themeId, variantId, seed, i));
  }
  return cards;
}

function paginateCards(cards, cardsPerPage){
  const pages = [];
  for(let i=0;i<cards.length;i+=cardsPerPage){
    pages.push(cards.slice(i, i+cardsPerPage));
  }
  return pages;
}

/* ---------- Korte intypbare code (identiek algoritme aan Bingo 2.0) ----------
   Alfabet zonder O/I/L/U om verwarring te voorkomen, met controlecijfer. */
const SAFE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function seedToSafeCode(seed){
  let n = seed >>> 0;
  if(n === 0) return '0';
  let out = '';
  while(n > 0){
    out = SAFE_ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return out;
}
function safeCodeToSeed(str){
  let n = 0;
  for(let i=0;i<str.length;i++){
    const idx = SAFE_ALPHABET.indexOf(str[i]);
    if(idx === -1) return null;
    n = n * 32 + idx;
  }
  return n >>> 0;
}
function checksumChar(seedCodeBody){
  let sum = 0;
  for(let i=0;i<seedCodeBody.length;i++){
    sum = (sum * 31 + SAFE_ALPHABET.indexOf(seedCodeBody[i])) % 32;
  }
  return SAFE_ALPHABET[sum];
}
function decodeSeedPart(str){
  if(str.length < 2) return null;
  const body = str.slice(0, -1);
  const check = str.slice(-1);
  const bodySeed = safeCodeToSeed(body);
  if(bodySeed !== null && checksumChar(body) === check) return bodySeed;
  return null;
}

function encodeTextCode(themeId, variantId, seed, cardIndex){
  const body = seedToSafeCode(seed);
  const seedStr = body + checksumChar(body);
  const idxStr = String(cardIndex + 1).padStart(2, '0');
  return themeId.toUpperCase() + '-' + variantId.toUpperCase() + '-' + seedStr + '-' + idxStr;
}
function decodeTextCode(code){
  if(!code) return null;
  const clean = code.trim().toUpperCase();
  const parts = clean.split('-');
  if(parts.length !== 4) return null;
  const themeId = parts[0].toLowerCase();
  const variantId = parts[1].toLowerCase();
  if(!KIDS_THEMES[themeId] || !KIDS_VARIANTS[variantId]) return null;
  const seed = decodeSeedPart(parts[2]);
  const idx = parseInt(parts[3], 10) - 1;
  if(seed === null || isNaN(idx) || idx < 0) return null;
  return generateKidsCard(themeId, variantId, seed, idx);
}

/* ---------- QR-encodering van een kaart ----------
   Bevat de kaart-inhoud zelf (niet alleen de seed), zodat scannen altijd werkt
   ook als een thema later bewerkt wordt. */
function encodeCardQR(card){
  const rows = card.grid.map(row => row.map(v => v === 'FREE' ? 'F' : v).join(',')).join('|');
  return 'KCARD1:' + card.themeId + ':' + card.variantId + ':' + rows;
}
function decodeCardQR(text){
  if(!text || !text.startsWith('KCARD1:')) return null;
  const body = text.slice(7);
  const parts = body.split(':');
  if(parts.length < 3) return null;
  const themeId = parts[0], variantId = parts[1];
  const rowsPart = parts.slice(2).join(':');
  if(!KIDS_THEMES[themeId] || !KIDS_VARIANTS[variantId]) return null;
  const grid = rowsPart.split('|').map(rowStr => rowStr.split(',').map(cell => cell === 'F' ? 'FREE' : cell));
  return { themeId, variantId, grid, code: null };
}

/* ---------- Trekking-QR (niet meer gebruikt in de UI, blijft beschikbaar in de bibliotheek) ---------- */
function encodeStateQR(themeId, calledIdArray){
  return 'KSTATE:' + themeId + ':' + calledIdArray.slice().sort().join(',');
}
function decodeStateQR(text){
  if(!text || !text.startsWith('KSTATE:')) return null;
  const rest = text.slice(7);
  const sep = rest.indexOf(':');
  if(sep === -1) return null;
  const themeId = rest.slice(0, sep);
  if(!KIDS_THEMES[themeId]) return null;
  const body = rest.slice(sep+1);
  const ids = body.trim() === '' ? [] : body.split(',').filter(Boolean);
  return { themeId, calledIds: ids };
}

/* ---------- Winst-check ---------- */
function checkCardAgainstDrawn(card, calledIdSet){
  const cells = card.grid.flat();
  const playable = cells.filter(v => v !== 'FREE');
  const hitCount = playable.filter(v => calledIdSet.has(v)).length;
  const fullCard = playable.length > 0 && hitCount === playable.length;
  return { fullCard, hitCount, total: playable.length };
}

/* ---------- HTML-weergave van een check-resultaat (niet meer gebruikt in de UI, blijft beschikbaar in de bibliotheek) ---------- */
function renderCheckResultHTML(res, card, calledIdSet){
  const theme = KIDS_THEMES[card.themeId];
  const variant = KIDS_VARIANTS[card.variantId];
  const title = res.fullCard ? '🎉 BINGO! Volle kaart! 🎉' : (res.hitCount + ' van ' + res.total + ' plaatjes geraakt');
  const cls = res.fullCard ? 'win' : '';

  let gridHTML = `<div class="check-grid" style="grid-template-columns:repeat(${variant.cols},minmax(0,1fr));">`;
  for(let r=0;r<variant.rows;r++){
    for(let c=0;c<variant.cols;c++){
      const v = card.grid[r][c];
      if(v === 'FREE'){
        gridHTML += '<div class="check-cell hit"><span class="cc-emoji">⭐</span></div>';
      } else {
        const item = theme ? theme.itemById[v] : null;
        const hit = calledIdSet.has(v);
        gridHTML += `<div class="check-cell ${hit ? 'hit' : 'miss'}"><span class="cc-emoji">${item ? item.emoji : '❔'}</span></div>`;
      }
    }
  }
  gridHTML += '</div>';

  return `
    <div class="result-box ${cls}">
      <div class="result-title">${title}</div>
      ${gridHTML}
    </div>
  `;
}

if(typeof module !== 'undefined'){
  module.exports = {
    KIDS_THEMES, DEFAULT_THEME_ID, KIDS_VARIANTS, DEFAULT_VARIANT_ID,
    generateKidsCard, generateCardsForVariant, paginateCards,
    encodeTextCode, decodeTextCode, encodeCardQR, decodeCardQR,
    encodeStateQR, decodeStateQR, checkCardAgainstDrawn, renderCheckResultHTML,
    randomSeed, mulberry32, shuffleWith
  };
}

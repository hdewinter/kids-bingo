# Kids Bingo

Digitale kinderbingo met plaatjes (emoji) in plaats van getallen, gebaseerd op
de opzet van [Bingo 2.0](https://github.com/hdewinter/bingo-2.0): dezelfde
seeded kaartgeneratie, maar dan met thema's zoals Dieren, Boerderij, Ruimte
of Sinterklaas. Kaarten worden geprint en gelamineerd; checken gebeurt met
de hand door een volwassene aan de hand van het overzicht op de trekker —
geen QR-codes of scanner nodig.

Live: https://hdewinter.github.io/kids-bingo/

## Pagina's
- `index.html` — de trekker: kies een thema, trek plaatjes (los of automatisch). Het overzichtsrooster rechts laat precies zien welke plaatjes al getrokken zijn, zodat je een kaart handmatig kunt checken.
- `cards.html` — kaartgenerator: kies thema + formaat (3x3 / 4x4 / 5x5), genereer kaarten en print/lamineer ze. Elke kaart toont duidelijk het thema, zodat je weet welke trekking erbij hoort.

## Kaartformaten
- **Klein (3x3)** — 9 plaatjes, geen vrij vakje
- **Middel (4x4)** — 16 plaatjes, geen vrij vakje
- **Groot (5x5)** — 24 plaatjes + 1 gratis vakje in het midden

Winnen kan alleen met een volle kaart.

## Zelf een thema toevoegen
Alles staat in `bingo-kids-common.js`, bovenaan in het `KIDS_THEMES`-object.
Een thema toevoegen is puur tekst — geen afbeeldingen nodig, want alles
gebruikt emoji:

```javascript
mijnthema: {
  id: 'mijnthema', label: 'Mijn Thema', icon: '🎨',
  items: [
    {emoji:'🍕', label:'Pizza'},
    {emoji:'🚗', label:'Auto'},
    // ... minimaal 25 items, voor de 5x5-kaart
  ]
}
```

Vuistregels:
- **Minimaal 25 items** per thema, anders werkt de 5x5-kaart niet.
- Bewaar de wijziging via de GitHub-webinterface (bewerk `bingo-kids-common.js`
  direct in de browser, of upload een nieuwe versie) en commit — GitHub Pages
  publiceert automatisch.

Wil je liever eigen tekeningen/afbeeldingen in plaats van emoji? Dat kan ook,
maar dat vraagt een kleine aanpassing van de kaart-rendering (een `src`
per item i.p.v. een emoji-teken) — vraag dat gerust apart aan.

## Technisch
Volledig statisch (geen backend/database), net als Bingo 2.0:
- Seeded RNG (`mulberry32`) zodat kaartgeneratie reproduceerbaar en uniek per kaart is.
- Geen QR-codes, scanner of digitale check — controle gebeurt met de hand.
- PWA (`manifest.json` + `service-worker.js`): installeerbaar als app-icoon, werkt ook offline nadat de site één keer geopend is.

## Als app op Android installeren
**Optie 1 — direct installeren (geen .apk nodig):**
Open https://hdewinter.github.io/kids-bingo/ in Chrome op Android → menu (⋮) → "App installeren" / "Toevoegen aan startscherm". De app krijgt een eigen icoon, opent zonder browserbalk en werkt offline.

**Optie 2 — een echt .apk-bestand:**
Ga naar [pwabuilder.com](https://www.pwabuilder.com), plak de URL hierboven in, en klik op "Package for stores" → Android. Dat genereert een installeerbaar/sideload-baar .apk (of .aab voor de Play Store) op basis van de PWA-instellingen hierboven. Nodig om het icoon/de kleuren/naam aan te passen? Dat staat allemaal in `manifest.json`.

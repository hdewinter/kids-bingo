# Kids Bingo

Digitale kinderbingo met plaatjes (emoji) in plaats van getallen, gebaseerd op
de opzet van [Bingo 2.0](https://github.com/hdewinter/bingo-2.0): dezelfde
seeded kaartgeneratie, intypbare code en QR-check, maar dan met thema's
zoals Dieren, Boerderij, Ruimte of Sinterklaas.

Live: https://hdewinter.github.io/kids-bingo/

## Pagina's
- `index.html` — de trekker: kies een thema, trek plaatjes (los of automatisch), check kaarten
- `cards.html` — kaartgenerator: kies thema + formaat (3x3 / 4x4 / 5x5), genereer/print kaarten, digitale kaart met tik-om-te-markeren
- `scan.html` — los check-toestel: scan de trekking-QR + kaart-QR's met de camera, of typ een code in

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
- `id` van het thema (de sleutel, bv. `mijnthema`) nooit meer wijzigen zodra
  er kaarten mee geprint zijn — die staat namelijk in de code op de kaart
  (bv. `MIJNTHEMA-KIDS4-...`). Items zelf mag je wel aanpassen/toevoegen; de
  QR-code op een kaart blijft altijd werken (die bevat de kaart zelf), maar
  een oude *intypcode* kan na zo'n wijziging een andere kaart teruggeven.
- Bewaar de wijziging via de GitHub-webinterface (bewerk `bingo-kids-common.js`
  direct in de browser, of upload een nieuwe versie) en commit — GitHub Pages
  publiceert automatisch.

Wil je liever eigen tekeningen/afbeeldingen in plaats van emoji? Dat kan ook,
maar dat vraagt een kleine aanpassing van de kaart-rendering (een `src`
per item i.p.v. een emoji-teken) — vraag dat gerust apart aan.

## Technisch
Volledig statisch (geen backend/database), net als Bingo 2.0:
- Seeded RNG (`mulberry32`) zodat een kaart altijd exact terug te
  berekenen is uit zijn korte code.
- QR-codes bevatten de kaart-inhoud zelf (niet alleen de seed), zodat
  scannen blijft werken ook als een thema later bewerkt wordt.
- Voortgang/markeringen worden lokaal opgeslagen (`localStorage`), niets
  wordt naar een server gestuurd.

# Afwegingstool Bouwtransport over Water

Online tool die helpt bepalen of bouwtransport over water geschikt is voor een specifiek RED Company-project. Werkt als stap-voor-stap vragenlijst met automatisch advies.

**Gemaakt door:** Storm Lodewijk · Hogeschool Rotterdam, Bouwkunde · RED Company · 2026

---

## Snel starten

### Vereisten
- Node.js 18+ (download van [nodejs.org](https://nodejs.org))
- Een teksteditor (VS Code aanbevolen)
- Een browser

### Installeren en draaien

```bash
# 1. Open een terminal in deze map
cd afwegingstool-water

# 2. Installeer dependencies (eenmalig)
npm install

# 3. Start de development-server
npm run dev

# 4. Open in browser: http://localhost:5173
```

### Bouwen voor productie

```bash
npm run build
# Resultaat staat in: dist/
# Deze map kan op elke statische host (Render, Netlify, Vercel, GitHub Pages)
```

---

## Project structuur

```
src/
├── lib/         → Logica (score, materialen, kentallen)
├── types/       → TypeScript types
└── components/  → Visuele componenten
    └── steps/   → De 6 schermen van het formulier
```

Zie [PLAN.md](PLAN.md) voor de volledige architectuur en achtergrond.

---

## Online zetten via Render (gratis)

1. Push deze code naar een GitHub-repository
2. Maak account op [render.com](https://render.com) (gratis)
3. Klik "New" → "Static Site" → verbind je GitHub-repo
4. Render leest automatisch `render.yaml` en bouwt de site
5. Klaar! Je site staat op `https://<projectnaam>.onrender.com`

Elke push naar `main` triggert een nieuwe deploy.

---

## Hoe werkt de scoring?

De scoring is 1-op-1 vertaald uit het Excel-afwegingskader v4. Per materiaalstroom worden 8 criteria gecheckt:

| + | Criterium |
|---|---|
| +30 | CO₂-uitstoot water lager dan weg |
| +20 | Volume > 500 ton |
| +15 | Soortelijk gewicht > 1000 kg/m³ |
| +15 | Leverancier ligt aan water |
| +10 | Lage kwetsbaarheid (≤ 2) |
| +10 | Hoge stuwbaarheid (≥ 4) |
| −10 | Lange doorlooptijd (> 300 dagen) |
| −10 | Korte afstand én niet aan water |

**Adviesdrempels:**
- ≥ 70 → 🟢 Kansrijk
- 40-69 → 🟡 Voorwaardelijk kansrijk
- < 40 → 🔴 Niet kansrijk

De volledige logica staat in [`src/lib/scoring.ts`](src/lib/scoring.ts).

---

## Materialen-database uitbreiden

Open [`src/lib/materials.ts`](src/lib/materials.ts) en voeg een item toe aan de array:

```typescript
{
  id: 'nieuw-materiaal',
  naam: 'Naam materiaal',
  categorie: 'Constructie',
  gemiddeldGewicht: 500,
  kwetsbaarheid: 2,
  stuwbaarheid: 4,
  geschiktVoorWater: true,
  aandachtspunten: 'Wat moet je weten bij laden/lossen?'
}
```

Push naar GitHub en Render deployt automatisch met het nieuwe materiaal.

---

## Roadmap

Zie [PLAN.md sectie 11](PLAN.md#11-roadmap) voor de volledige roadmap.

**Volgende stappen (V1.x):**
- Materialen-database uitbreiden met 50+ items
- Designtuning op basis van RED-feedback
- Kaart verfijnen met automatische detectie van dichtstbijzijnde vaarweg

**Vervolgversies (V2.x):**
- Backend + database voor projectopslag
- Login voor RED Company-gebruikers
- API-koppeling met Rijkswaterstaat NWB

---

## Licentie

Eigendom van RED Company. Gebruik buiten RED in overleg.

## Contact

Storm Lodewijk · storm@red-company.nl

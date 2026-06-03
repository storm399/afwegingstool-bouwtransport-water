# Afwegingstool Bouwtransport over Water — Online versie

**Plan en architectuur voor de online tool**
Storm Lodewijk · RED Company · 2026

---

## 1. Doel

Van de Excel-afwegingskader-v4 een online webtool maken die elke RED-projectmanager (of externe gebruiker) in 10 minuten kan gebruiken op een laptop of tablet — zonder Excel-kennis. De inhoudelijke logica blijft 1-op-1 hetzelfde als in de Excel. Alleen de gebruikersinterface verandert.

## 2. Waarom een online tool boven Excel

| Excel | Online tool |
|---|---|
| Bestand mailen heen-en-weer | Eén URL die altijd actueel is |
| Versies raken vermengd | Eén bron van waarheid |
| Drempel hoog voor niet-Excel-gebruikers | Stap-voor-stap formulier, ook op mobiel |
| Geen geo-koppeling | Locatie op kaart → automatische afstand-tot-water check |
| Export naar Word/PDF kost werk | Eén knop "Download adviesrapport" |
| Materialen-database moeilijk uit te breiden | JSON-bestand dat iedereen kan aanvullen |

## 3. Architectuur — keuzes voor MVP

### 3.1 Tech stack
| Laag | Keuze | Waarom |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Modern, snel, makkelijk te onderhouden; TypeScript voorkomt domme bugs |
| **Styling** | Tailwind CSS | Direct schrijven van utility classes, conform RED huisstijl |
| **Kaart** | Leaflet + OpenStreetMap | Gratis, geen API-key nodig, voldoende voor MVP. Optie: later upgraden naar Mapbox |
| **Geocoding** | OpenStreetMap Nominatim | Adres → coordinaten, gratis |
| **State** | React useState/useReducer | Geen externe state-library nodig voor MVP |
| **PDF-export** | jsPDF + html2canvas | Werkt volledig in browser, geen backend nodig |
| **Hosting** | Render (Static Site, gratis) | Auto-deploy vanaf GitHub, custom domain mogelijk |
| **Versiebeheer** | GitHub | Standaard; werkt naadloos met Render |
| **Backend** | Géén in MVP | Alle logica draait in browser; geen database nodig zolang geen multi-user opslag |

### 3.2 Waarom géén backend in MVP
- Alle score-berekeningen zijn pure functies → kunnen in JavaScript
- Geen gebruikersaccounts in eerste versie → geen database nodig
- Lokale opslag (localStorage) is voldoende voor "concept opslaan"
- Spaart hosting-kosten en onderhoud

### 3.3 Later toevoegen (V2)
- **Backend** (Node.js + Express OF Python FastAPI) voor:
  - Opslaan van projecten in database (PostgreSQL)
  - Authenticatie (RED Company SSO)
  - Audit-trail (wie heeft welk advies gemaakt)
- **API-koppeling Rijkswaterstaat NWB** (Nationaal Wegen Bestand) voor exacte vaarwegclassificatie per locatie
- **Multi-user** met rollen (manager, viewer, admin)

## 4. User flow

```
┌──────────┐   ┌────────────┐   ┌──────────┐   ┌─────────┐   ┌──────────┐   ┌─────────┐
│ Welkom + │ → │ Projectinfo│ → │ Locatie  │ → │ Materi- │ → │ Keten-   │ → │ Advies  │
│ uitleg   │   │ (naam,fase)│   │ op kaart │   │ aalstrm │   │ inrichtg │   │ rapport │
└──────────┘   └────────────┘   └──────────┘   └─────────┘   └──────────┘   └─────────┘
                                                                                  │
                                                                                  ▼
                                                                             PDF download
```

**Tijdsindicatie per stap:**
1. Welkom — 30 sec lezen
2. Projectinfo — 1 min invullen
3. Locatie — 1 min op kaart klikken
4. Materiaalstromen — 3-5 min (1 rij per stroom, uit lijst kiezen)
5. Keteninrichting — 2 min
6. Advies bekijken — 2 min
**Totaal: ~10 min**

## 5. Componenten — bestandsstructuur

```
afwegingstool-water/
├── README.md                   # Setup + run instructies
├── PLAN.md                     # Dit document
├── package.json                # NPM dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite build config
├── tailwind.config.js          # Tailwind config (RED huisstijl)
├── postcss.config.js           # PostCSS config
├── index.html                  # HTML entry point
├── render.yaml                 # Render deployment config
├── .gitignore                  # Files niet in Git
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Hoofdcomponent met routing
    ├── index.css               # Tailwind + custom styles
    │
    ├── types/
    │   └── index.ts            # TypeScript types (Project, Stream, Score)
    │
    ├── lib/
    │   ├── scoring.ts          # Score-logica (1:1 met Excel)
    │   ├── materials.ts        # Database van bouwmaterialen
    │   ├── kentallen.ts        # CO₂- en kostenkentallen TNO
    │   └── pdf.ts              # PDF-export logica
    │
    └── components/
        ├── Layout.tsx          # Header + footer + container
        ├── ProgressBar.tsx     # Stap-indicator
        ├── ScoreCard.tsx       # Score-tile (groen/oranje/rood)
        ├── MapPicker.tsx       # Leaflet kaartje
        │
        └── steps/
            ├── Welcome.tsx
            ├── ProjectInfo.tsx
            ├── LocationPicker.tsx
            ├── Streams.tsx
            ├── ChainConfig.tsx
            └── AdviceReport.tsx
```

## 6. Score-logica — 1:1 vertaling Excel → JavaScript

De score per materiaalstroom is identiek aan tab 2 van de Excel:

| Criterium | Excel-formule | JS-equivalent |
|---|---|---|
| +30 CO₂-winst | `=IF(J>K,30,0)` | `if (co2Weg > co2Water) score += 30` |
| +20 volume | `=IF(C>500,20,0)` | `if (volume > 500) score += 20` |
| +15 soortelijk gewicht | `=IF(D>1000,15,0)` | `if (sg > 1000) score += 15` |
| +15 leverancier aan water | `=IF(H="Ja",15,0)` | `if (levAanWater) score += 15` |
| +10 lage kwetsbaarheid | `=IF(F<=2,10,0)` | `if (kwetsbaarheid <= 2) score += 10` |
| +10 hoge stuwbaarheid | `=IF(G>=4,10,0)` | `if (stuwbaarheid >= 4) score += 10` |
| −10 lange doorlooptijd | `=−IF(E>300,10,0)` | `if (doorlooptijd > 300) score -= 10` |
| −10 korte afstand zonder water | `=−IF(AND(I<200,H="Nee"),10,0)` | `if (afstand < 200 && !levAanWater) score -= 10` |

**Adviesdrempels:**
- ≥ 70 → "Kansrijk" (groen)
- 40-69 → "Voorwaardelijk kansrijk" (oranje)
- < 40 → "Niet kansrijk" (rood)

## 7. Materialen-database

Een JSON-bestand `materials.json` met ~25 voorgedefinieerde materialen, elk met:

```json
{
  "id": "clt",
  "naam": "CLT-elementen (kruislaaghout)",
  "categorie": "Constructie",
  "gemiddeldGewicht": 500,
  "kwetsbaarheid": 2,
  "stuwbaarheid": 4,
  "geschiktVoorWater": true,
  "aandachtspunten": "Bescherm tegen vocht; stapelen op droge ondergrond; gebruik onderlatten.",
  "co2FactorKgPerTonKm": 0.062
}
```

Gebruiker selecteert het materiaal uit een dropdown en de tool vult automatisch de bekende eigenschappen in. Gebruiker kan ze nog overschrijven als project afwijkt.

**Lijst voor MVP (gebaseerd op de Excel + scriptie §4):**

| Categorie | Materialen |
|---|---|
| Constructie | CLT-elementen, prefab betonwanden, staalkolommen, wapeningsstaal, prefab betonnen trappen |
| Buitenwanden | Aluminium gevels, steenstrip, natuursteen, geveldelen hout |
| Binnenwanden | FAAY Volpanelen, gips |
| Installaties | Leidingen, PV-panelen, WTW-units, verdeelkasten |
| Sloop/grond | Sloopafval, grond (afvoer), puin |
| Bulk | Zand, beton in zakken |

## 8. Locatie-functionaliteit

### 8.1 In MVP (Leaflet + OSM)
1. Gebruiker typt adres → Nominatim API geeft coördinaten
2. Marker verschijnt op de kaart
3. Gebruiker kan marker verslepen voor exacte locatie bouwplaats
4. Tool toont kaart met alle nabijgelegen waterwegen (uit OSM-data)
5. Gebruiker klikt op water → tool berekent hemelsbrede afstand
6. Resultaat: "Afstand tot dichtstbijzijnde vaarweg: X m"

### 8.2 V2 (Rijkswaterstaat + Overpass API)
- Automatische detectie dichtstbijzijnde CEMT-klasse vaarweg
- Filter alleen op "geschikt voor commerciële binnenvaart" (≥ klasse III)
- Suggestie van overslaglocaties uit POA-database

## 9. PDF-export

Eén klop "Download adviesrapport" → PDF met:
- Projectinfo + locatie + datum
- Tabel met alle materiaalstromen + scores + advies
- Algemeen advies (kansrijk / voorwaardelijk / niet kansrijk)
- Aandachtspunten per stroom
- RED Company huisstijl (bordeauxrode header)

## 10. Deployment via GitHub + Render

### 10.1 Stappen (eenmalig)
1. Maak nieuw GitHub-repo: `red-company/afwegingstool-water`
2. Push deze code naar `main` branch
3. Op render.com → "New Static Site" → connect GitHub repo
4. Render leest `render.yaml` → automatisch:
   - Build command: `npm install && npm run build`
   - Publish dir: `dist`
5. URL: `https://afwegingstool-water.onrender.com`
6. Custom domain optie: `afwegingstool.redcompany.nl`

### 10.2 Bij wijzigingen
1. Push naar GitHub `main` → Render bouwt + deployt automatisch (~2 min)
2. Preview URL voor pull requests aan: `pullRequestPreviewsEnabled: true`

### 10.3 Kosten
- **GitHub:** gratis voor publieke repo, ook gratis privé voor kleine teams
- **Render Static Site:** gratis (100 GB bandwidth/maand)
- **Domeinnaam (optioneel):** ~€10-15/jaar
- **Mapbox key (optioneel V2):** gratis tot 50.000 verzoeken/maand
- **Totale kosten MVP:** € 0,-

## 11. Roadmap

| Fase | Tijd | Inhoud |
|---|---|---|
| **MVP** | nu | Werkende tool, alle 7 stappen, score-logica, PDF, deployed |
| **V1.1** | week 1-2 na MVP | Materialen-database uitbreiden, designtuning, eerste feedback van RED |
| **V1.2** | week 3-4 | Kaart-functionaliteit verfijnen, auto-detectie vaarweg |
| **V2.0** | maand 2-3 | Backend + database, opslaan projecten, multi-user, login |
| **V2.1** | maand 4 | Koppeling Rijkswaterstaat NWB voor vaarwegen |
| **V2.2** | maand 5 | API-koppeling RED projectsysteem (zo aanwezig) |

## 12. Wat is af in deze eerste opzet

✅ Volledige projectstructuur opgezet
✅ Werkende React + TS + Tailwind app
✅ Score-logica 1:1 uit Excel
✅ Materialen-database met 20+ items
✅ Multi-step formulier met progress bar
✅ Leaflet kaart-component (basis)
✅ Adviesrapport met scores + kleurcodering
✅ PDF-export functie
✅ render.yaml voor 1-klik deployment
✅ README met setup-instructies

## 13. Wat moet jij nog doen

1. **Lokaal testen:** `cd afwegingstool-water && npm install && npm run dev`
2. **GitHub repo aanmaken:** push deze map
3. **Render account aanmaken** (gratis) en repo koppelen
4. **Eerste deploy testen:** automatisch via Render
5. **Feedback verzamelen** bij RED Company en in scriptie als beroepsproduct-uitbreiding benoemen
6. **Materialen-database uitbreiden** met meer items uit projecten
7. **(Optioneel)** Mapbox-key aanmaken voor mooiere kaart
8. **(Optioneel)** Custom domeinnaam koppelen aan Render

---

*Volgende secties: complete code in repo. Open README.md voor setup-instructies.*

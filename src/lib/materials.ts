// Materialen-database — uitbreidbaar
// Gebaseerd op Excel-afwegingskader v4 + scriptie §4.1.3 + §4.2.2
//
// Om een materiaal toe te voegen: voeg een object toe aan MATERIALS.
// Velden zijn TypeScript-getypt (zie ../types/index.ts).

import type { MaterialDef } from '../types';

export const MATERIAL_CATEGORIES = [
  'Constructie',
  'Buitenwanden',
  'Binnenwanden',
  'Installaties',
  'Sloop & grond',
  'Bulk',
  'Overig',
] as const;

export const MATERIALS: MaterialDef[] = [
  // ===== CONSTRUCTIE =====
  {
    id: 'clt',
    naam: 'CLT-elementen (kruislaaghout)',
    categorie: 'Constructie',
    gemiddeldGewichtKgPerM3: 500,
    kwetsbaarheid: 2,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Bescherm tegen vocht; stapelen op droge ondergrond met onderlatten; afdekken met zeil tijdens vaart.',
  },
  {
    id: 'prefab-beton-wand',
    naam: 'Prefab betonwanden',
    categorie: 'Constructie',
    gemiddeldGewichtKgPerM3: 2400,
    kwetsbaarheid: 2,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Zwaar — vereist hijscapaciteit ≥ 8 ton. Goed te bundelen per project.',
  },
  {
    id: 'prefab-beton-vloer',
    naam: 'Prefab betonvloeren / kanaalplaten',
    categorie: 'Constructie',
    gemiddeldGewichtKgPerM3: 2400,
    kwetsbaarheid: 2,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Uitstekend stapelbaar; ideaal voor watertransport bij grote volumes.',
  },
  {
    id: 'prefab-beton-trap',
    naam: 'Prefab betonnen trappen',
    categorie: 'Constructie',
    gemiddeldGewichtKgPerM3: 2400,
    kwetsbaarheid: 3,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Beschermen tegen stoten; voorzichtig hijsen aan voorgemaakte hijsogen.',
  },
  {
    id: 'staalkolommen',
    naam: 'Staalkolommen / staalprofielen',
    categorie: 'Constructie',
    gemiddeldGewichtKgPerM3: 7850,
    kwetsbaarheid: 1,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Hoog soortelijk gewicht ideaal voor water; goed op pallets te bundelen.',
  },
  {
    id: 'wapeningsstaal',
    naam: 'Wapeningsstaal',
    categorie: 'Constructie',
    gemiddeldGewichtKgPerM3: 7800,
    kwetsbaarheid: 2,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Lange staven; geschikt voor binnenvaart bij hub-en-spoke.',
  },

  // ===== BUITENWANDEN =====
  {
    id: 'aluminium-gevel',
    naam: 'Aluminium gevelelementen',
    categorie: 'Buitenwanden',
    gemiddeldGewichtKgPerM3: 200,
    kwetsbaarheid: 4,
    stuwbaarheid: 3,
    geschiktVoorWaterDefault: false,
    aandachtspunten: 'Kwetsbaar voor krassen en deuken; vereist beschermd transport. Vaak duurder via water vanwege handling.',
  },
  {
    id: 'steenstrip-gevel',
    naam: 'Steenstripgevels',
    categorie: 'Buitenwanden',
    gemiddeldGewichtKgPerM3: 1800,
    kwetsbaarheid: 3,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Stapelbaar in panelen; goede match voor water bij voldoende volume.',
  },
  {
    id: 'natuursteen-gevel',
    naam: 'Natuursteen gevelpanelen',
    categorie: 'Buitenwanden',
    gemiddeldGewichtKgPerM3: 2700,
    kwetsbaarheid: 4,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Hoog gewicht — water voordelig. Bescherm tegen stoten; gebruik beschermfolie.',
  },
  {
    id: 'houten-geveldelen',
    naam: 'Houten geveldelen',
    categorie: 'Buitenwanden',
    gemiddeldGewichtKgPerM3: 600,
    kwetsbaarheid: 3,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Vocht-gevoelig; gebruik luchtdichte verpakking en afdekken.',
  },

  // ===== BINNENWANDEN =====
  {
    id: 'faay-volpanelen',
    naam: 'FAAY Volpanelen (binnenwanden)',
    categorie: 'Binnenwanden',
    gemiddeldGewichtKgPerM3: 800,
    kwetsbaarheid: 2,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Uitstekend stapelbaar; standaardafmetingen passen goed in binnenvaartlading.',
  },
  {
    id: 'gips-platen',
    naam: 'Gipsplaten',
    categorie: 'Binnenwanden',
    gemiddeldGewichtKgPerM3: 850,
    kwetsbaarheid: 3,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Op pallet leveren; bescherm hoeken.',
  },

  // ===== INSTALLATIES =====
  {
    id: 'leidingen',
    naam: 'Leidingmateriaal (sanitair, verwarming)',
    categorie: 'Installaties',
    gemiddeldGewichtKgPerM3: 400,
    kwetsbaarheid: 2,
    stuwbaarheid: 3,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Goed in bundels of containers te leveren; geschikt voor consolidatie.',
  },
  {
    id: 'pv-panelen',
    naam: 'PV-panelen (zonnepanelen)',
    categorie: 'Installaties',
    gemiddeldGewichtKgPerM3: 250,
    kwetsbaarheid: 5,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: false,
    aandachtspunten: 'Zeer kwetsbaar; vereist verpakte container. Watertransport vaak duurder per stuk.',
  },
  {
    id: 'wtw-units',
    naam: 'WTW-units / mechanische ventilatie',
    categorie: 'Installaties',
    gemiddeldGewichtKgPerM3: 200,
    kwetsbaarheid: 4,
    stuwbaarheid: 3,
    geschiktVoorWaterDefault: false,
    aandachtspunten: 'Klein volume per project; vaak rechtstreeks per vrachtwagen efficiënter.',
  },
  {
    id: 'verdeelkasten',
    naam: 'Verdeelkasten / meterkasten',
    categorie: 'Installaties',
    gemiddeldGewichtKgPerM3: 300,
    kwetsbaarheid: 4,
    stuwbaarheid: 3,
    geschiktVoorWaterDefault: false,
    aandachtspunten: 'Per project klein aantal; bundelen met andere installatiematerialen kan haalbaar zijn.',
  },

  // ===== SLOOP & GROND =====
  {
    id: 'sloopafval',
    naam: 'Sloopafval / puin',
    categorie: 'Sloop & grond',
    gemiddeldGewichtKgPerM3: 1800,
    kwetsbaarheid: 1,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Bulkstroom — ideaal voor water bij directe kade. Bevochtigen tegen stof.',
  },
  {
    id: 'grond-afvoer',
    naam: 'Grond (afvoer)',
    categorie: 'Sloop & grond',
    gemiddeldGewichtKgPerM3: 1700,
    kwetsbaarheid: 1,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Ideaal voor binnenvaart; controleer milieuhygiënische klasse vóór transport.',
  },
  {
    id: 'asbesthoudend-puin',
    naam: 'Asbesthoudend sloopmateriaal',
    categorie: 'Sloop & grond',
    gemiddeldGewichtKgPerM3: 1800,
    kwetsbaarheid: 3,
    stuwbaarheid: 4,
    geschiktVoorWaterDefault: false,
    aandachtspunten: 'Vereist speciale vergunning + verzegelde container; meestal niet via water.',
  },

  // ===== BULK =====
  {
    id: 'zand',
    naam: 'Zand',
    categorie: 'Bulk',
    gemiddeldGewichtKgPerM3: 1500,
    kwetsbaarheid: 1,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Klassieke binnenvaartstroom; standaard bij grond- en weginrichting.',
  },
  {
    id: 'beton-stort',
    naam: 'Beton (in zakken of stort)',
    categorie: 'Bulk',
    gemiddeldGewichtKgPerM3: 2400,
    kwetsbaarheid: 1,
    stuwbaarheid: 5,
    geschiktVoorWaterDefault: true,
    aandachtspunten: 'Verswerking vereist Just-in-Time; alleen via water bij dagelijkse stort vanuit hub.',
  },
  {
    id: 'isolatiemateriaal',
    naam: 'Isolatiemateriaal',
    categorie: 'Bulk',
    gemiddeldGewichtKgPerM3: 50,
    kwetsbaarheid: 3,
    stuwbaarheid: 2,
    geschiktVoorWaterDefault: false,
    aandachtspunten: 'Laag soortelijk gewicht — niet kostenefficiënt per kuub voor water.',
  },
];

// Hulpfunctie om materiaal op id op te zoeken
export function findMaterial(id: string): MaterialDef | undefined {
  return MATERIALS.find(m => m.id === id);
}

// Hulpfunctie: groepeer materialen per categorie
export function materialsByCategory(): Record<string, MaterialDef[]> {
  const result: Record<string, MaterialDef[]> = {};
  for (const cat of MATERIAL_CATEGORIES) {
    result[cat] = MATERIALS.filter(m => m.categorie === cat);
  }
  return result;
}

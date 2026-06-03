// Centrale kentallen — 1:1 overgenomen uit Excel-afwegingskader v4, tab 4
// Bron: TNO 2023, Logistic Navigators 2024, PK Waterbouw 2025

export const KENTALLEN = {
  // CO₂-emissies
  co2WegKgPerTonKm: 0.062,        // Euro VI vrachtwagen
  co2WaterKgPerTonKm: 0.022,      // Stage V / elektrisch binnenvaart
  co2WaterCcrOudKgPerTonKm: 0.048,

  // Kosten
  kostenWegEuroPerTonKm: 0.10,
  kostenWaterEuroPerTonKm: 0.08,
  minimumKostenWegPerTon: 7,
  minimumKostenWaterPerTon: 5,

  // Boetes
  extraKmAlsNietAanWater: 10,     // km wegtransport extra naar overslag
  boeteKostenAlsNietAanWater: 2.5, // € per ton

  // Score-drempels (afgestemd in validatiesessie RED 2026)
  drempelKansrijk: 70,
  drempelVoorwaardelijk: 40,

  // Score-bonussen / penalties
  bonusCo2Winst: 30,
  bonusVolumeGroot: 20,            // > 500 ton
  bonusSoortelijkGewichtHoog: 15,  // > 1000 kg/m³
  bonusLeverancierAanWater: 15,
  bonusLageKwetsbaarheid: 10,      // ≤ 2
  bonusHogeStuwbaarheid: 10,       // ≥ 4
  penaltyLangeDoorlooptijd: 10,    // > 300 dagen
  penaltyKorteAfstandZonderWater: 10, // < 200 km & niet aan water

  // Volumedrempels
  drempelGrootVolumeTon: 500,
  drempelHoogSoortelijkGewicht: 1000,
  drempelKorteAfstandKm: 200,
  drempelLangeDoorlooptijdDagen: 300,
} as const;

// Bronnen-overzicht voor in adviesrapport
export const BRONNEN = [
  { label: 'TNO Amsterdam Vaart! eindrapportage (2023)', auteur: 'TNO' },
  { label: 'Logistic Navigators (2024) — Codrico verkenning', auteur: 'Logistic Navigators' },
  { label: 'PK Waterbouw (2025) — offerte Havenstraat', auteur: 'PK Waterbouw' },
  { label: 'Verlinde et al. (2022) — Brussels BCCC', auteur: 'VUB' },
  { label: 'Vrijhoef et al. (2018) — pilots stedelijke bouwlogistiek', auteur: 'Vrijhoef et al.' },
] as const;

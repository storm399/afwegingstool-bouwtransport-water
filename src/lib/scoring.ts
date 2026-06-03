// Score-logica — 1:1 vertaling van Excel-afwegingskader v4, tab 2.
// Iedere wijziging hier moet ook in de Excel-bron worden doorgevoerd.

import { KENTALLEN } from './kentallen';
import type {
  MaterialStream,
  StreamScore,
  AdviesNiveau,
  ProjectAdvies,
  Projectinfo,
  Locatie,
  KeteninrichtingInput,
} from '../types';

/**
 * Berekent CO₂-uitstoot per modaliteit voor een stroom.
 * - weg: volume × afstand × 0.062
 * - water: volume × afstand × 0.022, plus 10km wegtransport-boete als leverancier niet aan water
 */
function berekenCo2(stream: MaterialStream): { weg: number; water: number } {
  const weg = stream.volumeTon * stream.afstandLeverancierKm * KENTALLEN.co2WegKgPerTonKm;

  let water = stream.volumeTon * stream.afstandLeverancierKm * KENTALLEN.co2WaterKgPerTonKm;
  if (!stream.leverancierAanWater) {
    water += stream.volumeTon * KENTALLEN.extraKmAlsNietAanWater * KENTALLEN.co2WegKgPerTonKm;
  }

  return { weg, water };
}

/**
 * Berekent kosten per ton per modaliteit (minimumtarieven gewaarborgd).
 */
function berekenKosten(stream: MaterialStream): { weg: number; water: number } {
  const weg = Math.max(
    KENTALLEN.minimumKostenWegPerTon,
    stream.afstandLeverancierKm * KENTALLEN.kostenWegEuroPerTonKm,
  );

  let water = Math.max(
    KENTALLEN.minimumKostenWaterPerTon,
    stream.afstandLeverancierKm * KENTALLEN.kostenWaterEuroPerTonKm,
  );
  if (!stream.leverancierAanWater) water += KENTALLEN.boeteKostenAlsNietAanWater;

  return { weg, water };
}

/**
 * Score-formule per stroom (0-100).
 * Gebruikt exact dezelfde criteria als de Excel.
 */
export function scoreStream(stream: MaterialStream): StreamScore {
  const co2 = berekenCo2(stream);
  const kosten = berekenKosten(stream);

  let score = 0;
  const positief: string[] = [];
  const negatief: string[] = [];

  // +30: CO₂-winst water t.o.v. weg
  if (co2.weg > co2.water) {
    score += KENTALLEN.bonusCo2Winst;
    positief.push(`CO₂ via water lager (${Math.round(co2.weg)} kg → ${Math.round(co2.water)} kg)`);
  } else {
    negatief.push(`CO₂ via water hoger dan via weg`);
  }

  // +20: groot volume
  if (stream.volumeTon > KENTALLEN.drempelGrootVolumeTon) {
    score += KENTALLEN.bonusVolumeGroot;
    positief.push(`Groot volume (${stream.volumeTon} ton > ${KENTALLEN.drempelGrootVolumeTon} ton)`);
  } else {
    negatief.push(`Volume relatief klein (${stream.volumeTon} ton ≤ ${KENTALLEN.drempelGrootVolumeTon} ton)`);
  }

  // +15: hoog soortelijk gewicht
  if (stream.soortelijkGewicht > KENTALLEN.drempelHoogSoortelijkGewicht) {
    score += KENTALLEN.bonusSoortelijkGewichtHoog;
    positief.push(`Hoog soortelijk gewicht (${stream.soortelijkGewicht} kg/m³)`);
  }

  // +15: leverancier aan water
  if (stream.leverancierAanWater) {
    score += KENTALLEN.bonusLeverancierAanWater;
    positief.push('Leverancier ligt aan water (geen extra wegtransport)');
  } else {
    negatief.push('Leverancier ligt niet aan water — extra wegtransport nodig');
  }

  // +10: lage kwetsbaarheid
  if (stream.kwetsbaarheid <= 2) {
    score += KENTALLEN.bonusLageKwetsbaarheid;
    positief.push('Lage kwetsbaarheid');
  } else if (stream.kwetsbaarheid >= 4) {
    negatief.push('Hoge kwetsbaarheid (handling-risico)');
  }

  // +10: hoge stuwbaarheid
  if (stream.stuwbaarheid >= 4) {
    score += KENTALLEN.bonusHogeStuwbaarheid;
    positief.push('Goed stapelbaar / stuwbaar');
  }

  // −10: lange doorlooptijd
  if (stream.doorlooptijdDagen > KENTALLEN.drempelLangeDoorlooptijdDagen) {
    score -= KENTALLEN.penaltyLangeDoorlooptijd;
    negatief.push(`Lange doorlooptijd (${stream.doorlooptijdDagen} dagen) maakt planning lastig`);
  }

  // −10: korte afstand én niet aan water
  if (
    stream.afstandLeverancierKm < KENTALLEN.drempelKorteAfstandKm &&
    !stream.leverancierAanWater
  ) {
    score -= KENTALLEN.penaltyKorteAfstandZonderWater;
    negatief.push('Korte afstand wegtransport én leverancier niet aan water — water niet rendabel');
  }

  // Clip op 0-100
  score = Math.max(0, Math.min(100, score));

  // CO₂-besparing in procenten
  const co2Besparing = co2.weg > 0 ? Math.round(((co2.weg - co2.water) / co2.weg) * 100) : 0;

  return {
    streamId: stream.id,
    score: Math.round(score),
    advies: scoreToAdvies(score),
    co2WegKg: Math.round(co2.weg),
    co2WaterKg: Math.round(co2.water),
    co2BesparingPercentage: co2Besparing,
    kostenWegPerTon: Math.round(kosten.weg * 100) / 100,
    kostenWaterPerTon: Math.round(kosten.water * 100) / 100,
    positievePunten: positief,
    negatievePunten: negatief,
  };
}

/**
 * Vertaalt numerieke score naar adviesniveau.
 */
export function scoreToAdvies(score: number): AdviesNiveau {
  if (score >= KENTALLEN.drempelKansrijk) return 'kansrijk';
  if (score >= KENTALLEN.drempelVoorwaardelijk) return 'voorwaardelijk';
  return 'niet-kansrijk';
}

/**
 * Mapt adviesniveau naar Nederlandstalig label en kleur (voor UI).
 */
export function adviesLabel(advies: AdviesNiveau): { label: string; color: string; emoji: string } {
  switch (advies) {
    case 'kansrijk':
      return { label: 'Kansrijk', color: 'success', emoji: '🟢' };
    case 'voorwaardelijk':
      return { label: 'Voorwaardelijk kansrijk', color: 'warning', emoji: '🟡' };
    case 'niet-kansrijk':
      return { label: 'Niet kansrijk', color: 'danger', emoji: '🔴' };
  }
}

/**
 * Berekent het totaaladvies over alle stromen.
 * Totaalscore = gewogen gemiddelde op basis van volume (grote stromen wegen zwaarder).
 */
export function buildProjectAdvies(
  projectinfo: Projectinfo,
  locatie: Locatie,
  keteninrichting: KeteninrichtingInput,
  streams: MaterialStream[],
): ProjectAdvies {
  const scores = streams.map(scoreStream);

  // Gewogen gemiddelde op basis van volume
  const totaalVolume = streams.reduce((sum, s) => sum + s.volumeTon, 0);
  const gewogenScore = totaalVolume > 0
    ? streams.reduce((sum, s, i) => sum + s.volumeTon * scores[i].score, 0) / totaalVolume
    : 0;

  // Bonus voor goede keteninrichting (sterke regie zwaarder mee)
  let ketenBonus = 0;
  if (keteninrichting.regiekamer) ketenBonus += 2;
  if (keteninrichting.blvcBestek) ketenBonus += 2;
  if (keteninrichting.ticketsysteem) ketenBonus += 2;

  const totaalScore = Math.round(gewogenScore + ketenBonus);

  const totaalCo2WegKg = scores.reduce((sum, s) => sum + s.co2WegKg, 0);
  const totaalCo2WaterKg = scores.reduce((sum, s) => sum + s.co2WaterKg, 0);

  return {
    projectinfo,
    locatie,
    keteninrichting,
    streams,
    scores,
    totaalScore,
    totaalAdvies: scoreToAdvies(totaalScore),
    totaalCo2Besparing: totaalCo2WegKg - totaalCo2WaterKg,
    totaalKostenWeg: scores.reduce((sum, s, i) => sum + s.kostenWegPerTon * streams[i].volumeTon, 0),
    totaalKostenWater: scores.reduce((sum, s, i) => sum + s.kostenWaterPerTon * streams[i].volumeTon, 0),
    datumAdvies: new Date().toISOString().split('T')[0],
  };
}

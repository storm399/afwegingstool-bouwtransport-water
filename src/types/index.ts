// Centrale TypeScript types voor de afwegingstool

export type ProjectFase =
  | 'tender'
  | 'ontwerp'
  | 'inkoop'
  | 'uitvoering';

export type KetenConfig =
  | 'directe-overslag'
  | 'gedeelde-overslag'
  | 'bouwhub-op-afstand'
  | 'drijvende-voorraad';

export interface Projectinfo {
  naam: string;
  gemeente: string;
  fase: ProjectFase;
  eigenKade: boolean;
  zeZoneActief: boolean;
}

export interface Locatie {
  adres: string;
  lat: number;
  lon: number;
  afstandTotKadeMeter: number; // gebruiker schat in of meet
}

export interface KeteninrichtingInput {
  ketenConfig: KetenConfig;
  regiekamer: boolean;
  blvcBestek: boolean;
  ticketsysteem: boolean;
  drijvendeVoorraad: boolean;
}

export interface MaterialDef {
  id: string;
  naam: string;
  categorie: string;
  gemiddeldGewichtKgPerM3: number; // soortelijk gewicht
  kwetsbaarheid: 1 | 2 | 3 | 4 | 5; // 1=robust, 5=fragile
  stuwbaarheid: 1 | 2 | 3 | 4 | 5;  // 1=lastig, 5=goed stapelbaar
  geschiktVoorWaterDefault: boolean;
  aandachtspunten: string;
}

export interface MaterialStream {
  id: string;             // intern uniek
  materialId: string;     // verwijst naar MaterialDef.id (of 'custom')
  naam: string;
  volumeTon: number;
  soortelijkGewicht: number; // kg/m³
  doorlooptijdDagen: number;
  kwetsbaarheid: 1 | 2 | 3 | 4 | 5;
  stuwbaarheid: 1 | 2 | 3 | 4 | 5;
  leverancierAanWater: boolean;
  afstandLeverancierKm: number;
}

export type AdviesNiveau =
  | 'kansrijk'
  | 'voorwaardelijk'
  | 'niet-kansrijk';

export interface StreamScore {
  streamId: string;
  score: number;            // 0–100
  advies: AdviesNiveau;
  co2WegKg: number;
  co2WaterKg: number;
  co2BesparingPercentage: number; // negatief = water duurder
  kostenWegPerTon: number;
  kostenWaterPerTon: number;
  positievePunten: string[];
  negatievePunten: string[];
}

export interface ProjectAdvies {
  projectinfo: Projectinfo;
  locatie: Locatie;
  keteninrichting: KeteninrichtingInput;
  streams: MaterialStream[];
  scores: StreamScore[];
  totaalScore: number;        // gemiddelde van alle stream-scores
  totaalAdvies: AdviesNiveau;
  totaalCo2Besparing: number; // kg over alle stromen
  totaalKostenWeg: number;
  totaalKostenWater: number;
  datumAdvies: string;        // ISO datum
}

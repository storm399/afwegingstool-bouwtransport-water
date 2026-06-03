import { useMemo } from 'react';
import type {
  Projectinfo,
  Locatie,
  KeteninrichtingInput,
  MaterialStream,
} from '../../types';
import { buildProjectAdvies, adviesLabel } from '../../lib/scoring';
import { downloadAdviesAlsPdf, downloadAdviesAlsJson } from '../../lib/pdf';
import ScoreCard from '../ScoreCard';

interface Props {
  projectinfo: Projectinfo;
  locatie: Locatie;
  keteninrichting: KeteninrichtingInput;
  streams: MaterialStream[];
  onPrev: () => void;
  onReset: () => void;
}

export default function AdviceReport({
  projectinfo,
  locatie,
  keteninrichting,
  streams,
  onPrev,
  onReset,
}: Props) {
  const advies = useMemo(
    () => buildProjectAdvies(projectinfo, locatie, keteninrichting, streams),
    [projectinfo, locatie, keteninrichting, streams],
  );

  const totaalLbl = adviesLabel(advies.totaalAdvies);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Het hele rapport zit in 1 div met id 'advies-rapport' voor PDF-export */}
      <div id="advies-rapport" className="space-y-6">

        {/* Header */}
        <div className="bg-bordeaux text-white rounded-lg p-6">
          <div className="text-xs uppercase tracking-widest text-cream/80 mb-1">
            Adviesrapport bouwtransport over water
          </div>
          <h2 className="font-head text-3xl font-bold text-white">
            {advies.projectinfo.naam || 'Project zonder naam'}
          </h2>
          <div className="text-sm text-cream/90 mt-1">
            {advies.projectinfo.gemeente && `${advies.projectinfo.gemeente} · `}
            Fase: {advies.projectinfo.fase} · Datum: {advies.datumAdvies}
          </div>
        </div>

        {/* Totaalscore + advies */}
        <div className="grid md:grid-cols-3 gap-4">
          <ScoreCard
            score={advies.totaalScore}
            advies={advies.totaalAdvies}
            titel="Totaalscore project"
            ondertitel="Gewogen gemiddelde + regie-bonus"
          />
          <div className="card">
            <div className="text-xs uppercase tracking-wider text-bordeaux font-bold">
              CO₂-besparing
            </div>
            <div className="text-3xl font-bold text-bordeaux mt-2">
              {Math.round(advies.totaalCo2Besparing).toLocaleString('nl-NL')} kg
            </div>
            <div className="text-sm text-slate-body mt-1">
              over alle stromen samen
            </div>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wider text-bordeaux font-bold">
              Kosten — weg vs water
            </div>
            <div className="text-xl font-bold text-bordeaux mt-2">
              €{Math.round(advies.totaalKostenWeg).toLocaleString('nl-NL')}
              {' → '}
              €{Math.round(advies.totaalKostenWater).toLocaleString('nl-NL')}
            </div>
            <div className="text-sm text-slate-body mt-1">
              indicatief, totaal voor alle stromen
            </div>
          </div>
        </div>

        {/* Hoofdadvies in zin */}
        <div className={`rounded-lg border-2 p-5 ${
          totaalLbl.color === 'success' ? 'bg-success-bg border-success-text/30' :
          totaalLbl.color === 'warning' ? 'bg-warning-bg border-warning-text/30' :
          'bg-danger-bg border-danger-text/30'
        }`}>
          <div className="text-sm font-bold uppercase tracking-wider text-bordeaux mb-1">
            Hoofdadvies
          </div>
          <p className="text-base text-ink">
            Op basis van de ingevulde gegevens is bouwtransport over water voor dit project{' '}
            <strong>{totaalLbl.label.toLowerCase()}</strong>. Dat resulteert in een totaalscore
            van <strong>{advies.totaalScore}/100</strong>. Hieronder zie je per materiaalstroom
            waar de winst zit en waar nog aandachtspunten liggen.
          </p>
        </div>

        {/* Stromen per item */}
        <div>
          <h3 className="font-head text-xl font-bold text-bordeaux mb-3">
            Advies per materiaalstroom
          </h3>
          <div className="space-y-3">
            {advies.streams.map((s, idx) => {
              const score = advies.scores[idx];
              const lbl = adviesLabel(score.advies);
              return (
                <div key={s.id} className="card">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-bordeaux font-bold">
                        Stroom {idx + 1}
                      </div>
                      <div className="font-head text-lg font-bold text-bordeaux">
                        {s.naam || 'Naamloze stroom'}
                      </div>
                      <div className="text-sm text-slate-body mt-0.5">
                        {s.volumeTon} ton · {s.afstandLeverancierKm} km · {s.doorlooptijdDagen} dagen doorlooptijd
                      </div>
                    </div>
                    <div className={`text-center px-4 py-2 rounded-md min-w-[120px] ${
                      lbl.color === 'success' ? 'bg-success-bg text-success-text' :
                      lbl.color === 'warning' ? 'bg-warning-bg text-warning-text' :
                      'bg-danger-bg text-danger-text'
                    }`}>
                      <div className="text-3xl font-bold">{score.score}</div>
                      <div className="text-xs font-semibold uppercase">{lbl.label}</div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                    <Stat label="CO₂ weg" value={`${score.co2WegKg.toLocaleString('nl-NL')} kg`} />
                    <Stat label="CO₂ water" value={`${score.co2WaterKg.toLocaleString('nl-NL')} kg`} />
                    <Stat
                      label="CO₂-besparing"
                      value={`${score.co2BesparingPercentage > 0 ? '+' : ''}${score.co2BesparingPercentage}%`}
                      good={score.co2BesparingPercentage > 0}
                    />
                    <Stat
                      label="Kosten (€/ton)"
                      value={`€${score.kostenWegPerTon.toFixed(2)} → €${score.kostenWaterPerTon.toFixed(2)}`}
                    />
                  </div>

                  {/* Positief / negatief */}
                  {(score.positievePunten.length > 0 || score.negatievePunten.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {score.positievePunten.length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-success-text mb-1">
                            ✓ Sterke punten
                          </div>
                          <ul className="text-sm space-y-1">
                            {score.positievePunten.map((p, i) => (
                              <li key={i} className="text-slate-body">+ {p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {score.negatievePunten.length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-danger-text mb-1">
                            ⚠ Aandachtspunten
                          </div>
                          <ul className="text-sm space-y-1">
                            {score.negatievePunten.map((n, i) => (
                              <li key={i} className="text-slate-body">– {n}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer rapport */}
        <div className="text-xs text-slate-body italic border-t border-cream pt-4">
          Dit advies is gegenereerd door de online versie van het afwegingskader v4
          (Storm Lodewijk · RED Company · Hogeschool Rotterdam, 2026). Onderliggende
          kentallen komen van TNO (2023), Logistic Navigators (2024), Verlinde et al.
          (2022) en eigen onderzoek bij Havenstraat en Codrico.
        </div>
      </div>

      {/* Knoppen (buiten PDF) */}
      <div className="flex flex-wrap justify-between gap-2 pt-2">
        <button onClick={onPrev} className="btn btn-ghost">← Terug bewerken</button>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => downloadAdviesAlsJson(advies)} className="btn btn-secondary">
            ↓ JSON
          </button>
          <button onClick={() => downloadAdviesAlsPdf(advies)} className="btn btn-primary">
            ↓ Download als PDF
          </button>
          <button onClick={onReset} className="btn btn-ghost">
            ↺ Nieuw advies
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="border-l-2 border-cream pl-3">
      <div className="text-xs text-slate-body uppercase tracking-wider">{label}</div>
      <div className={`font-semibold ${good ? 'text-success-text' : 'text-bordeaux'}`}>
        {value}
      </div>
    </div>
  );
}

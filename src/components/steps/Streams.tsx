import { useState } from 'react';
import type { MaterialStream } from '../../types';
import { MATERIALS, findMaterial, materialsByCategory } from '../../lib/materials';

interface Props {
  value: MaterialStream[];
  onChange: (v: MaterialStream[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

function emptyStream(materialId: string = ''): MaterialStream {
  const mat = findMaterial(materialId);
  return {
    id: 's_' + Math.random().toString(36).slice(2, 9),
    materialId: materialId || 'custom',
    naam: mat?.naam ?? '',
    volumeTon: 100,
    soortelijkGewicht: mat?.gemiddeldGewichtKgPerM3 ?? 1000,
    doorlooptijdDagen: 100,
    kwetsbaarheid: mat?.kwetsbaarheid ?? 3,
    stuwbaarheid: mat?.stuwbaarheid ?? 3,
    leverancierAanWater: mat?.geschiktVoorWaterDefault ?? false,
    afstandLeverancierKm: 100,
  };
}

export default function Streams({ value, onChange, onNext, onPrev }: Props) {
  const [showMatPicker, setShowMatPicker] = useState(false);

  const addStream = (materialId: string) => {
    onChange([...value, emptyStream(materialId)]);
    setShowMatPicker(false);
  };

  const removeStream = (id: string) => {
    onChange(value.filter(s => s.id !== id));
  };

  const updateStream = (id: string, patch: Partial<MaterialStream>) => {
    onChange(value.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const byCat = materialsByCategory();

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="font-head text-2xl font-bold text-bordeaux mb-1">Materiaalstromen</h2>
      <p className="text-sm text-slate-body italic mb-6">
        Voeg één rij per materiaalstroom toe. Kies een materiaal uit de lijst, of voeg een
        eigen stroom toe. Volume, kwetsbaarheid en stuwbaarheid kun je per project aanpassen.
      </p>

      {/* Lijst van toegevoegde stromen */}
      {value.length === 0 ? (
        <div className="text-center text-slate-body italic py-10 border-2 border-dashed border-cream-light rounded-lg">
          Nog geen stromen toegevoegd. Klik hieronder om je eerste stroom toe te voegen.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((s, idx) => (
            <StreamRow
              key={s.id}
              index={idx}
              stream={s}
              onUpdate={(patch) => updateStream(s.id, patch)}
              onRemove={() => removeStream(s.id)}
            />
          ))}
        </div>
      )}

      {/* Toevoegen */}
      <div className="mt-5">
        {!showMatPicker ? (
          <button
            onClick={() => setShowMatPicker(true)}
            className="btn btn-secondary w-full"
          >
            + Stroom toevoegen
          </button>
        ) : (
          <div className="border-2 border-bordeaux/20 rounded-lg p-4 bg-cream-light/30">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-bordeaux">Kies een materiaal</div>
              <button onClick={() => setShowMatPicker(false)} className="text-sm text-slate-body hover:text-bordeaux">
                ✕ Sluiten
              </button>
            </div>

            {Object.entries(byCat).map(([cat, mats]) => mats.length > 0 && (
              <div key={cat} className="mb-3">
                <div className="text-xs font-bold uppercase tracking-wider text-bordeaux mb-1">
                  {cat}
                </div>
                <div className="grid sm:grid-cols-2 gap-1">
                  {mats.map(m => (
                    <button
                      key={m.id}
                      onClick={() => addStream(m.id)}
                      className="text-left p-2 text-sm bg-white border border-cream rounded hover:bg-bordeaux/5 hover:border-bordeaux/30 transition"
                    >
                      {m.naam}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => addStream('')}
              className="w-full mt-2 p-2 text-sm bg-bordeaux/10 text-bordeaux border border-bordeaux/30 rounded hover:bg-bordeaux/20 transition"
            >
              + Eigen stroom (alles zelf invullen)
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onPrev} className="btn btn-ghost">← Terug</button>
        <button onClick={onNext} disabled={value.length === 0} className="btn btn-primary">
          Volgende: keteninrichting →
        </button>
      </div>
    </div>
  );
}

// ----- Sub-component: één rij -----
function StreamRow({
  index,
  stream,
  onUpdate,
  onRemove,
}: {
  index: number;
  stream: MaterialStream;
  onUpdate: (patch: Partial<MaterialStream>) => void;
  onRemove: () => void;
}) {
  const mat = findMaterial(stream.materialId);

  return (
    <div className="border border-cream rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-bordeaux">
            Stroom {index + 1} {mat && `· ${mat.categorie}`}
          </div>
          <input
            className="font-semibold text-bordeaux text-base bg-transparent border-b border-transparent hover:border-bordeaux/30 focus:border-bordeaux outline-none transition"
            value={stream.naam}
            onChange={(e) => onUpdate({ naam: e.target.value })}
            placeholder="Naam van deze stroom"
          />
        </div>
        <button
          onClick={onRemove}
          className="text-xs text-slate-body hover:text-bordeaux px-2 py-1 rounded hover:bg-cream-light"
        >
          ✕ Verwijderen
        </button>
      </div>

      {mat && (
        <div className="text-xs text-slate-body italic mb-3 bg-cream-light/50 p-2 rounded">
          💡 {mat.aandachtspunten}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Volume (ton)">
          <input type="number" className="input" min={0}
            value={stream.volumeTon}
            onChange={(e) => onUpdate({ volumeTon: Number(e.target.value) })}
          />
        </Field>
        <Field label="Soortelijk gewicht (kg/m³)">
          <input type="number" className="input" min={0}
            value={stream.soortelijkGewicht}
            onChange={(e) => onUpdate({ soortelijkGewicht: Number(e.target.value) })}
          />
        </Field>
        <Field label="Afstand leverancier (km)">
          <input type="number" className="input" min={0}
            value={stream.afstandLeverancierKm}
            onChange={(e) => onUpdate({ afstandLeverancierKm: Number(e.target.value) })}
          />
        </Field>
        <Field label="Doorlooptijd (dagen)">
          <input type="number" className="input" min={0}
            value={stream.doorlooptijdDagen}
            onChange={(e) => onUpdate({ doorlooptijdDagen: Number(e.target.value) })}
          />
        </Field>
        <Field label="Kwetsbaarheid (1-5)">
          <select className="select"
            value={stream.kwetsbaarheid}
            onChange={(e) => onUpdate({ kwetsbaarheid: Number(e.target.value) as any })}>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 && '(robust)'}{n === 5 && '(zeer kwetsbaar)'}</option>)}
          </select>
        </Field>
        <Field label="Stuwbaarheid (1-5)">
          <select className="select"
            value={stream.stuwbaarheid}
            onChange={(e) => onUpdate({ stuwbaarheid: Number(e.target.value) as any })}>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 && '(lastig)'}{n === 5 && '(uitstekend)'}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2 flex items-center">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              className="accent-bordeaux"
              checked={stream.leverancierAanWater}
              onChange={(e) => onUpdate({ leverancierAanWater: e.target.checked })}
            />
            <span className="text-bordeaux font-semibold">Leverancier ligt aan water</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-bordeaux/80 mb-1">{label}</label>
      {children}
    </div>
  );
}

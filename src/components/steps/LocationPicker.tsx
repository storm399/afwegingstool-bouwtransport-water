import { useState } from 'react';
import MapPicker, { geocodeAdres } from '../MapPicker';
import type { Locatie } from '../../types';

interface Props {
  value: Locatie;
  onChange: (v: Locatie) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function LocationPicker({ value, onChange, onNext, onPrev }: Props) {
  const [zoekTerm, setZoekTerm] = useState(value.adres);
  const [bezig, setBezig] = useState(false);

  const handleZoek = async () => {
    if (!zoekTerm.trim()) return;
    setBezig(true);
    const res = await geocodeAdres(zoekTerm);
    setBezig(false);
    if (res) {
      onChange({ ...value, adres: zoekTerm, lat: res.lat, lon: res.lon });
    } else {
      alert('Geen locatie gevonden voor: ' + zoekTerm);
    }
  };

  const handleMapClick = (lat: number, lon: number) => {
    onChange({ ...value, lat, lon });
  };

  return (
    <div className="card max-w-3xl mx-auto">
      <h2 className="font-head text-2xl font-bold text-bordeaux mb-1">Projectlocatie</h2>
      <p className="text-sm text-slate-body italic mb-6">
        Vul een adres in of klik direct op de kaart om de bouwplaats te markeren.
      </p>

      {/* Zoekbalk */}
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          placeholder="Bijv. Havenstraat 1, Amsterdam"
          value={zoekTerm}
          onChange={(e) => setZoekTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleZoek()}
        />
        <button
          onClick={handleZoek}
          disabled={bezig || !zoekTerm.trim()}
          className="btn btn-secondary"
        >
          {bezig ? 'Zoeken...' : 'Zoek op kaart'}
        </button>
      </div>

      {/* Kaart */}
      <MapPicker lat={value.lat} lon={value.lon} onLocationChange={handleMapClick} />

      <div className="text-xs text-slate-body mt-2 italic">
        Coördinaten: {value.lat.toFixed(5)}, {value.lon.toFixed(5)}
        {' · '}Klik op de kaart om de marker te verplaatsen.
      </div>

      {/* Afstand-veld */}
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="afstand">Afstand bouwplaats → kade (m)</label>
          <input
            id="afstand"
            type="number"
            className="input"
            value={value.afstandTotKadeMeter}
            min={0}
            onChange={(e) => onChange({ ...value, afstandTotKadeMeter: Number(e.target.value) })}
          />
          <div className="hint">
            Hemelsbrede afstand tot dichtstbijzijnde overslaglocatie. Vul 0 in bij eigen kade.
          </div>
        </div>
        <div className="bg-cream-light/60 border-l-4 border-bordeaux p-3 rounded-r-md text-sm text-slate-body">
          <strong className="text-bordeaux">Tip:</strong> in een volgende versie kan deze afstand
          automatisch worden berekend op basis van de dichtstbijzijnde CEMT-vaarweg
          (bron: Rijkswaterstaat NWB).
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onPrev} className="btn btn-ghost">← Terug</button>
        <button onClick={onNext} className="btn btn-primary">
          Volgende: materiaalstromen →
        </button>
      </div>
    </div>
  );
}

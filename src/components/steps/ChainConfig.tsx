import type { KeteninrichtingInput, KetenConfig } from '../../types';

interface Props {
  value: KeteninrichtingInput;
  onChange: (v: KeteninrichtingInput) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CONFIGS: { value: KetenConfig; label: string; uitleg: string }[] = [
  { value: 'directe-overslag',  label: 'Directe overslag',  uitleg: 'Eigen kade aan bouwplaats — schip lost direct.' },
  { value: 'gedeelde-overslag', label: 'Gedeelde overslag', uitleg: 'Tijdelijke overslag in het gebied, gedeeld met buurprojecten.' },
  { value: 'bouwhub-op-afstand',label: 'Bouwhub op afstand',uitleg: 'Vaste bouwhub elders (bv. City Dock); schip pendelt.' },
  { value: 'drijvende-voorraad',label: 'Drijvende voorraad',uitleg: 'Voorraad blijft op water bij kade.' },
];

const REGIEMET = [
  {
    key: 'regiekamer' as const,
    titel: 'Regiekamer / control tower',
    uitleg: 'Centrale aansturing van vrachtbewegingen.',
  },
  {
    key: 'blvcBestek' as const,
    titel: 'BLVC-bestek vastgelegd',
    uitleg: 'Bereikbaarheid, Leefbaarheid, Veiligheid, Communicatie in bestek.',
  },
  {
    key: 'ticketsysteem' as const,
    titel: 'Digitaal ticketsysteem',
    uitleg: 'Verplichte aanmelding per levering, geen ad-hoc vrachten.',
  },
  {
    key: 'drijvendeVoorraad' as const,
    titel: 'Drijvende voorraad gebruikt',
    uitleg: 'Bufferruimte op water tussen aanlevering en lossing.',
  },
];

export default function ChainConfig({ value, onChange, onNext, onPrev }: Props) {
  return (
    <div className="card max-w-3xl mx-auto">
      <h2 className="font-head text-2xl font-bold text-bordeaux mb-1">Keteninrichting</h2>
      <p className="text-sm text-slate-body italic mb-6">
        Hoe is de bouwlogistieke keten georganiseerd? Goede regie verbetert het advies.
      </p>

      <div>
        <label className="label">Type keteninrichting</label>
        <div className="grid md:grid-cols-2 gap-2">
          {CONFIGS.map((c) => {
            const checked = value.ketenConfig === c.value;
            return (
              <label
                key={c.value}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition ${
                  checked ? 'border-bordeaux bg-bordeaux/5' : 'border-cream hover:bg-cream-light'
                }`}
              >
                <input
                  type="radio"
                  className="mt-1 accent-bordeaux"
                  checked={checked}
                  onChange={() => onChange({ ...value, ketenConfig: c.value })}
                />
                <div>
                  <div className="font-semibold text-bordeaux text-sm">{c.label}</div>
                  <div className="text-xs text-slate-body">{c.uitleg}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label className="label">Regie-elementen aanwezig?</label>
        <div className="space-y-2">
          {REGIEMET.map((r) => (
            <label
              key={r.key}
              className="flex items-start gap-3 p-3 rounded-md border border-cream hover:bg-cream-light cursor-pointer"
            >
              <input
                type="checkbox"
                className="mt-1 accent-bordeaux"
                checked={value[r.key]}
                onChange={(e) => onChange({ ...value, [r.key]: e.target.checked })}
              />
              <div>
                <div className="font-semibold text-bordeaux text-sm">{r.titel}</div>
                <div className="text-xs text-slate-body">{r.uitleg}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-cream-light/60 border-l-4 border-bordeaux p-4 rounded-r-md text-sm text-slate-body">
        <strong className="text-bordeaux">Waarom dit telt:</strong> uit casussen Havenstraat
        en Codrico blijkt dat een goed georganiseerde keten (regie + BLVC + ticket) het
        verschil maakt tussen mislukken en slagen van watertransport. Daarom telt elk
        regie-element +2 punten in de totaalscore.
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onPrev} className="btn btn-ghost">← Terug</button>
        <button onClick={onNext} className="btn btn-primary">
          Bekijk advies →
        </button>
      </div>
    </div>
  );
}

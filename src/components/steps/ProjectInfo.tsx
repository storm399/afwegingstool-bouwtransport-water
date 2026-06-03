import type { Projectinfo, ProjectFase } from '../../types';

interface Props {
  value: Projectinfo;
  onChange: (v: Projectinfo) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FASES: { value: ProjectFase; label: string; uitleg: string }[] = [
  { value: 'tender',     label: 'Tenderfase',  uitleg: 'Aanbesteding nog niet gegund — veel ruimte voor logistieke keuzes.' },
  { value: 'ontwerp',    label: 'Ontwerpfase', uitleg: 'Architectuur en constructie worden uitgewerkt.' },
  { value: 'inkoop',     label: 'Inkoopfase',  uitleg: 'Leveranciers worden geselecteerd.' },
  { value: 'uitvoering', label: 'Uitvoering',  uitleg: 'Bouw is gegund of in uitvoering.' },
];

export default function ProjectInfo({ value, onChange, onNext, onPrev }: Props) {
  const valid = value.naam.trim().length > 0 && value.gemeente.trim().length > 0;

  return (
    <div className="card max-w-3xl mx-auto">
      <h2 className="font-head text-2xl font-bold text-bordeaux mb-1">Projectinformatie</h2>
      <p className="text-sm text-slate-body italic mb-6">
        Basisgegevens voor je project. Deze komen ook in het PDF-rapport.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="naam">Projectnaam *</label>
          <input
            id="naam"
            className="input"
            value={value.naam}
            onChange={(e) => onChange({ ...value, naam: e.target.value })}
            placeholder="Bijv. VrijHaven, Codrico, ..."
          />
        </div>
        <div>
          <label className="label" htmlFor="gemeente">Gemeente *</label>
          <input
            id="gemeente"
            className="input"
            value={value.gemeente}
            onChange={(e) => onChange({ ...value, gemeente: e.target.value })}
            placeholder="Bijv. Amsterdam, Rotterdam"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="label">Projectfase</label>
        <div className="grid md:grid-cols-2 gap-2">
          {FASES.map((f) => {
            const checked = value.fase === f.value;
            return (
              <label
                key={f.value}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition ${
                  checked ? 'border-bordeaux bg-bordeaux/5' : 'border-cream hover:bg-cream-light'
                }`}
              >
                <input
                  type="radio"
                  className="mt-1 accent-bordeaux"
                  checked={checked}
                  onChange={() => onChange({ ...value, fase: f.value })}
                />
                <div>
                  <div className="font-semibold text-bordeaux text-sm">{f.label}</div>
                  <div className="text-xs text-slate-body">{f.uitleg}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <label className="flex items-start gap-3 p-3 rounded-md border border-cream hover:bg-cream-light cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-bordeaux"
            checked={value.eigenKade}
            onChange={(e) => onChange({ ...value, eigenKade: e.target.checked })}
          />
          <div>
            <div className="font-semibold text-bordeaux text-sm">Eigen kade aanwezig?</div>
            <div className="text-xs text-slate-body">Heeft de bouwplaats een eigen kade?</div>
          </div>
        </label>
        <label className="flex items-start gap-3 p-3 rounded-md border border-cream hover:bg-cream-light cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-bordeaux"
            checked={value.zeZoneActief}
            onChange={(e) => onChange({ ...value, zeZoneActief: e.target.checked })}
          />
          <div>
            <div className="font-semibold text-bordeaux text-sm">Zero-emissiezone actief?</div>
            <div className="text-xs text-slate-body">Vrachtverkeer in een ZE-zone in de bouwperiode?</div>
          </div>
        </label>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onPrev} className="btn btn-ghost">← Terug</button>
        <button onClick={onNext} disabled={!valid} className="btn btn-primary">
          Volgende: locatie →
        </button>
      </div>
    </div>
  );
}

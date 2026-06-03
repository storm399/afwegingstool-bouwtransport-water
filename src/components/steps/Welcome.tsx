interface Props {
  onStart: () => void;
}

export default function Welcome({ onStart }: Props) {
  return (
    <div className="card max-w-3xl mx-auto">
      <h2 className="font-head text-2xl font-bold text-bordeaux mb-3">
        Welkom
      </h2>

      <p className="text-slate-body leading-relaxed">
        Deze tool helpt je beoordelen of <strong>bouwtransport over water</strong> geschikt is
        voor jouw project. Je vult stap voor stap projectinformatie in. Aan het einde krijg
        je een onderbouwd advies — per materiaalstroom én voor het project als geheel.
      </p>

      <div className="grid md:grid-cols-3 gap-3 mt-6">
        {[
          { stap: '1', titel: 'Projectinfo', tekst: 'Naam, fase, gemeente.' },
          { stap: '2', titel: 'Locatie', tekst: 'Pin de bouwplaats op de kaart.' },
          { stap: '3', titel: 'Materiaalstromen', tekst: 'Welke stromen, hoe groot?' },
          { stap: '4', titel: 'Keteninrichting', tekst: 'Regie, BLVC, ticketsysteem?' },
          { stap: '5', titel: 'Advies', tekst: 'Score, kleur en aandachtspunten.' },
          { stap: '6', titel: 'Export', tekst: 'Download als PDF.' },
        ].map((s) => (
          <div key={s.stap} className="border border-cream-light bg-cream-light/40 rounded-md p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-bordeaux">
              Stap {s.stap}
            </div>
            <div className="font-semibold text-bordeaux mt-0.5">{s.titel}</div>
            <div className="text-sm text-slate-body">{s.tekst}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-cream-light/60 border-l-4 border-bordeaux p-4 rounded-r-md">
        <div className="text-xs font-bold uppercase tracking-wider text-bordeaux mb-1">
          Tijdsindicatie
        </div>
        <p className="text-sm text-slate-body">
          Het invullen duurt ongeveer <strong>10 minuten</strong>. Je kunt op elk moment
          terug naar een eerdere stap. Resultaat kun je opslaan als PDF.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={onStart} className="btn btn-primary">
          Start de afweging  →
        </button>
      </div>
    </div>
  );
}

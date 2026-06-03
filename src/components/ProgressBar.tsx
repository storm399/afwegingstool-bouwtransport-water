interface Props {
  stappen: string[];
  actief: number;
  onClick?: (idx: number) => void;
}

export default function ProgressBar({ stappen, actief, onClick }: Props) {
  return (
    <nav aria-label="Voortgang" className="mb-2">
      <ol className="flex items-center justify-between gap-1 overflow-x-auto">
        {stappen.map((label, idx) => {
          const isActief = idx === actief;
          const isAfgerond = idx < actief;
          const isKlikbaar = onClick && idx < actief;

          return (
            <li
              key={label}
              className="flex-1 min-w-[80px]"
            >
              <button
                type="button"
                disabled={!isKlikbaar}
                onClick={() => isKlikbaar && onClick!(idx)}
                className={`w-full text-left group ${isKlikbaar ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center gap-2">
                  {/* Bolletje */}
                  <span
                    className={[
                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors',
                      isActief && 'bg-bordeaux text-white ring-2 ring-bordeaux/30',
                      isAfgerond && 'bg-bordeaux/80 text-white',
                      !isActief && !isAfgerond && 'bg-cream-light text-bordeaux/40 ring-1 ring-bordeaux/15',
                    ].filter(Boolean).join(' ')}
                  >
                    {isAfgerond ? '✓' : idx + 1}
                  </span>
                  {/* Label */}
                  <span
                    className={[
                      'text-xs md:text-sm font-medium truncate',
                      isActief && 'text-bordeaux font-bold',
                      isAfgerond && 'text-bordeaux/80',
                      !isActief && !isAfgerond && 'text-slate-body/60',
                      isKlikbaar && 'group-hover:underline',
                    ].filter(Boolean).join(' ')}
                  >
                    {label}
                  </span>
                </div>
                {/* Verbindingsbalk */}
                {idx < stappen.length - 1 && (
                  <div
                    className={[
                      'h-0.5 mt-2 transition-colors',
                      idx < actief ? 'bg-bordeaux/60' : 'bg-cream-light',
                    ].join(' ')}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

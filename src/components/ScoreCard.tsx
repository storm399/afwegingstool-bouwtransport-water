import type { AdviesNiveau } from '../types';
import { adviesLabel } from '../lib/scoring';

interface Props {
  score: number;
  advies: AdviesNiveau;
  titel: string;
  ondertitel?: string;
}

export default function ScoreCard({ score, advies, titel, ondertitel }: Props) {
  const lbl = adviesLabel(advies);
  const bgClass = {
    'success': 'bg-success-bg border-success-text/30',
    'warning': 'bg-warning-bg border-warning-text/30',
    'danger': 'bg-danger-bg border-danger-text/30',
  }[lbl.color];
  const textClass = {
    'success': 'text-success-text',
    'warning': 'text-warning-text',
    'danger': 'text-danger-text',
  }[lbl.color];

  return (
    <div className={`rounded-lg border-2 p-5 ${bgClass}`}>
      <div className={`text-xs font-semibold uppercase tracking-wider ${textClass}`}>
        {titel}
      </div>
      {ondertitel && (
        <div className="text-sm text-slate-body italic mt-0.5">{ondertitel}</div>
      )}
      <div className="mt-3 flex items-baseline gap-3">
        <span className={`text-5xl font-bold ${textClass}`}>{score}</span>
        <span className="text-sm text-slate-body">/ 100</span>
      </div>
      <div className={`mt-2 text-lg font-semibold ${textClass}`}>
        {lbl.emoji} {lbl.label}
      </div>
    </div>
  );
}

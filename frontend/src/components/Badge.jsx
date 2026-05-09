/** Status badge — matches the reference design's coloured pill labels */
const STATUS_STYLES = {
  pending:     'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  in_progress: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30',
  completed:   'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  archived:    'bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30',
};

const STATUS_LABELS = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
  archived:    'Archived',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-zinc-500/15 text-zinc-400'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/** Priority badge */
const PRIORITY_STYLES = {
  low:    'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30',
  medium: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
  high:   'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
};

const PRIORITY_DOT = {
  low:    'bg-sky-400',
  medium: 'bg-orange-400',
  high:   'bg-rose-400',
};

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[priority] ?? 'bg-zinc-500/15 text-zinc-400'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[priority] ?? 'bg-zinc-400'}`} />
      {priority}
    </span>
  );
}

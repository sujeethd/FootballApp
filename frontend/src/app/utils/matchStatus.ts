import type { Match } from '@/app/types/sports';

export type MatchPhase = 'live' | 'upcoming' | 'finished';

const LIVE_STATUSES = new Set([
  '1H',
  '2H',
  'ET',
  'P',
  'LIVE',
  'HT',
  'BT',
  'INT',
  'BREAK',
  'PEN',
]);

const FINISHED_STATUSES = new Set([
  'FT',
  'AET',
  'FT_PEN',
  'PEN',
  'CANC',
  'ABD',
  'SUSP',
  'AWD',
  'WO',
]);

const STATUS_LABELS: Record<string, string> = {
  PST: 'Postponed',
  CANC: 'Cancelled',
  ABD: 'Abandoned',
  SUSP: 'Suspended',
  TBD: 'TBD',
};

export function getMatchPhase(match: Match): MatchPhase {
  const status = (match.status || '').toUpperCase();
  if (FINISHED_STATUSES.has(status)) {
    return 'finished';
  }
  if (LIVE_STATUSES.has(status)) {
    return 'live';
  }

  if (match.kickoffUtc) {
    const kickoff = new Date(match.kickoffUtc);
    if (!Number.isNaN(kickoff.getTime())) {
      if (kickoff.getTime() < Date.now() && match.scoreHome != null && match.scoreAway != null) {
        return 'finished';
      }
    }
  }

  return 'upcoming';
}

export function getStatusLabel(match: Match, phase: MatchPhase): string {
  const status = (match.status || '').toUpperCase();
  if (STATUS_LABELS[status]) {
    return STATUS_LABELS[status];
  }

  switch (phase) {
    case 'live':
      return 'LIVE';
    case 'finished':
      return 'Finished';
    case 'upcoming':
    default:
      return 'Upcoming';
  }
}

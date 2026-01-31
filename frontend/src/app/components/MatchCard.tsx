import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { TeamLogo } from '@/app/components/TeamLogo';
import type { Match } from '@/app/types/sports';
import { format } from 'date-fns';
import { getMatchPhase, getStatusLabel } from '@/app/utils/matchStatus';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const phase = getMatchPhase(match);
  const statusLabel = getStatusLabel(match, phase);
  const kickoff = match.kickoffUtc ? new Date(match.kickoffUtc) : null;

  const getStatusBadge = () => {
    if (statusLabel === 'LIVE') {
      return <Badge className="bg-red-500 animate-pulse">LIVE</Badge>;
    }
    if (phase === 'upcoming') {
      return <Badge variant="outline">{statusLabel}</Badge>;
    }
    return <Badge variant="secondary">{statusLabel}</Badge>;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">World Cup</div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1">
          <TeamLogo teamName={match.homeTeam.name} size="md" />
          <span className="text-sm text-center mt-2">{match.homeTeam.name}</span>
        </div>

        {/* Score or Time */}
        <div className="flex flex-col items-center px-4">
          {phase === 'upcoming' ? (
            <div className="text-center">
              <div className="text-2xl font-semibold">VS</div>
              <div className="text-xs text-gray-600 mt-1">
                {kickoff ? format(kickoff, 'HH:mm') : 'TBD'}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold">
                {match.scoreHome ?? 'N/A'} - {match.scoreAway ?? 'N/A'}
              </div>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1">
          <TeamLogo teamName={match.awayTeam.name} size="md" />
          <span className="text-sm text-center mt-2">{match.awayTeam.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{kickoff ? format(kickoff, 'MMM dd, yyyy') : 'TBD'}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{match.venue || 'Venue TBD'}</span>
        </div>
      </div>
    </Card>
  );
}

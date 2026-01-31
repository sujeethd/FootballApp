import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { TeamLogo } from '@/app/components/TeamLogo';
import type { Match } from '@/app/types/sports';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return <Badge className="bg-red-500 animate-pulse">LIVE</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      case 'finished':
        return <Badge variant="secondary">Finished</Badge>;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">{match.league}</div>
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
          {match.status === 'upcoming' ? (
            <div className="text-center">
              <div className="text-2xl font-semibold">VS</div>
              <div className="text-xs text-gray-600 mt-1">
                {format(match.date, 'HH:mm')}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold">
                {match.score?.home} - {match.score?.away}
              </div>
              {match.status === 'live' && match.minute && (
                <div className="text-xs text-red-500 font-semibold mt-1">
                  {match.minute}'
                </div>
              )}
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
          <span>{format(match.date, 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{match.venue}</span>
        </div>
      </div>
    </Card>
  );
}
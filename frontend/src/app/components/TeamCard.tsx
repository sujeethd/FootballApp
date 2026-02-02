import { Star, MapPin, Hash } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { TeamLogo } from '@/app/components/TeamLogo';
import type { Team } from '@/app/types/sports';

interface TeamCardProps {
  team: Team;
  isFollowing: boolean;
  onToggleFollow: (teamId: string) => void;
  onViewDetails: (team: Team) => void;
}

export function TeamCard({ team, isFollowing, onToggleFollow, onViewDetails }: TeamCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-green-700 flex items-center justify-center">
        <TeamLogo teamName={team.name} size="lg" imageUrl={team.flagUrl} />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <p className="text-sm text-gray-600">
              {team.fifaCode ? `${team.fifaCode} - ${team.country || 'Unknown country'}` : team.country || 'Unknown country'}
            </p>
          </div>
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleFollow(team.id)}
            aria-label={isFollowing ? 'Unfollow team' : 'Follow team'}
            className="ml-2"
          >
            <Star className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{team.country || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="h-4 w-4" />
            <span>{team.fifaCode || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">Rank: {team.worldRanking ?? 'N/A'}</Badge>
            <Badge variant="secondary">Code: {team.fifaCode || 'N/A'}</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewDetails(team)}
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

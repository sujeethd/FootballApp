import { Star, Users, User } from 'lucide-react';
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
        <TeamLogo teamName={team.name} size="lg" />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <p className="text-sm text-gray-600">{team.league}</p>
          </div>
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleFollow(team.id)}
            className="ml-2"
          >
            <Star className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{team.coach}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{team.rosterSize} players</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">W: {team.stats.wins}</Badge>
            <Badge variant="secondary">D: {team.stats.draws}</Badge>
            <Badge variant="secondary">L: {team.stats.losses}</Badge>
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
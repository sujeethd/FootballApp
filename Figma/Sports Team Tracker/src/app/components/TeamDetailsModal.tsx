import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { TeamLogo } from '@/app/components/TeamLogo';
import type { Team } from '@/app/types/sports';

interface TeamDetailsModalProps {
  team: Team | null;
  open: boolean;
  onClose: () => void;
}

export function TeamDetailsModal({ team, open, onClose }: TeamDetailsModalProps) {
  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <TeamLogo teamName={team.name} size="lg" />
            <div>
              <DialogTitle className="text-2xl">{team.name}</DialogTitle>
              <p className="text-sm text-gray-600">{team.league}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Coach Info */}
            <div>
              <h3 className="font-semibold mb-2">Coach</h3>
              <p className="text-gray-700">{team.coach}</p>
            </div>

            {/* Stats */}
            <div>
              <h3 className="font-semibold mb-3">Season Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{team.stats.wins}</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{team.stats.draws}</div>
                  <div className="text-sm text-gray-600">Draws</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{team.stats.losses}</div>
                  <div className="text-sm text-gray-600">Losses</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {team.stats.goalsFor} - {team.stats.goalsAgainst}
                  </div>
                  <div className="text-sm text-gray-600">Goals (F-A)</div>
                </div>
              </div>
            </div>

            {/* Roster */}
            <div>
              <h3 className="font-semibold mb-3">Squad Roster</h3>
              <div className="space-y-2">
                {team.roster.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        {player.number}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-600">{player.nationality}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{player.position}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
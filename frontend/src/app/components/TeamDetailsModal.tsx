import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { TeamLogo } from '@/app/components/TeamLogo';
import type { Team, Roster } from '@/app/types/sports';

interface TeamDetailsModalProps {
  team: Team | null;
  roster: Roster | null;
  loading: boolean;
  open: boolean;
  onClose: () => void;
}

export function TeamDetailsModal({ team, roster, loading, open, onClose }: TeamDetailsModalProps) {
  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <TeamLogo teamName={team.name} size="lg" imageUrl={team.flagUrl} />
            <div>
              <DialogTitle className="text-2xl">{team.name}</DialogTitle>
              <p className="text-sm text-gray-600">{team.country || 'Unknown country'}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Team Info */}
            <div>
              <h3 className="font-semibold mb-3">Team Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">FIFA Code</div>
                  <div className="text-lg font-semibold text-blue-700">{team.fifaCode || 'N/A'}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">World Ranking</div>
                  <div className="text-lg font-semibold text-green-700">
                    {team.worldRanking ?? 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Country</div>
                  <div className="text-lg font-semibold text-gray-800">{team.country || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Coaches */}
            <div>
              <h3 className="font-semibold mb-2">Coaches</h3>
              {loading ? (
                <p className="text-gray-500">Loading roster...</p>
              ) : roster?.coaches?.length ? (
                <div className="space-y-2">
                  {roster.coaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{coach.name}</div>
                        <div className="text-sm text-gray-600">
                          {coach.nationality || 'Nationality unknown'}
                        </div>
                      </div>
                      {coach.birthdate && (
                        <Badge variant="outline">{coach.birthdate}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No coach data yet</p>
              )}
            </div>

            {/* Roster */}
            <div>
              <h3 className="font-semibold mb-3">Squad Roster</h3>
              {loading ? (
                <p className="text-gray-500">Loading roster...</p>
              ) : roster?.players?.length ? (
                <div className="space-y-2">
                  {roster.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                          {player.number ?? 'N/A'}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-600">
                            {player.nationality || 'Nationality unknown'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{player.position || 'N/A'}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No roster data yet</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Search, Trophy } from 'lucide-react';
import { TeamCard } from '@/app/components/TeamCard';
import { MatchCard } from '@/app/components/MatchCard';
import { TeamDetailsModal } from '@/app/components/TeamDetailsModal';
import { AlertsPanel } from '@/app/components/AlertsPanel';
import type { Team, Match, Alert, Roster } from '@/app/types/sports';
import { Separator } from '@/app/components/ui/separator';
import { getMatchPhase } from '@/app/utils/matchStatus';

const FOLLOWED_TEAMS_KEY = 'footballapp.followedTeamIds';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [followedTeamIds, setFollowedTeamIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FOLLOWED_TEAMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rosters, setRosters] = useState<Record<string, Roster>>({});
  const [rosterLoadingId, setRosterLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setErrorMessage(null);
      setLoadingTeams(true);
      setLoadingMatches(true);

      try {
        const [teamsResponse, matchesResponse] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/matches'),
        ]);

        if (!teamsResponse.ok) {
          throw new Error(`Failed to load teams (${teamsResponse.status})`);
        }
        if (!matchesResponse.ok) {
          throw new Error(`Failed to load matches (${matchesResponse.status})`);
        }

        const [teamsData, matchesData] = await Promise.all([
          teamsResponse.json(),
          matchesResponse.json(),
        ]);

        if (!active) return;

        setTeams(teamsData as Team[]);
        setMatches(matchesData as Match[]);
      } catch (error) {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        if (!active) return;
        setLoadingTeams(false);
        setLoadingMatches(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWED_TEAMS_KEY, JSON.stringify(followedTeamIds));
    } catch {
      // Ignore localStorage errors
    }
  }, [followedTeamIds]);

  useEffect(() => {
    if (teams.length === 0) return;
    setFollowedTeamIds((prev) => prev.filter((id) => teams.some((team) => team.id === id)));
  }, [teams]);

  useEffect(() => {
    if (!selectedTeam || rosters[selectedTeam.id]) {
      return;
    }

    let active = true;
    setRosterLoadingId(selectedTeam.id);

    fetch(`/api/teams/${selectedTeam.id}/roster`)
      .then((response) => {
        console.log('Roster response received', selectedTeam.id);

        if (!response.ok) {
          throw new Error('Failed to load roster');
        }
        console.log('Roster response:', response);
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setRosters((prev) => ({ ...prev, [selectedTeam.id]: data as Roster }));
      })
      .catch((error) => {
        console.error('Failed to load roster', error);
        // Ignore roster errors for now
      })
      .finally(() => {
        if (!active) return;
        setRosterLoadingId(null);
      });

    return () => {
      active = false;
    };
  }, [selectedTeam, rosters]);

  const toggleFollowTeam = (teamId: string) => {
    setFollowedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTeams = teams.filter((team) => {
    if (!normalizedQuery) {
      return true;
    }

    const name = team.name?.toLowerCase() || '';
    const country = team.country?.toLowerCase() || '';
    const code = team.fifaCode?.toLowerCase() || '';

    return name.includes(normalizedQuery) || country.includes(normalizedQuery) || code.includes(normalizedQuery);
  });

  const followedTeams = teams.filter((team) => followedTeamIds.includes(team.id));

  const followedTeamMatches = matches.filter(
    (match) => followedTeamIds.includes(match.homeTeam.id) || followedTeamIds.includes(match.awayTeam.id)
  );

  const upcomingMatches = followedTeamMatches.filter((match) => getMatchPhase(match) === 'upcoming');
  const liveMatches = followedTeamMatches.filter((match) => getMatchPhase(match) === 'live');
  const finishedMatches = followedTeamMatches.filter((match) => getMatchPhase(match) === 'finished');

  const markAlertAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert))
    );
  };

  const markAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const groupTeamsByCountry = (teamsToGroup: Team[]) => {
    return teamsToGroup.reduce((acc, team) => {
      const country = team.country?.trim() || 'Unknown';
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(team);
      return acc;
    }, {} as Record<string, Team[]>);
  };

  const groupedFilteredTeams = groupTeamsByCountry(filteredTeams);
  const countries = Object.keys(groupedFilteredTeams).sort();
  const selectedRoster = selectedTeam ? rosters[selectedTeam.id] || null : null;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Soccer field background with pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1506296756558-7622088b2656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZCUyMHBhdHRlcm58ZW58MXx8fHwxNzY5ODA5NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Soccer ball pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              rgba(34, 197, 94, 0.03) 100px,
              rgba(34, 197, 94, 0.03) 200px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 100px,
              rgba(34, 197, 94, 0.02) 100px,
              rgba(34, 197, 94, 0.02) 200px
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Football Hub</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search teams, countries, FIFA codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <Tabs defaultValue="my-teams" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="my-teams">My Teams</TabsTrigger>
              <TabsTrigger value="all-teams">All Teams</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>

            {/* My Teams Tab */}
            <TabsContent value="my-teams" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Following {followedTeams.length} {followedTeams.length === 1 ? 'Team' : 'Teams'}
                </h2>
                {loadingTeams ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-gray-500">Loading teams...</p>
                  </div>
                ) : followedTeams.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">You're not following any teams yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Browse "All Teams" to start following
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followedTeams.map((team) => (
                      <TeamCard
                        key={team.id}
                        team={team}
                        isFollowing={true}
                        onToggleFollow={toggleFollowTeam}
                        onViewDetails={setSelectedTeam}
                      />
                    ))}
                  </div>
                )}
              </div>

              {followedTeams.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Live Matches */}
                    {liveMatches.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Live Now</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {liveMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upcoming Matches */}
                    {upcomingMatches.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {upcomingMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Results */}
                    {finishedMatches.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {finishedMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alerts Panel */}
                  <div>
                    <AlertsPanel
                      alerts={alerts}
                      onMarkAsRead={markAlertAsRead}
                      onMarkAllAsRead={markAllAlertsAsRead}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* All Teams Tab */}
            <TabsContent value="all-teams">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">
                  {searchQuery ? `Search Results (${filteredTeams.length})` : 'All Teams'}
                </h2>
                {loadingTeams ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-gray-500">Loading teams...</p>
                  </div>
                ) : (
                  countries.map((country, index) => (
                    <div key={country} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{country}</h3>
                        <span className="text-sm text-gray-500">
                          {groupedFilteredTeams[country].length}{' '}
                          {groupedFilteredTeams[country].length === 1 ? 'team' : 'teams'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupedFilteredTeams[country].map((team) => (
                          <TeamCard
                            key={team.id}
                            team={team}
                            isFollowing={followedTeamIds.includes(team.id)}
                            onToggleFollow={toggleFollowTeam}
                            onViewDetails={setSelectedTeam}
                          />
                        ))}
                      </div>
                      {index < countries.length - 1 && <Separator className="mt-8" />}
                    </div>
                  ))
                )}
                {!loadingTeams && filteredTeams.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No teams found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches">
              <div className="space-y-6">
                {/* Live Matches */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
                  {loadingMatches ? (
                    <div className="text-center py-8 bg-white rounded-lg border">
                      <p className="text-gray-500">Loading matches...</p>
                    </div>
                  ) : matches.filter((m) => getMatchPhase(m) === 'live').length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border">
                      <p className="text-gray-500">No live matches right now</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matches
                        .filter((m) => getMatchPhase(m) === 'live')
                        .map((match) => (
                          <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Matches */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matches
                      .filter((m) => getMatchPhase(m) === 'upcoming')
                      .map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                  </div>
                </div>

                {/* Recent Results */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matches
                      .filter((m) => getMatchPhase(m) === 'finished')
                      .map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Team Details Modal */}
        <TeamDetailsModal
          team={selectedTeam}
          roster={selectedRoster}
          loading={!!selectedTeam && rosterLoadingId === selectedTeam.id}
          open={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      </div>
    </div>
  );
}

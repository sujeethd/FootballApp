export interface Team {
  id: string;
  apiId?: number | null;
  name: string;
  fifaCode?: string | null;
  country?: string | null;
  flagUrl?: string | null;
  worldRanking?: number | null;
}

export interface TeamSummary {
  id: string;
  name: string;
  fifaCode?: string | null;
}

export interface Match {
  id: string;
  apiId?: number | null;
  kickoffUtc: string;
  status: string;
  venue?: string | null;
  scoreHome?: number | null;
  scoreAway?: number | null;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
}

export interface Player {
  id: string;
  apiId?: number | null;
  name: string;
  position?: string | null;
  number?: number | null;
  birthdate?: string | null;
  nationality?: string | null;
}

export interface Coach {
  id: string;
  apiId?: number | null;
  name: string;
  nationality?: string | null;
  birthdate?: string | null;
}

export interface Roster {
  teamId: string;
  teamName: string;
  players: Player[];
  coaches: Coach[];
}

export interface Alert {
  id: string;
  matchId: string;
  type: 'match_starting' | 'goal' | 'half_time' | 'full_time';
  message: string;
  timestamp: Date;
  read: boolean;
}

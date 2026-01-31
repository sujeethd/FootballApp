export interface Team {
  id: string;
  name: string;
  logo: string;
  league: string;
  coach: string;
  rosterSize: number;
  stats: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  roster: Player[];
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  nationality: string;
}

export interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  date: Date;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  minute?: number;
  venue: string;
  league: string;
}

export interface Alert {
  id: string;
  matchId: string;
  type: 'match_starting' | 'goal' | 'half_time' | 'full_time';
  message: string;
  timestamp: Date;
  read: boolean;
}

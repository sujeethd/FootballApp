CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    tz VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    fifa_code VARCHAR(8),
    country VARCHAR(128),
    flag_url TEXT,
    world_ranking INTEGER,
    world_ranking_updated_at TIMESTAMPTZ
);

CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id INTEGER UNIQUE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    nationality VARCHAR(64),
    birthdate DATE
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id INTEGER UNIQUE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    position VARCHAR(32),
    number INTEGER,
    birthdate DATE,
    nationality VARCHAR(64)
);

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id INTEGER UNIQUE NOT NULL,
    home_team_id UUID NOT NULL REFERENCES teams(id),
    away_team_id UUID NOT NULL REFERENCES teams(id),
    kickoff_utc TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL,
    venue VARCHAR(128),
    score_home INTEGER,
    score_away INTEGER
);

CREATE INDEX idx_matches_kickoff ON matches (kickoff_utc);

CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    minute INTEGER NOT NULL,
    type VARCHAR(32) NOT NULL,
    team_id UUID REFERENCES teams(id),
    player_id UUID REFERENCES players(id),
    detail TEXT
);

CREATE INDEX idx_match_events_match_id ON match_events (match_id);

CREATE TABLE user_team_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, team_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(16) NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);

CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL,
    last_run_at TIMESTAMPTZ,
    message TEXT
);

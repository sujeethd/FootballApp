CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id INTEGER UNIQUE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    nationality VARCHAR(64),
    birthdate DATE
);

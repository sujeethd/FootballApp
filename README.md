# FootballApp (Backend)

## Setup

Required environment variables:
- `API_FOOTBALL_KEY`
- `API_FOOTBALL_LEAGUE_ID`
- `API_FOOTBALL_SEASON`

Optional environment variables (defaults shown in `application.yml`):
- `API_FOOTBALL_BASE_URL` (default: `https://v3.football.api-sports.io`)
- `DB_URL` (default: `jdbc:postgresql://localhost:5432/footballapp`)
- `DB_USER` (default: `postgres`)
- `DB_PASSWORD` (default: `postgres`)

## Docker

Build and run with Postgres:

```
API_FOOTBALL_KEY=your_key \
API_FOOTBALL_LEAGUE_ID=your_league_id \
API_FOOTBALL_SEASON=your_season \
docker compose up --build
```

The app will be available at http://localhost:8080.

## Manual Sync

Trigger a manual refresh (free-tier friendly):

```
POST /api/sync?type=all
POST /api/sync?type=teams
POST /api/sync?type=matches
```

Example with curl:

```
curl -X POST "http://localhost:8080/api/sync?type=all"
```

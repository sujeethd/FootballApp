# AGENTS.md

Context summary for this repo (FootballApp).

## Project goal
- FIFA World Cup tracking app (48 qualified teams).
- Users pick teams to track, get match notifications, view live scores, view rosters/coaches.
- Backend in Spring Boot + PostgreSQL. Frontend later in React (mobile-friendly).
- Use API-Football as data source.
- Manual refresh now (free tier), eventual polling every 60s for live matches.
- Single-user now, multi-user later (user_id is in schema).
- This is a teaching exercise: proceed step by step and explain along the way.

## Tech choices
- Spring Boot 4.x, Java 25, Gradle Kotlin DSL.
- PostgreSQL + Flyway migrations.
- Config via env vars (best practices for secrets).

## Database schema (V1__init.sql)
Tables: users, teams, coaches, players, matches, match_events, user_team_follows, notifications, sync_logs.

Key notes:
- UUID primary keys, api_id for external IDs, FK relationships.
- created_at on users and user_team_follows.

## Entities + repositories
Entities in src/main/java/com/shrank/footballapp/domain/* with:
- @GeneratedValue + @UuidGenerator on all ids.
- @CreationTimestamp on users.created_at and user_team_follows.created_at.
- Proper quoted annotation names.

Repositories in src/main/java/com/shrank/footballapp/repository/*.

Repository query helpers:
- TeamRepository: findAllByOrderByNameAsc
- MatchRepository: findAllByOrderByKickoffUtcAsc, findByHomeTeamIdOrAwayTeamIdOrderByKickoffUtcAsc
- PlayerRepository: findByTeamIdOrderByNameAsc
- CoachRepository: findByTeamId

## API-Football integration + manual sync
Files:
- ApiFootballProperties.java
- ApiFootballConfig.java
- ApiFootballClient.java
- SyncService.java
- SyncController.java

Manual endpoint:
POST /api/sync?type=all|teams|matches (default type is all)

## Read-only REST endpoints + DTOs
Controllers:
- GET /api/teams
- GET /api/matches (optional ?teamId=...)
- GET /api/teams/{teamId}/roster

Services:
- TeamService, MatchService, RosterService (map entities -> DTOs)

DTOs:
- TeamDto, TeamSummaryDto, MatchDto, PlayerDto, CoachDto, RosterDto

## application.yml defaults
- API_FOOTBALL_BASE_URL defaults to https://v3.football.api-sports.io
- Required: API_FOOTBALL_KEY, API_FOOTBALL_LEAGUE_ID, API_FOOTBALL_SEASON

## README
Includes env vars and /api/sync usage.
Clarifications:
- Entities = data model, repositories = data access interface (Spring generates implementations).
- @Service, @Component, @Transactional, DTOs, streams, etc.
- api_id is external ID for syncing.
- @ManyToOne indicates FK relationship.
- @CreationTimestamp only where created_at exists.
- Spring Data derives queries from method names (entity fields, not table names).

## Next step options (not done yet)
- Add roster sync (players + coaches) from API-Football.
- Add more API filtering/paging.
- Add error handling/validation.
- Docker setup later.

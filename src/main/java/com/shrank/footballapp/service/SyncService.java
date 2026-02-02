package com.shrank.footballapp.service;

import com.shrank.footballapp.domain.Match;
import com.shrank.footballapp.domain.Player;
import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.integration.ApiFootballClient;
import com.shrank.footballapp.integration.ApiFootballProperties;
import com.shrank.footballapp.repository.MatchRepository;
import com.shrank.footballapp.repository.PlayerRepository;
import com.shrank.footballapp.repository.TeamRepository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SyncService {
    private final ApiFootballClient api;
    private final ApiFootballProperties props;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;

    public SyncService(
            ApiFootballClient api,
            ApiFootballProperties props,
            TeamRepository teamRepository,
            MatchRepository matchRepository,
            PlayerRepository playerRepository
    ) {
        this.api = api;
        this.props = props;
        this.teamRepository = teamRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }

    @Transactional
    public SyncResult syncTeams() {
        requireConfig();
        List<ApiFootballClient.ApiTeam> apiTeams = api.fetchTeams();
        int created = 0;
        int updated = 0;

        for (ApiFootballClient.ApiTeam apiTeam : apiTeams) {
            Optional<Team> teamExisting = teamRepository.findByApiId(apiTeam.id());
            Team team = teamExisting.orElseGet(Team::new);
            if (team.getId() == null) {
                created++;
            } else {
                updated++;
            }

            team.setApiId(apiTeam.id());
            team.setName(apiTeam.name());
            team.setFifaCode(apiTeam.code());
            team.setCountry(apiTeam.country());
            team.setFlagUrl(apiTeam.logo());

            teamRepository.save(team);

            for (ApiFootballClient.ApiPlayer apiPlayer : apiTeam.roster()) {
                Optional<Player> playerExisting = playerRepository.findByApiId(apiPlayer.id());
                Player player = playerExisting.orElseGet(Player::new);
                player.setApiId(apiPlayer.id());
                player.setTeam(team);
                player.setName(apiPlayer.name());
                player.setPosition(apiPlayer.position());
                player.setNumber(apiPlayer.number());
                playerRepository.save(player);
            }
        }

        return new SyncResult("teams", created, updated, apiTeams.size());
    }

    @Transactional
    public SyncResult syncFixtures() {
        requireConfig();
        List<ApiFootballClient.ApiFixture> fixtures = api.fetchFixtures();
        int created = 0;
        int updated = 0;

        for (ApiFootballClient.ApiFixture apiFixture : fixtures) {
            Team home = upsertTeamFromFixture(apiFixture.home());
            Team away = upsertTeamFromFixture(apiFixture.away());

            Optional<Match> existing = matchRepository.findByApiId(apiFixture.id());
            Match match = existing.orElseGet(Match::new);
            if (match.getId() == null) {
                created++;
            } else {
                updated++;
            }

            match.setApiId(apiFixture.id());
            match.setHomeTeam(home);
            match.setAwayTeam(away);
            match.setKickoffUtc(apiFixture.kickoffUtc());
            match.setStatus(apiFixture.status());
            match.setVenue(apiFixture.venue());
            match.setScoreHome(apiFixture.goalsHome());
            match.setScoreAway(apiFixture.goalsAway());

            matchRepository.save(match);
        }

        return new SyncResult("fixtures", created, updated, fixtures.size());
    }

    private Team upsertTeamFromFixture(ApiFootballClient.ApiFixtureTeam apiTeam) {
        Optional<Team> existing = teamRepository.findByApiId(apiTeam.id());
        if (existing.isPresent()) {
            return existing.get();
        }
        Team team = new Team();
        team.setApiId(apiTeam.id());
        team.setName(apiTeam.name());
        return teamRepository.save(team);
    }

    private void requireConfig() {
        if (props.getLeagueId() == null || props.getSeason() == null) {
            throw new IllegalStateException("API_FOOTBALL_LEAGUE_ID and API_FOOTBALL_SEASON must be set");
        }
        if (!StringUtils.hasText(props.getKey())) {
            throw new IllegalStateException("API_FOOTBALL_KEY must be set");
        }
    }

    public record SyncResult(String type, int created, int updated, int totalFetched) {}
}

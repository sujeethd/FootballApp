package com.shrank.footballapp.integration;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ObjectNode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Component
public class ApiFootballClient {
    private static final Logger log = LoggerFactory.getLogger(ApiFootballClient.class);
    private final RestClient restClient;
    private final ApiFootballProperties props;

    public ApiFootballClient(RestClient restClient, ApiFootballProperties props) {
        this.restClient = restClient;
        this.props = props;
    }

    public List<ApiPlayer> fetchRoster(int teamId) {
        log.info("Fetching roster for team ID: {}", teamId);
        ObjectNode root = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/players/squads")
                        .queryParam("team", teamId)
                        .build())
                .retrieve()
                .body(ObjectNode.class);

        log.info("Fetched roster from API Football for team ID {}: {}", teamId, root); 

        return parseRoster(root);
    }

    public List<ApiTeam> fetchTeams() {
        ObjectNode root = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                        .path("/teams")
                        .queryParam("league", props.getLeagueId())
                        .queryParam("season", props.getSeason())
                        .build())
                .retrieve()
                .body(ObjectNode.class); // Use the concrete ObjectNode class

        log.info("Fetched teams from API Football: {}", root);

        return parseTeams(root);
    }

    public List<ApiFixture> fetchFixtures() {
        ObjectNode root = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fixtures")
                        .queryParam("league", props.getLeagueId())
                        .queryParam("season", props.getSeason())
                        .queryParam("timezone", "UTC")
                        .build())
                .retrieve()
                .body(ObjectNode.class);

        return parseFixtures(root);
    }

    private List<ApiPlayer> parseRoster(JsonNode root) {
        List<ApiPlayer> roster = new ArrayList<>();
        if (root == null || root.get("response") == null) {
            return roster;
        }
        for (JsonNode item : root.get("response")) {
            JsonNode team = item.get("team");
            JsonNode players = item.get("players");
            log.info("Parsing roster item: team={}, players={}", team, players);

            if (players == null || team == null) {
                continue;
            }
            for (JsonNode playersNode : players) {
                roster.add(new ApiPlayer(
                        playersNode.path("id").asInt(),
                        team.path("id").asInt(),
                        playersNode.path("name").stringValue(null),
                        playersNode.path("position").stringValue(null),
                        playersNode.path("number").asInt()
                ));
            }
        }
        return roster;
    }

    private List<ApiTeam> parseTeams(JsonNode root) {
        List<ApiTeam> teams = new ArrayList<>();
        if (root == null || root.get("response") == null) {
            return teams;
        }
        for (JsonNode item : root.get("response")) {
            JsonNode team = item.get("team");
            if (team == null) {
                continue;
            }
            teams.add(new ApiTeam(
                    team.path("id").asInt(),
                    team.path("name").stringValue(null),
                    team.path("code").stringValue(null),
                    team.path("country").stringValue(null),
                    team.path("logo").stringValue(null),
                    fetchRoster(team.path("id").asInt())
            ));
        }
        return teams;
    }

    private List<ApiFixture> parseFixtures(JsonNode root) {
        List<ApiFixture> fixtures = new ArrayList<>();
        if (root == null || root.get("response") == null) {
            return fixtures;
        }
        for (JsonNode item : root.get("response")) {
            JsonNode fixture = item.get("fixture");
            JsonNode teams = item.get("teams");
            JsonNode goals = item.get("goals");

            if (fixture == null || teams == null) {
                continue;
            }

            String dateText = fixture.path("date").stringValue(null);
            Instant kickoff = StringUtils.hasText(dateText) ? Instant.parse(dateText) : null;

            JsonNode home = teams.get("home");
            JsonNode away = teams.get("away");

            fixtures.add(new ApiFixture(
                    fixture.path("id").asInt(),
                    kickoff,
                    fixture.path("status").path("short").stringValue(null),
                    new ApiFixtureTeam(home.path("id").asInt(), home.path("name").stringValue(null)),
                    new ApiFixtureTeam(away.path("id").asInt(), away.path("name").stringValue(null)),
                    goals == null || goals.isNull() ? null : (goals.path("home").isNull() ? null : goals.path("home").asInt()),
                    goals == null || goals.isNull() ? null : (goals.path("away").isNull() ? null : goals.path("away").asInt()),
                    fixture.path("venue").path("name").stringValue(null)
            ));
        }
        return fixtures;
    }

    public record ApiPlayer(
            int id,
            int teamId,
            String name,
            String position,
            int number
    ) {}

    public record ApiTeam(
        int id, 
        String name, 
        String code, 
        String country, 
        String logo,
        List<ApiPlayer> roster 
    ) {}

    public record ApiFixtureTeam(int id, String name) {}

    public record ApiFixture(
            int id,
            Instant kickoffUtc,
            String status,
            ApiFixtureTeam home,
            ApiFixtureTeam away,
            Integer goalsHome,
            Integer goalsAway,
            String venue
    ) {}
}

package com.shrank.footballapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shrank.footballapp.domain.Match;
import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.repository.MatchRepository;
import com.shrank.footballapp.web.dto.MatchDto;
import com.shrank.footballapp.web.dto.TeamSummaryDto;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MatchServiceTest {
    @Mock
    private MatchRepository matchRepository;

    @InjectMocks
    private MatchService matchService;

    @Test
    void getMatches_withNullTeamId_usesAllMatchesAndMapsDtos() {
        Team home = team(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Brazil", "BRA");
        Team away = team(UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Argentina", "ARG");
        Match match = match(
                UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                9001,
                Instant.parse("2026-06-15T18:00:00Z"),
                "NS",
                "MetLife Stadium",
                0,
                0,
                home,
                away
        );

        when(matchRepository.findAllByOrderByKickoffUtcAsc()).thenReturn(List.of(match));

        List<MatchDto> result = matchService.getMatches(null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(new MatchDto(
                match.getId(),
                match.getApiId(),
                match.getKickoffUtc(),
                match.getStatus(),
                match.getVenue(),
                match.getScoreHome(),
                match.getScoreAway(),
                new TeamSummaryDto(home.getId(), home.getName(), home.getFifaCode()),
                new TeamSummaryDto(away.getId(), away.getName(), away.getFifaCode())
        ));

        verify(matchRepository).findAllByOrderByKickoffUtcAsc();
    }

    @Test
    void getMatches_withTeamId_usesTeamFilter() {
        UUID teamId = UUID.fromString("dddddddd-dddd-dddd-dddd-dddddddddddd");

        when(matchRepository.findByHomeTeamIdOrAwayTeamIdOrderByKickoffUtcAsc(teamId, teamId))
                .thenReturn(List.of());

        List<MatchDto> result = matchService.getMatches(teamId);

        assertThat(result).isEmpty();
        verify(matchRepository).findByHomeTeamIdOrAwayTeamIdOrderByKickoffUtcAsc(teamId, teamId);
    }

    private static Team team(UUID id, String name, String fifaCode) {
        Team team = new Team();
        team.setId(id);
        team.setName(name);
        team.setFifaCode(fifaCode);
        return team;
    }

    private static Match match(
            UUID id,
            Integer apiId,
            Instant kickoffUtc,
            String status,
            String venue,
            Integer scoreHome,
            Integer scoreAway,
            Team homeTeam,
            Team awayTeam
    ) {
        Match match = new Match();
        match.setId(id);
        match.setApiId(apiId);
        match.setKickoffUtc(kickoffUtc);
        match.setStatus(status);
        match.setVenue(venue);
        match.setScoreHome(scoreHome);
        match.setScoreAway(scoreAway);
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        return match;
    }
}

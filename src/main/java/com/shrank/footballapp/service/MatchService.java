package com.shrank.footballapp.service;

import com.shrank.footballapp.domain.Match;
import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.repository.MatchRepository;
import com.shrank.footballapp.web.dto.MatchDto;
import com.shrank.footballapp.web.dto.TeamSummaryDto;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MatchService {
    private final MatchRepository matchRepository;

    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    @Transactional
    public List<MatchDto> getMatches(UUID teamId) {
        List<Match> matches = teamId == null
                ? matchRepository.findAllByOrderByKickoffUtcAsc()
                : matchRepository.findByHomeTeamIdOrAwayTeamIdOrderByKickoffUtcAsc(teamId, teamId);

        return matches.stream()
                .map(this::toDto)
                .toList();
    }

    private MatchDto toDto(Match match) {
        return new MatchDto(
                match.getId(),
                match.getApiId(),
                match.getKickoffUtc(),
                match.getStatus(),
                match.getVenue(),
                match.getScoreHome(),
                match.getScoreAway(),
                toTeamSummary(match.getHomeTeam()),
                toTeamSummary(match.getAwayTeam())
        );
    }

    private TeamSummaryDto toTeamSummary(Team team) {
        return new TeamSummaryDto(
                team.getId(),
                team.getName(),
                team.getFifaCode()
        );
    }
}

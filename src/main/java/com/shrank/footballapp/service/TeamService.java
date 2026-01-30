package com.shrank.footballapp.service;

import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.repository.TeamRepository;
import com.shrank.footballapp.web.dto.TeamDto;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TeamService {
    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Transactional
    public List<TeamDto> getTeams() {
        return teamRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDto)
                .toList();
    }

    private TeamDto toDto(Team team) {
        return new TeamDto(
                team.getId(),
                team.getApiId(),
                team.getName(),
                team.getFifaCode(),
                team.getCountry(),
                team.getFlagUrl(),
                team.getWorldRanking()
        );
    }
}

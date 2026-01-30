package com.shrank.footballapp.service;

import com.shrank.footballapp.domain.Coach;
import com.shrank.footballapp.domain.Player;
import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.repository.CoachRepository;
import com.shrank.footballapp.repository.PlayerRepository;
import com.shrank.footballapp.repository.TeamRepository;
import com.shrank.footballapp.web.dto.CoachDto;
import com.shrank.footballapp.web.dto.PlayerDto;
import com.shrank.footballapp.web.dto.RosterDto;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RosterService {
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final CoachRepository coachRepository;

    public RosterService(
            TeamRepository teamRepository,
            PlayerRepository playerRepository,
            CoachRepository coachRepository
    ) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.coachRepository = coachRepository;
    }

    @Transactional
    public RosterDto getRoster(UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

        List<PlayerDto> players = playerRepository.findByTeamIdOrderByNameAsc(teamId).stream()
                .map(this::toDto)
                .toList();

        List<CoachDto> coaches = coachRepository.findByTeamId(teamId).stream()
                .map(this::toDto)
                .toList();

        return new RosterDto(team.getId(), team.getName(), players, coaches);
    }

    private PlayerDto toDto(Player player) {
        return new PlayerDto(
                player.getId(),
                player.getApiId(),
                player.getName(),
                player.getPosition(),
                player.getNumber(),
                player.getBirthdate(),
                player.getNationality()
        );
    }

    private CoachDto toDto(Coach coach) {
        return new CoachDto(
                coach.getId(),
                coach.getApiId(),
                coach.getName(),
                coach.getNationality(),
                coach.getBirthdate()
        );
    }
}

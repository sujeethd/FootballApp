package com.shrank.footballapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shrank.footballapp.domain.Coach;
import com.shrank.footballapp.domain.Player;
import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.repository.CoachRepository;
import com.shrank.footballapp.repository.PlayerRepository;
import com.shrank.footballapp.repository.TeamRepository;
import com.shrank.footballapp.web.dto.CoachDto;
import com.shrank.footballapp.web.dto.PlayerDto;
import com.shrank.footballapp.web.dto.RosterDto;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class RosterServiceTest {
    @Mock
    private TeamRepository teamRepository;

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private CoachRepository coachRepository;

    @InjectMocks
    private RosterService rosterService;

    @Test
    void getRoster_mapsPlayersAndCoaches() {
        UUID teamId = UUID.fromString("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");
        Team team = team(teamId, "Japan");

        Player player = player(
                UUID.fromString("11111111-2222-3333-4444-555555555555"),
                2001,
                "Takumi Minamino",
                "Midfielder",
                10,
                LocalDate.parse("1995-01-16"),
                "Japan"
        );
        Coach coach = coach(
                UUID.fromString("66666666-7777-8888-9999-000000000000"),
                3001,
                "Hajime Moriyasu",
                "Japan",
                LocalDate.parse("1968-08-23")
        );

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(playerRepository.findByTeamIdOrderByNameAsc(teamId)).thenReturn(List.of(player));
        when(coachRepository.findByTeamId(teamId)).thenReturn(List.of(coach));

        RosterDto result = rosterService.getRoster(teamId);

        assertThat(result).isEqualTo(new RosterDto(
                team.getId(),
                team.getName(),
                List.of(new PlayerDto(
                        player.getId(),
                        player.getApiId(),
                        player.getName(),
                        player.getPosition(),
                        player.getNumber(),
                        player.getBirthdate(),
                        player.getNationality()
                )),
                List.of(new CoachDto(
                        coach.getId(),
                        coach.getApiId(),
                        coach.getName(),
                        coach.getNationality(),
                        coach.getBirthdate()
                ))
        ));

        verify(teamRepository).findById(teamId);
        verify(playerRepository).findByTeamIdOrderByNameAsc(teamId);
        verify(coachRepository).findByTeamId(teamId);
    }

    @Test
    void getRoster_missingTeam_throwsNotFound() {
        UUID teamId = UUID.fromString("ffffffff-ffff-ffff-ffff-ffffffffffff");
        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> rosterService.getRoster(teamId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Team not found")
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));

        verify(teamRepository).findById(teamId);
    }

    private static Team team(UUID id, String name) {
        Team team = new Team();
        team.setId(id);
        team.setName(name);
        return team;
    }

    private static Player player(
            UUID id,
            Integer apiId,
            String name,
            String position,
            Integer number,
            LocalDate birthdate,
            String nationality
    ) {
        Player player = new Player();
        player.setId(id);
        player.setApiId(apiId);
        player.setName(name);
        player.setPosition(position);
        player.setNumber(number);
        player.setBirthdate(birthdate);
        player.setNationality(nationality);
        return player;
    }

    private static Coach coach(
            UUID id,
            Integer apiId,
            String name,
            String nationality,
            LocalDate birthdate
    ) {
        Coach coach = new Coach();
        coach.setId(id);
        coach.setApiId(apiId);
        coach.setName(name);
        coach.setNationality(nationality);
        coach.setBirthdate(birthdate);
        return coach;
    }
}

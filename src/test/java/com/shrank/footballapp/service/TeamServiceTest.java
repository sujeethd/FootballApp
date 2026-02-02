package com.shrank.footballapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shrank.footballapp.domain.Team;
import com.shrank.footballapp.repository.TeamRepository;
import com.shrank.footballapp.web.dto.TeamDto;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {
    @Mock
    private TeamRepository teamRepository;

    @InjectMocks
    private TeamService teamService;

    @Test
    void getTeams_mapsEntitiesToDtosInRepositoryOrder() {
        Team brazil = team(
                UUID.fromString("11111111-1111-1111-1111-111111111111"),
                1001,
                "Brazil",
                "BRA",
                "Brazil",
                "https://flags.example/bra.png",
                1
        );
        Team argentina = team(
                UUID.fromString("22222222-2222-2222-2222-222222222222"),
                1002,
                "Argentina",
                "ARG",
                "Argentina",
                "https://flags.example/arg.png",
                2
        );

        when(teamRepository.findAllByOrderByNameAsc())
                .thenReturn(List.of(argentina, brazil));

        List<TeamDto> result = teamService.getTeams();

        assertThat(result).hasSize(2);
        assertThat(result.get(0)).isEqualTo(new TeamDto(
                argentina.getId(),
                argentina.getApiId(),
                argentina.getName(),
                argentina.getFifaCode(),
                argentina.getCountry(),
                argentina.getFlagUrl(),
                argentina.getWorldRanking()
        ));
        assertThat(result.get(1)).isEqualTo(new TeamDto(
                brazil.getId(),
                brazil.getApiId(),
                brazil.getName(),
                brazil.getFifaCode(),
                brazil.getCountry(),
                brazil.getFlagUrl(),
                brazil.getWorldRanking()
        ));

        verify(teamRepository).findAllByOrderByNameAsc();
    }

    private static Team team(
            UUID id,
            Integer apiId,
            String name,
            String fifaCode,
            String country,
            String flagUrl,
            Integer worldRanking
    ) {
        Team team = new Team();
        team.setId(id);
        team.setApiId(apiId);
        team.setName(name);
        team.setFifaCode(fifaCode);
        team.setCountry(country);
        team.setFlagUrl(flagUrl);
        team.setWorldRanking(worldRanking);
        return team;
    }
}

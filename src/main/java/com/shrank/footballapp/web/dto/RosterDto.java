package com.shrank.footballapp.web.dto;

import java.util.List;
import java.util.UUID;

public record RosterDto(
        UUID teamId,
        String teamName,
        List<PlayerDto> players,
        List<CoachDto> coaches
) {
}

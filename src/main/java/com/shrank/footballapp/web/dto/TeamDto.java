package com.shrank.footballapp.web.dto;

import java.util.UUID;

public record TeamDto(
        UUID id,
        Integer apiId,
        String name,
        String fifaCode,
        String country,
        String flagUrl,
        Integer worldRanking
) {
}

package com.shrank.footballapp.web.dto;

import java.time.Instant;
import java.util.UUID;

public record MatchDto(
        UUID id,
        Integer apiId,
        Instant kickoffUtc,
        String status,
        String venue,
        Integer scoreHome,
        Integer scoreAway,
        TeamSummaryDto homeTeam,
        TeamSummaryDto awayTeam
) {
}

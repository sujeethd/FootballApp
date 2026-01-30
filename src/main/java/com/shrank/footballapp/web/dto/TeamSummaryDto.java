package com.shrank.footballapp.web.dto;

import java.util.UUID;

public record TeamSummaryDto(
        UUID id,
        String name,
        String fifaCode
) {
}

package com.shrank.footballapp.web.dto;

import java.time.LocalDate;
import java.util.UUID;

public record CoachDto(
        UUID id,
        Integer apiId,
        String name,
        String nationality,
        LocalDate birthdate
) {
}

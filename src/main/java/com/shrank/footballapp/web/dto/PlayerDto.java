package com.shrank.footballapp.web.dto;

import java.time.LocalDate;
import java.util.UUID;

public record PlayerDto(
        UUID id,
        Integer apiId,
        String name,
        String position,
        Integer number,
        LocalDate birthdate,
        String nationality
) {
}

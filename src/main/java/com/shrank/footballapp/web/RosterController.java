package com.shrank.footballapp.web;

import com.shrank.footballapp.service.RosterService;
import com.shrank.footballapp.web.dto.RosterDto;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class RosterController {
    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @GetMapping("/{teamId}/roster")
    public ResponseEntity<RosterDto> getRoster(@PathVariable UUID teamId) {

        return ResponseEntity.ok(rosterService.getRoster(teamId));
    }
}

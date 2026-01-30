package com.shrank.footballapp.web;

import com.shrank.footballapp.service.TeamService;
import com.shrank.footballapp.web.dto.TeamDto;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<List<TeamDto>> getTeams() {
        return ResponseEntity.ok(teamService.getTeams());
    }
}

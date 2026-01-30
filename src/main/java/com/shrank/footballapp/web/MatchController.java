package com.shrank.footballapp.web;

import com.shrank.footballapp.service.MatchService;
import com.shrank.footballapp.web.dto.MatchDto;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<List<MatchDto>> getMatches(@RequestParam(required = false) UUID teamId) {
        return ResponseEntity.ok(matchService.getMatches(teamId));
    }
}
